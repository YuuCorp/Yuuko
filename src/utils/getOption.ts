import type { UsableInteraction } from "#structures/command";
import type { User } from "discord.js";
import { YuukoError } from "./types";

export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): string;
export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): string | null;
export function getStringOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
    if (hookData && key in hookData && hookData[key] != null) {
        return hookData[key as string];
    }

    if (interaction.isChatInputCommand?.()) {
        return interaction.options.getString(key, required);
    }

    if (required) {
        throw new YuukoError(`Missing required option: ${key}`);
    }

    return null;
}

export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): User;
export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): User | null;
export function getUserOption<T extends Record<string, User | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
    if (hookData && key in hookData && hookData[key] != null) {
        return hookData[key as string];
    }

    if (interaction.isChatInputCommand?.()) {
        return interaction.options.getUser(key, required);
    }

    if (required) {
        throw new YuukoError(`Missing required user: ${key}`);
    }

    return null;
}

export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required: true): string;
export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required?: false): string | null;
export function getSubcommandOption<T extends Record<string, string | unknown> | undefined>(interaction: UsableInteraction, hookData: T, key: keyof NonNullable<T> & string, required = false) {
    if (hookData && key in hookData && hookData[key] != null) {
        return hookData[key as string];
    }

    if (interaction.isChatInputCommand?.()) {
        return interaction.options.getSubcommand(required);
    }

    if (required) {
        throw new YuukoError(`Missing required subcommand: ${key}`);
    }

    return null;
}
