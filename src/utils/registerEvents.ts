import path from "path";
import fs from "fs";
import { removeExtension } from ".";
import type { Client } from "../structures";

export async function registerEvents(client: Client) {
  const eventsPath = path.join(import.meta.dir, "..", "events");

  fs.readdirSync(eventsPath)
    .filter((x) => x.endsWith(".ts"))
    .forEach((fileName) => {
      const event = require(`${eventsPath}/${fileName}`);
      let eventName = removeExtension(fileName);

      if (!event?.run) {
        client.log(`Event ${eventName} (${eventsPath}/${fileName}) does not have a run function`);
        process.exit(0);
      }
      const isOnce = eventName.startsWith("$");
      eventName = eventName.substring(isOnce ? 1 : 0);
      client[isOnce ? "once" : "on"](eventName, (...args) => event.run(client, ...args));
      client.log(`Registered ${isOnce ? "once" : "on"}.${eventName} (${eventsPath}/${fileName})`);
    });
}
