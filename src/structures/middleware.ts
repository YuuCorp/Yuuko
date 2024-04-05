import type { Interaction } from 'discord.js'
import type { UsableInteraction } from '.'

type InteractionRunner = (interaction: UsableInteraction) => void
type AsyncInteractionRunner = (interaction: UsableInteraction) => Promise<void>
export interface MiddlewareOptions {
  name: string
  description: string
  run: InteractionRunner | AsyncInteractionRunner
  defer?: boolean
}

export class Middleware {
  name: string
  description: string
  run: InteractionRunner | AsyncInteractionRunner
  defer: boolean = false

  constructor(options: MiddlewareOptions) {
    this.name = options.name
    this.description = options.description
    this.run = options.run
    if (options.defer) this.defer = options.defer
  }
}
