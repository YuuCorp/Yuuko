import type { ClientEvents as DiscordClientEvents, Interaction } from 'discord.js'
import type { Client } from './client'

export type UsableClientEvents = DiscordClientEvents & {
  interactionCreate: [Interaction]
}
export type ClientEvent = keyof UsableClientEvents
export type YuukoEvent<Event extends ClientEvent> = (client: Client, ...args: UsableClientEvents[Event]) => void

interface YuukoEventOptions {
  event: string
  run: () => void
}

export class _YuukoEvent {
  event: string
  run: () => void

  constructor(options: YuukoEventOptions) {
    this.event = options.event;
    this.run = options.run;
  }
}