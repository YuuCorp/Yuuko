import type { ClientEvents as DiscordClientEvents, Interaction } from 'discord.js'
import type { Client } from './client'
import type { MaybePromise } from './command'

export type UsableClientEvents = DiscordClientEvents & {
  interactionCreate: [Interaction]
}
export type ClientEvent = keyof UsableClientEvents


type YuukoEventRun<Event extends ClientEvent> = (client: Client, ...args: UsableClientEvents[Event]) => MaybePromise<void>;
interface YuukoEventOptions<Event extends ClientEvent> {
  event: Event
  isOnce?: boolean,
  run: YuukoEventRun<Event>;
}

export class YuukoEvent<Event extends ClientEvent> {
  event: Event
  isOnce: boolean
  run: YuukoEventRun<Event>;

  constructor(options: YuukoEventOptions<Event>) {
    this.event = options.event;
    this.isOnce = options.isOnce ?? false;
    this.run = options.run;
  }
}