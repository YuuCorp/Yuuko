import { updateBotStats } from "#Utils/botStats.ts";
import type { YuukoEvent } from "../Structures";

export const run: YuukoEvent<"guildCreate"> = async (client) => {
    await updateBotStats(client);
};
