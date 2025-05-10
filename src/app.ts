import dotenvFlow from "dotenv-flow";
import { db, sqlite, tables } from "#database/db";
import { Client } from "#structures/index";
import { GatewayIntentBits } from "discord.js";
import { registerEvents, updateBotStats } from "#utils/index";
import { runChecks } from "#checks/run";
import path from "path";
import fs from "fs";
import { syncAnilistUsers, type WorkerResponseUnion } from "#workers/index";
import { env } from "#env";

dotenvFlow.config({ silent: true });

export const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildExpressions, GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds], allowedMentions: { repliedUser: false } });
const workerManager = new Worker("#workers/manager.ts");

process.on("SIGINT", () => {
  client.modules.closeAllModules();
  sqlite.close();
  process.exit();
})

async function start(token: string | undefined) {
  await registerEvents(client);
  await runChecks(client);

  client.login(token);
  await updateBotStats(client);

  const logPath = path.join(import.meta.dir, 'Logging/logs.json')
  const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

  if (!fs.existsSync(path.join(import.meta.dir, 'Logging')))
    fs.mkdirSync(path.join(import.meta.dir, 'Logging'))

  if (!fs.existsSync(logPath))
    fs.writeFileSync(logPath, JSON.stringify(
      [{
        date: currentDate,
        user: "SYSTEM_LOGGER",
        info: "Initialized log!"
      }]));

  env().UPTIME = Date.now();
}

async function initializeWorkerDB() {
  const syncEvent = await db.select().from(tables.workerEvents).limit(1);

  // only add if doesn't exist
  if (!syncEvent.length) {
    await db.insert(tables.workerEvents).values({
      type: "SYNC",
      period: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });
  };
}

await start(env().TOKEN);
await initializeWorkerDB();

// tell the worker to start a check loop
workerManager.postMessage(null);

workerManager.onmessage = async (e) => {
  if (!e.data.type) return;
  const data = e.data as WorkerResponseUnion;

  switch (data.type) {
    case "SYNC": {
      console.log("syncing users...");
      await syncAnilistUsers(data);
      break;
    }
  }
};