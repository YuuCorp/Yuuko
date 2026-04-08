import path from "path";
import fs from "fs";
import { Client, type Command } from "#structures/index";
import { REST, Routes } from "discord.js";
import { env } from '#env';

export async function registerCommands(client: Client) {
  client.logger.info("Starting bot", { environment: env().NODE_ENV })

  const commandsPath = path.join(import.meta.dir, "..", "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

  client.logger.info("Loaded commands", { total: commandFiles.length })

  const slashCommands = commandFiles.map((file) => {
    const cmd = require(path.join(commandsPath, file)).default as Command;
    const builder = cmd?.withBuilder ?? {};

    const data = { ...builder, ...cmd };
    client.commands.set(data.name, data);
    return data;
  });

  client.logger.info("Loaded slash commands", { total: slashCommands.length })

  // ^ Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(env().TOKEN!);

  const clientId = env().CLIENT_ID;
  const guildId = env().GUILD_ID;

  try {
    client.logger.info(`Started refreshing ${slashCommands.length} slash (/) commands.`, {
      commands: slashCommands.map((x) => x.name),
    });

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

    if (env().NODE_ENV === "production" || env().NODE_ENV === "docker")
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });

    client.logger.info(`Refreshed ${slashCommands.length} slash (/) commands.`, {
      commands: slashCommands.map((x) => x.name),
    });
  } catch (error: any) {
    client.logger.error("Failed to refresh slash commands", { error: error?.message ?? error });
  }
}
