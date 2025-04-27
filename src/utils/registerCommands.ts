import path from "path";
import fs from "fs";
import { Client, type Command } from "#structures/index";
import { REST, Routes } from "discord.js";
import { env } from '#env';

export async function registerCommands(client: Client) {
  client.log(`Starting Yuuko in ${env().NODE_ENV} enviroment.`, "Info");
  const commandsPath = path.join(import.meta.dir, "..", "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
  client.log(`Loading ${commandFiles.length} commands.`, "Info");
  const slashCommands = commandFiles.map((file) => {
    const cmd = require(path.join(commandsPath, file)).default as Command;
    const builder = cmd?.withBuilder ?? {};

    delete cmd.withBuilder;

    const data = { ...builder, ...cmd };
    client.commands.set(data.name, data);
    return data;
  });

  client.log(`Loaded ${slashCommands.length} slash (/) commands.`, "Info");

  // ^ Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(env().TOKEN!);

  const clientId = env().CLIENT_ID;
  const guildId = env().GUILD_ID;

  try {
    client.log(`Started refreshing ${slashCommands.length} slash (/) commands.`, "Info");

    client.log(`Commands: ${slashCommands.map((x) => x.name).join(", ")}`, "Info");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

    if (env().NODE_ENV === "production" || env().NODE_ENV === "docker") await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });

    client.log(`Refreshed ${slashCommands.length} slash (/) commands.`, "Info");
  } catch (error: any) {
    client.log(error?.message ?? error, "Info");
  }
}
