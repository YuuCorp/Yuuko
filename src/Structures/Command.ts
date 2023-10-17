import type { APIEmbedField, ApplicationCommandOptionType, Interaction } from "discord.js";
import type Discord from "discord.js";
import type { CommandCategories } from "../Utils/CommandCategories";
import type { Middleware } from "./Middleware.js";
import type { Client } from "./Client.js";

export interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  type: string;
  run: Function;
  slash?: Discord.SlashCommandBuilder;
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

export type UsableInteraction = Interaction & { alID?: number, ALtoken?: string }

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

export type RunOptionsWithHooks<Args = any> = RunOptions<Args> &
  Partial<{
    hook: boolean;
    hookdata: {
      fields: APIEmbedField[];
      title?: string;
      id: number;
      image: string;
    };
  }>;

export type CommonCommandWithHook = Omit<CommonCommand, "run"> & {
  run: <Args = any>(o: RunOptionsWithHooks<Args>) => MaybePromise<void>;
};

export interface CommonCommand {
  name: string;
  description: string;
  usage?: string;
  commandType: (typeof CommandCategories)[keyof typeof CommandCategories];
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
