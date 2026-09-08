import type { SlashCommandBuilder, APIEmbedField, CacheType, ChatInputCommandInteraction, Interaction, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder, ButtonInteraction } from "discord.js";
import type { CommandCategories } from "#utils/commandCategories";
import type { Middleware, Client } from "./index";

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
  aniListId?: number;
  aniListToken?: string;
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
  autocomplete?: (interaction: Interaction) => MaybePromise<void>;

  withBuilder: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  run: <Args = any>(o: RunOptions<Args>, hookData?: hookData) => MaybePromise<void>;
}