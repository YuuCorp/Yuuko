import Discord, { Interaction } from "discord.js";
import { Middleware } from "./Middleware.js";

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

export class Command {
  name: string;
  description: string;
  usage: string;
  type: string;
  run: Function;
  slash?: Discord.SlashCommandBuilder;
  guildOnly?: boolean;
  middlewares?: Middleware[];
  autocomplete?: (interaction: Interaction) => void;
  /**
   * @param options
   */
  constructor(options: CommandOptions) {
    this.usage = options.usage;
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.run = options.run;
    if (options.slash) {
      this.slash = options.slash;
    }
    if (options.guildOnly) {
        this.guildOnly = options.guildOnly;
    }
    if (options.middlewares) {
      this.middlewares = options.middlewares;
    }
    if (options.autocomplete) {
      this.autocomplete = options.autocomplete;
    }
  }
}
