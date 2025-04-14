import { ActivityType } from "discord.js";
import { YuukoEvent } from "#structures/index";
import { registerCommands, registerComponents, updateBotStats } from "#utils/index";

const ready = new YuukoEvent({
  event: "ready",
  run: async (client) => {
    if (!client.user) return;
    setInterval(async () => {
      await updateBotStats(client);
      client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
    }, 15000);

    await registerCommands(client);
    await registerComponents(client);

    client.log(`${client.user.tag} is ready!`, "Info");
  }
});

export default [ready];