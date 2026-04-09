import type { UsableInteraction } from "#structures/command";
import type { User } from "discord.js";
import { YuukoError } from "./types";
import { client } from "#src/app";

/**
 * Reads a string option from either the chat-input interaction or the
 * hookData passed by another command. Hook data takes precedence so commands
 * can be invoked programmatically by other commands.
 * @example const query = getStringOption(interaction, hookData, "anime", true)
 */
export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): string;
export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): string | null;
export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
  let returnValue;

  if (hookData && key in hookData && hookData[key] != null) {
    returnValue = hookData[key as string];
  } else if (interaction.isChatInputCommand?.()) {
    returnValue = interaction.options.getString(key, required);
  }

  client.logger.debug("getStringOption", { type: "generic", key, required, value: returnValue });

  if (required && returnValue == null) {
    throw new YuukoError(`Missing required option: ${key}`);
  }

  return returnValue;
}

/**
 * Reads a Discord User option from either the interaction or hookData.
 * Hook data takes precedence so commands can be invoked programmatically.
 * @example const target = getUserOption(interaction, hookData, "user", true)
 */
export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): User;
export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): User | null;
export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
  let returnValue;

  if (hookData && key in hookData && hookData[key] != null) {
    returnValue = hookData[key as string];
  } else if (interaction.isChatInputCommand?.()) {
    returnValue = interaction.options.getUser(key, required);
  }

  client.logger.debug("getUserOption", { type: "generic", key, required, value: returnValue });

  if (required && returnValue == null) {
    throw new YuukoError(`Missing required user: ${key}`);
  }

  return returnValue;
}

/**
 * Reads the active subcommand from either the interaction or hookData.
 * Hook data is keyed by `key` (typically "subcommandType") so the calling
 * command can pretend it received a slash subcommand.
 * @example const sub = getSubcommandOption(interaction, hookData, "subcommandType", true)
 */
export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): string;
export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): string | null;
export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
  let returnValue;

  if (hookData && key in hookData && hookData[key] != null) {
    returnValue = hookData[key as string];
  } else if (interaction.isChatInputCommand?.()) {
    returnValue = interaction.options.getSubcommand(required);
  }

  client.logger.debug("getSubcommandOption", { type: "generic", key, required, value: returnValue });

  if (required && returnValue == null) {
    throw new YuukoError(`Missing required subcommand: ${key}`);
  }

  return returnValue;
}
