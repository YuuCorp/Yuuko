import { ClientEvents, Interaction } from "discord.js";
import { Client } from "./Client";

export type ClientEvent = keyof ClientEvents;
export type Event<Event extends ClientEvent> = (...args: ClientEvents[Event]) => void;

export class YuukoEvent<K extends keyof ClientEvents> {
  event: K;
  run: (client: Client, ...args: ClientEvents[K]) => void;

  constructor(event: K, run: (client: Client, ...args: ClientEvents[K]) => void) {
    this.event = event;
    this.run = run;
  }
}
