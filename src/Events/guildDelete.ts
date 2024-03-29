import { updateBotStats } from "#Utils/botStats.ts";
import type { YuukoEvent } from "../Structures";

export const run: YuukoEvent<"guildDelete"> = async (client) => {
    await updateBotStats(client);
};
