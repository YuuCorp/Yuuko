import dotenvFlow, { config } from "dotenv-flow";
import { sqlite } from "./Database";
import { Client } from "./Structures/Client";
import { GatewayIntentBits } from "discord.js";
import { registerEvents } from "./Utils";
import { runChecks } from "./Checks/Run";
import path from "path";
import fs from "fs";

process.on("SIGINT", () => {
  sqlite.close();
  process.exit();
})

dotenvFlow.config({ silent: true });

export const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds], allowedMentions: { repliedUser: false } });

async function start(token: string | undefined) {
  await registerEvents(client);
  await runChecks(client);

  client.login(token);

  const logPath = path.join(__dirname, 'Logging/logs.txt')
  const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  
  if (!fs.existsSync(path.join(__dirname, 'Logging')))
    fs.mkdirSync(path.join(__dirname, 'Logging'))

  if (!fs.existsSync(logPath))
    fs.writeFileSync(logPath, `${currentDate}: Initialised log file`)

  process.env.UPTIME = Date.now();
}
start(process.env.TOKEN);
