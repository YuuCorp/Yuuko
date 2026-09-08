import type { MaybePromise } from "./command"

interface CheckOptions {
  name: string
  description: string
  run: () => MaybePromise<void>
  optional: boolean
}

export class Check {
  name: string
  description: string
  run: () => MaybePromise<void>
  optional: boolean

  constructor(options: CheckOptions) {
    this.name = options.name
    this.description = options.description
    this.run = options.run
    this.optional = options.optional
  }
}
