import { ActivityType } from "discord.js";
import type { YuukoEvent } from "../Structures";
import { registerCommands } from "../Utils";
import { registerComponents } from "../Utils/registerComponents";

export const run: YuukoEvent<"ready"> = async (client) => {
  if (!client.user) return;
  setInterval(async () => {
    client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
  }, 15000);

  await registerCommands(client);
  await registerComponents(client);

  client.log(`${client.user.tag} is ready!`);
};