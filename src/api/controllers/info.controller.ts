import fs from "node:fs";
import { desc } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db, tables } from "#database/db";
import { getStats } from "#utils/botStats";
import { srcPath } from "#utils/paths";
import { LogEntrySchema } from "#src/utils/logger";

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
        {
            detail: {
                summary: "Get Audit Logs",
                description: "Retrieves Winston log entries typed by LogLevel and LogMeta variants.",
                tags: ["Protected / Info"],
            },
            response: {
                200: t.Array(LogEntrySchema),
                401: t.Object({ message: t.String() }),
            },
        }
    )
    .get(
        "/announcements",
        async ({ set }) => {
            set.headers["content-type"] = "application/json";
            set.status = 200;

            const announcements = await db.query.announcementModel.findMany({
                orderBy: desc(tables.announcementModel.id),
            });

            return announcements.map((a) => ({
                ...a,
                date: a.date instanceof Date ? a.date.toISOString() : String(a.date),
            }));
        },
        {
            detail: {
                summary: "List Announcements",
                tags: ["Protected / Info"],
            },
            response: {
                200: t.Array(
                    t.Object({
                        id: t.Number(),
                        announcement: t.String(),
                        date: t.String(),
                    })
                ),
            },
        },
    )
    .get(
        "/stats",
        async ({ set }) => {
            set.headers["content-type"] = "application/json";
            set.status = 200;
            return await getStats();
        },
        {
            detail: {
                summary: "Get Bot Metrics",
                tags: ["Protected / Info"],
            }, response: {
                200: t.Object({
                    servers: t.Number(),
                    members: t.Number(),
                    registered: t.Number(),
                }),
            },
        },

    );

function readLogFile() {
    const logPath = srcPath("logging", "logs.json");
    const lines = fs.readFileSync(logPath, "utf-8").split("\n").filter(Boolean);
    return lines.map((line) => JSON.parse(line));
}