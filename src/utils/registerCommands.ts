import path from "path";
import fs from "fs";
import { Client, type Command } from "#structures/index";
import { REST, Routes } from "discord.js";
import { env } from '#env';

export async function registerCommands(client: Client) {
  client.logger.info("Starting bot", { type: "startup", environment: env().NODE_ENV })

  const commandsPath = path.join(import.meta.dir, "..", "commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

  client.logger.info("Loaded commands", { type: "startup", total: commandFiles.length, commands: commandFiles })

  const slashCommands = await Promise.all(commandFiles.map(async (file) => {
    const cmd = (await import(path.join(commandsPath, file))).default as Command;
    const builder = cmd?.withBuilder;
    const builderJson = builder && typeof (builder as any).toJSON === "function" ? (builder as any).toJSON() : (builder ?? {});

    const data = { ...builderJson, ...cmd };
    client.commands.set(data.name, data);
    return data;
  }));

  client.logger.info("Loaded slash commands", { type: "startup", total: slashCommands.length })

  // ^ Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(env().TOKEN!);

  const clientId = env().CLIENT_ID;
  const guildId = env().GUILD_ID;

  try {
    client.logger.info(`Started refreshing ${slashCommands.length} slash (/) commands.`, {
      type: "startup",
      commands: slashCommands.map((x) => x.name),
    });

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

    if (env().NODE_ENV === "production" || env().NODE_ENV === "docker")
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });

    client.logger.info(`Refreshed ${slashCommands.length} slash (/) commands.`, {
      type: "startup",
      commands: slashCommands.map((x) => x.name),
    });
  } catch (error: any) {
    client.logger.error("Failed to refresh slash commands", { type: "startup", error: error?.message ?? error });
  }
}
