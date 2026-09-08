import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import type { Client, ClientEvent, YuukoEvent } from "#structures/index";
import { srcPath } from "./paths";
import { logger } from "#src/utils/logger";

export async function registerEvents(client: Client) {
  const eventsPath = srcPath("events");
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

  const events: YuukoEvent<ClientEvent>[] = [];

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const module = await import(filePath) as { default: YuukoEvent<ClientEvent>[] };

    events.push(...module.default);
  }

  for (const event of events) {
    if (typeof event.run !== "function") {
      logger.error("Event has no run function", { type: "generic", event: event.event })
      process.exit(0);
    }

    const handler = (...args: unknown[]) => {
      void (event.run as (client: Client, ...args: unknown[]) => unknown)(client, ...args);
    };

    if (event.isOnce) {
      client.once(event.event, handler);
    } else {
      client.on(event.event, handler);
    }

    logger.info(`Registered event listener`, {
      type: "event",
      name: event.event,
      isOnce: event.isOnce
    });
  }
}
