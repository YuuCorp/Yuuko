import { execSync, spawn, spawnSync } from "child_process";
import { Elysia, t } from "elysia";
import { sqlite } from "../../Database";

export const triggerController = new Elysia({
  prefix: "/trigger",
  name: "api:admin",
})
  .post('/restart', async ({ set }) => {
    const update = spawnSync('sh', ['update.sh'])

    set.status = 200
    sqlite.close();
    return { message: "Successfully restarted the bot!" }
  }, { afterHandle() {
    setTimeout(() => execSync('pm2 restart "Yuuko Production"', { encoding: 'utf-8' }), 250)
  } })
  .post('/wipe-logs', async () => {
	  console.log("Wipe logs")
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { message: "Wiped all logs!" }
  })
