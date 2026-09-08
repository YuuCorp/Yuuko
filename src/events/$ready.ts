import { ActivityType } from "discord.js";
import { YuukoEvent } from "#structures/index";
import { handleAsync, registerCommands, registerComponents, updateBotStats } from "#utils/index";
import { logger } from "#src/utils/logger";

const ready = new YuukoEvent({
  event: "clientReady",
  isOnce: true,
  run: async (client) => {
    if (!client.user) return;
    setInterval(handleAsync(async () => {
      await updateBotStats(client);
      client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
    }), 15000);

    await registerCommands(client);
    await registerComponents(client);

    logger.info("Bot ready", { type: "startup", user: client.user.tag });
  }
});

export default [ready];
