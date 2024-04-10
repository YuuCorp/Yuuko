import { updateBotStats } from "#utils/botStats";
import type { YuukoEvent } from "#structures/event";

export const run: YuukoEvent<"guildCreate"> = async (client) => {
    await updateBotStats(client);
};
