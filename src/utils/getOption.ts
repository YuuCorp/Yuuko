import type { UsableInteraction } from "#structures/command";
import type { User } from "discord.js";
import { YuukoError } from "./types";
import { client } from "#src/app";

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
