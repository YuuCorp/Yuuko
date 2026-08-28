import { execSync, spawnSync } from "child_process";
import { Elysia, t } from "elysia";
import { db, sqlite, tables } from "#database/db";
import fs from "fs";
import { srcPath } from "#utils/paths";

export const triggerController = new Elysia({
  prefix: "/trigger",
  name: "api:admin",
})
  .post(
    "/restart",
    async ({ set }) => {
      const update = spawnSync("sh", ["update.sh"]);
      sqlite.close();
      set.status = 202;
      return { message: "Successfully restarted the bot!" };
    },
    {
      detail: {
        summary: "Trigger Bot & API Restart",
        description: "Executes update script, closes database connection, and restarts PM2 processes.",
        tags: ["Protected / Admin"],
      },
      afterHandle() {
        execSync('pm2 restart "Yuuko Production"', { encoding: "utf-8" });
        setTimeout(() => execSync('pm2 restart "Yuuko Production API"', { encoding: "utf-8" }), 500);
      },
      response: {
        202: t.Object({ message: t.String() }),
      },
    },
  )
  .post(
    "/wipe-logs",
    async ({ set }) => {
      const logPath = srcPath("logging", "logs.json");

      if (fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, "", "utf8");
      }

      set.status = 200;
      return { message: "Wiped all logs!" };
    },
    {
      detail: {
        summary: "Wipe Audit Logs",
        description: "Truncates the logs.json file.",
        tags: ["Protected / Admin"],
      }, response: {
        200: t.Object({ message: t.String() }),
      },
    },
  ).post(
    "/create-announcement",
    async ({ body, set }) => {
      const entryDate = new Date(body.date);
      const dbEntry = {
        announcement: body.announcement,
        date: entryDate,
      };

      const announcementID = (await db.insert(tables.announcementModel).values(dbEntry).returning({ id: tables.announcementModel.id }))[0];
      set.status = 201;

      return { message: `Succesfully created announcement #${announcementID?.id || "Unknown"}!` };
    },
    {
      detail: {
        summary: "Create Announcement",
        tags: ["Protected / Info"],
      }, body: t.Object({ announcement: t.String(), date: t.String() }), response: {
        201: t.Object({ message: t.String() }),
      },
    },
  );
