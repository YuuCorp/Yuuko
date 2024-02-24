import { execSync, spawn } from "child_process";
import { Elysia, t } from "elysia";
import { $ } from "bun";
import { sqlite } from "../../Database";

export const triggerController = new Elysia({
  prefix: "/trigger",
  name: "api:admin",
})
  .post('/restart', async () => {
	  console.log("Restart")
    await new Promise(resolve => setTimeout(resolve, 2000))
    return "Successfully restarted the bot!"
  })
  .post('/update', async () => {

    const updateNeeded = await $`git fetch --dry-run`.text();
    if(!updateNeeded) return "No updates available!"

    const update = spawn('sh', ['update.sh'])

    update.stderr.on('data', (data) => console.log(data.toString()))
    update.on('close', async (code) => {
      console.log(`Procedures completed with code ${code}, restarting...`)
      sqlite.close();
    })

    return "Successfully updated the bot!"
  }, { afterHandle() { execSync('pm2 restart "Yuuko Production"', { encoding: 'utf-8' }) } })
  .post('/wipe-logs', async () => {
	  console.log("Wipe logs")
    await new Promise(resolve => setTimeout(resolve, 2000))
    return "Wiped all logs!"
  })
