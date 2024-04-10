import { updateBotStats } from "#utils/botStats";
import type { YuukoEvent } from "#structures/index";

export const run: YuukoEvent<"guildCreate"> = async (client) => {
    await updateBotStats(client);
};
