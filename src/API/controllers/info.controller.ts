import { getStats } from "#Utils/getStats.ts";
import { db, tables } from "../../Database";
import { desc } from "drizzle-orm";
import { Elysia, t } from "elysia";
import path from "path";
import fs from "fs";

const srcFolder = path.join(__dirname, '..', '..');

export const infoController = new Elysia({
  prefix: "/info",
  name: "api:admin",
})
  .get("/logs", ({ set }) => {
    set.headers["content-type"] = "application/json";
    set.status = 200;
    return readLogFile();
  }, { response: t.Array(t.Object( { date: t.String(), user: t.String(), info: t.String() } )) })
  .get("/announcements", async ({ set }) => {
    set.headers["content-type"] = "application/json";
    set.status = 200;
    return await db.query.announcementModel.findMany({ orderBy: desc(tables.announcementModel.id) });
  }, { response: t.Array(
        t.MaybeEmpty(
            t.Object({
                id: t.Number(),
                announcement: t.String(),
                date: t.Date(),
                createdAt: t.Date(),
                updatedAt: t.Date(),
            }))) // yo what's up brother // hello, i'm on admin panel rn trying to figure out how to yk connect the api already
    })
  .get("/stats", async ({ set }) => {
    set.headers["content-type"] = "application/json";
    set.status = 200;
    return await getStats(client);
  }, { response: t.Object({ servers: t.Number(), members: t.Number(), registered: t.Number() }) })
  .post("/create-announcement", async ({ query, set }) => {
    set.status = 201;
    const entryDate = new Date(query.date)
    const dbEntry = {
        announcement: query.announcement,
        date: entryDate,
        createdAt: entryDate,
        updatedAt: entryDate,
    }
    
    await db.insert(tables.announcementModel).values(dbEntry) 

    return query;
  }, { query: t.Object({ announcement: t.String(), date: t.String() }), body: t.Object({ announcement: t.String(), date: t.String() }) })

function readLogFile() {
    const logPath = path.join(srcFolder, 'Logging', 'logs.json');
    return JSON.parse(fs.readFileSync(logPath, 'utf-8'));
}