import path from "node:path";
import fs from "node:fs";
import type { Client, Command } from "#structures/index";
import { REST, Routes } from "discord.js";
import { env } from '#env';
import { srcPath } from "./paths";
import { logger } from "#src/utils/logger";

export async function registerCommands(client: Client) {
  const environment = env.NODE_ENV;
  logger.info("Starting bot", { type: "startup", environment })

  const commandsPath = srcPath("commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

  logger.info("Loaded commands", { type: "startup", total: commandFiles.length, commands: commandFiles })
  const slashCommands: Command[] = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const module = await import(filePath) as { default: Command };

    slashCommands.push(module.default);
  }

  const commandPayloads = slashCommands.map((command) => {
    client.commands.set(command.name, command);
    return command.withBuilder.toJSON();
  });

  logger.info("Loaded slash commands", { type: "startup", total: slashCommands.length })

  // ^ Register Slash Commands
  const rest = new REST({ version: "10" }).setToken(env.TOKEN);

  const clientId = env.CLIENT_ID;
  const guildId = env.GUILD_ID;
  const isProduction = environment === "production" || environment === "docker";

  try {
    logger.info(`Started refreshing ${slashCommands.length} slash (/) commands.`, {
      type: "startup",
      commands: slashCommands.map((x) => x.name),
    });

    if (isProduction) {
      await rest.put(Routes.applicationCommands(clientId), { body: commandPayloads });
    } else {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandPayloads });
    }

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

    logger.info(`Refreshed ${slashCommands.length} slash (/) commands.`, {
      type: "startup",
      commands: slashCommands.map((x) => x.name),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Failed to refresh slash commands", { type: "startup", error: message });
  }
}
