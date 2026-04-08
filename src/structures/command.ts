import type { SlashCommandBuilder, APIEmbedField, ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Interaction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder, ButtonInteraction } from "discord.js";
import type { CommandCategories } from "#utils/commandCategories";
import type { Middleware, Client } from "./index";

export interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  type: string;
  run: Function;
  slash?: SlashCommandBuilder;
  guildOnly?: boolean;
  middlewares?: Middleware[];
  autocomplete?: (interaction: Interaction) => void;
}

export type MaybePromise<T> = T | Promise<T>;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface RunOptions<Args = any> {
  client: Client;
  interaction: UsableInteraction;
  args?: Args;
}

type BaseExtension = {
  alID?: number;
  ALtoken?: string;
};

export type UsableInteraction =
  | (ChatInputCommandInteraction<CacheType> & BaseExtension)
  | (ButtonInteraction<CacheType> & BaseExtension);

export type HookData = Partial<{
  fields: APIEmbedField[];
  title: string;
  id: number;
  image: string;
}>

export type CommandType = (typeof CommandCategories)[keyof typeof CommandCategories];

export interface Command<hookData = undefined> {
  name: string;
  description: string;
  usage?: string;
  cooldown?: number;
  commandType: CommandType;
  guildOnly?: boolean;
  middlewares?: Middleware[];
  autocomplete?: (interaction: Interaction) => void;

  withBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: <Args = any>(o: RunOptions<Args>, hookData?: hookData) => MaybePromise<void>;
}