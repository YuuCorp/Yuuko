import dotenvFlow, { config } from "dotenv-flow";
import { sqlite } from "./database";
import { Client } from "./structures/client";
import { GatewayIntentBits } from "discord.js";
import { registerEvents } from "./utils";
import { runChecks } from "./checks/run";
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

  process.env.UPTIME = Date.now();
}

async function makeRSAPair() {
  const RSAdirectory = path.join(import.meta.dir, 'RSA');
  if (fs.existsSync(RSAdirectory)) return;
  const dec = new TextDecoder();

  const keyPair = await globalThis.crypto.subtle.generateKey({
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // Value taken from https://developer.mozilla.org/en-US/docs/Web/API/RsaHashedKeyGenParams#publicexponent
    hash: "SHA-256",
  }, true, ['encrypt', 'decrypt'])

  const publicKey = await globalThis.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await globalThis.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)

  const exportedPublicKey = '-----BEGIN PUBLIC KEY-----\n' +
    btoa(String.fromCharCode.apply(null, [...new Uint8Array(publicKey)])).replace(/.{64}/g, '$&\n') + '\n-----END PUBLIC KEY-----';
  const exportedPrivateKey = '-----BEGIN PRIVATE KEY-----\n' + // Inserts a newline every 64 characters
    btoa(String.fromCharCode.apply(null, [...new Uint8Array(privateKey)])).replace(/.{64}/g, '$&\n') + '\n-----END PRIVATE KEY-----';

  fs.mkdirSync(RSAdirectory);

  fs.writeFileSync(path.join(RSAdirectory, 'id_rsa'), exportedPrivateKey);
  fs.writeFileSync(path.join(RSAdirectory, 'id_rsa.pub'), exportedPublicKey);

  client.log("Successfully generated the RSA key pair!")
}

makeRSAPair();
start(process.env.TOKEN);
