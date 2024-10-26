import path from "path";
import fs from "fs";
import { Client, type Command } from "#structures/index";
import { REST, Routes } from "discord.js";

export async function registerCommands(client: Client) {
  client.log(`Starting Yuuko in ${process.env.NODE_ENV} enviroment.`, "Info");
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
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

  const clientId = process.env.CLIENT_ID || "867010131745177621";
  const guildId = process.env.GUILD_ID || "843208877326860299";

  try {
    client.log(`Started refreshing ${slashCommands.length} slash (/) commands.`, "Info");

    client.log(`Commands: ${slashCommands.map((x) => x.name).join(", ")}`, "Info");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "docker") await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });

    client.log(`Refreshed ${slashCommands.length} slash (/) commands.`, "Info");
  } catch (error: any) {
    client.log(error?.message ?? error, "Info");
  }
}
