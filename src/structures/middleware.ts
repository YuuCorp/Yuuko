import type { Client, MaybePromise, UsableInteraction } from '.'

type InteractionRunner = (interaction: UsableInteraction, client: Client) => MaybePromise<void>
export interface MiddlewareOptions {
  name: string
  description: string
  run: InteractionRunner
  defer?: boolean
}

export class Middleware {
  name: string
  description: string
  run: InteractionRunner;
  defer: boolean = false

  constructor(options: MiddlewareOptions) {
    this.name = options.name
    this.description = options.description
    this.run = options.run
    if (options.defer) this.defer = options.defer
  }
}
