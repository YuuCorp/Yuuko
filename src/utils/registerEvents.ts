import path from "path";
import fs from "fs";
import { removeExtension } from ".";
import type { Client, YuukoEvent } from "#structures/index";

export async function registerEvents(client: Client) {
  const eventsPath = path.join(import.meta.dir, "..", "events");

  const events: YuukoEvent<any>[] = (
    await Promise.all(
      fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith('.ts'))
        .map(async (file) => {
          const event = await import(path.join(eventsPath, file))
          return event.default
        }),
    )
  ).flat();

  for (const event of events) {

    if (!event.run) {
      client.log(`Event ${event.event} does not have a run function`, "EventRegister");
      process.exit(0);
    }

    client[event.isOnce ? "once" : "on"](event.event, (...args) => event.run(client, ...args));
    client.log(`Registered ${event.isOnce ? "once" : "on"}.${event.event}`, "EventRegister");
  }
}
