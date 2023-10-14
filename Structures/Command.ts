import type { Interaction } from "discord.js";
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
  interaction: Interaction & { alID?: string };
  args: Args;
}

export interface Command {
  name: string;
  description: string;
  usage?: string;
  type?: (typeof CommandCategories)[keyof typeof CommandCategories];
  run: <Args = any>(o: RunOptions<Args>) => MaybePromise<void>;
  slash?: any;
  guildOnly?: boolean;
  middlewares?: Middleware[];
  autocomplete?: (interaction: Interaction) => void;
}
