import { Interaction } from "discord.js";

type InteractionRunner = (interaction: Interaction) => void;
type AsyncInteractionRunner = (interaction: Interaction) => Promise<void>;
export interface MiddlewareOptions {
  name: string;
  description: string;
  run: InteractionRunner | AsyncInteractionRunner;
}

export class Middleware {
  name: string;
  description: string;
  run: InteractionRunner | AsyncInteractionRunner;
  
  constructor(options: MiddlewareOptions) {
    this.name = options.name;
    this.description = options.description;
    this.run = options.run;
  }
}
