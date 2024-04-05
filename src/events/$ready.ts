import { ActivityType } from "discord.js";
import type { YuukoEvent } from "../structures";
import { registerCommands } from "../utils";
import { registerComponents } from "../utils/registerComponents";

export const run: YuukoEvent<"ready"> = async (client) => {
  if (!client.user) return;
  setInterval(async () => {
    client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
  }, 15000);

  await registerCommands(client);
  await registerComponents(client);

  client.log(`${client.user.tag} is ready!`);
};
