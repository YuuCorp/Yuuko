import type { ClientEvents as DiscordClientEvents, Interaction } from 'discord.js'
import type { Client } from './client'

export type UsableClientEvents = DiscordClientEvents & {
  interactionCreate: [Interaction]
}
export type ClientEvent = keyof UsableClientEvents
export type YuukoEvent<Event extends ClientEvent> = (client: Client, ...args: UsableClientEvents[Event]) => void


type YuukoEventRun = (client: Client, ...args: UsableClientEvents[ClientEvent]) => void;
interface YuukoEventOptions {
  event: ClientEvent
  run: YuukoEventRun;
}

export class _YuukoEvent {
  event: ClientEvent
  run: YuukoEventRun;

  constructor(options: YuukoEventOptions) {
    this.event = options.event;
    this.run = options.run;
  }
}