import { execSync, spawnSync } from "child_process";
import { Elysia, t } from "elysia";
import { sqlite } from "../../database";
import path from "path";
import fs from "fs";

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
      afterHandle() {
        execSync('pm2 restart "Yuuko Production"', { encoding: "utf-8" });
        setTimeout(() => execSync('pm2 restart "Yuuko Production API"', { encoding: "utf-8" }), 500);
      },
      response: t.Object({ message: t.String() }),
    },
  )
  .post(
    "/wipe-logs",
    async () => {
      const logPath = path.join(import.meta.dir, "..", "..", "Logging", "logs.json");
      fs.writeFileSync(logPath, JSON.stringify([]), "utf8");
      return { message: "Wiped all logs!" };
    },
    { response: t.Object({ message: t.String() }) },
  );
