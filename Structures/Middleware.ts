import type { Interaction } from 'discord.js'
import type { UsableInteraction } from '.'

type InteractionRunner = (interaction: UsableInteraction) => void
type AsyncInteractionRunner = (interaction: UsableInteraction) => Promise<void>
export interface MiddlewareOptions {
  name: string
  description: string
  run: InteractionRunner | AsyncInteractionRunner
}

export class Middleware {
  name: string
  description: string
  run: InteractionRunner | AsyncInteractionRunner

  constructor(options: MiddlewareOptions) {
    this.name = options.name
    this.description = options.description
    this.run = options.run
  }
}
