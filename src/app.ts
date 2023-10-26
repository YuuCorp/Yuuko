import dotenvFlow from "dotenv-flow";
import { Client } from "./Structures/Client";
import { GatewayIntentBits } from "discord.js";
import { registerEvents } from "./Utils";
import path from "path";
import fs from "fs";

dotenvFlow.config();

const client = new Client({ intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds], allowedMentions: { repliedUser: false } });

async function start(token: string | undefined) {
  await registerEvents(client);

  client.login(token);

  if (!fs.existsSync(path.join(__dirname, "../Logging"))) fs.mkdirSync(path.join(__dirname, "../Logging"));
  process.env.UPTIME = Date.now();
}
start(process.env.TOKEN);
