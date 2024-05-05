import path from "node:path";
import fs from "node:fs";
import { desc } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db, tables } from "#database/db";
import { getStats } from "#utils/botStats";

const srcFolder = path.join(import.meta.dir, "..", "..");

export const infoController = new Elysia({
    prefix: "/info",
    name: "api:admin",
})
    .get(
        "/logs",
        ({ set }) => {
            set.headers["content-type"] = "application/json";
            set.status = 200;
            return readLogFile();
        },
        { response: t.Array(t.Object({ date: t.String(), user: t.String(), info: t.String() })) },
    )
    .get(
        "/announcements",
        async ({ set }) => {
            set.headers["content-type"] = "application/json";
            set.status = 200;
            return db.query.announcementModel.findMany({ orderBy: desc(tables.announcementModel.id) });
        },
        {
            response: t.Array(
                t.MaybeEmpty(
                    t.Object({
                        id: t.Number(),
                        announcement: t.String(),
                        date: t.Date(),
                        createdAt: t.Date(),
                        updatedAt: t.Date(),
                    }),
                ),
            ),
        },
    )
    .get(
        "/stats",
        async ({ set }) => {
            set.headers["content-type"] = "application/json";
            set.status = 200;
            return await getStats();
        },
        { response: t.Object({ servers: t.Number(), members: t.Number(), registered: t.Number() }) },
    )
    .post(
        "/create-announcement",
        async ({ body, set }) => {
            const entryDate = new Date(body.date);
            const dbEntry = {
                announcement: body.announcement,
                date: entryDate,
                createdAt: entryDate,
                updatedAt: entryDate,
            };

            const announcementID = (await db.insert(tables.announcementModel).values(dbEntry).returning({ id: tables.announcementModel.id }))[0];
            set.status = 201;

            return { message: `Succesfully created announcement #${announcementID?.id || "Unknown"}!` };
        },
        { body: t.Object({ announcement: t.String(), date: t.String() }), response: t.Object({ message: t.String() }) },
    );

function readLogFile() {
    const logPath = path.join(srcFolder, "Logging", "logs.json");
    return JSON.parse(fs.readFileSync(logPath, "utf-8"));
}
