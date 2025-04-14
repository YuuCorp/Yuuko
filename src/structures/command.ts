import type { SlashCommandBuilder, APIEmbedField, ApplicationCommandOptionType, CacheType, ChatInputCommandInteraction, Interaction } from "discord.js";
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

export interface RunOptions<Args = any> {
  client: Client;
  interaction: UsableInteraction;
  args?: Args;
}

export type UsableInteraction = ChatInputCommandInteraction<CacheType> & {
  alID?: number,
  ALtoken?: string
};

interface CommandStringOption {
  name: string;
  description: string;
  required?: boolean;
  type: ApplicationCommandOptionType;
  choices?: {
    name: string;
    value: string;
  }[];
}

export type HookData = Partial<{
  fields: APIEmbedField[];
  title: string;
  id: number;
  image: string;
}>

export type RunOptionsWithHooks<Args = any> = RunOptions<Args> &
  Partial<{
    hook: boolean;
    hookdata: HookData;
  }>;

export type CommonCommandWithHook = Omit<CommonCommand, "run"> & {
  run: <Args = any>(o: RunOptionsWithHooks<Args>) => MaybePromise<void>;
};

export type CommandType = (typeof CommandCategories)[keyof typeof CommandCategories];

export interface CommonCommand {
  name: string;
  description: string;
  usage?: string;
  cooldown?: number;
  commandType: CommandType;
  run: <Args = any>(o: RunOptions<Args>) => MaybePromise<void>;
  guildOnly?: boolean;
  middlewares?: Middleware[];
  autocomplete?: (interaction: Interaction) => void;
}

export type Command = CommonCommand & {
  withBuilder?: any;
}

export type CommandWithHook = CommonCommandWithHook & {
  withBuilder?: any;
}

export type ClientCommand = CommonCommand & {
  options?: CommandStringOption[];
}
