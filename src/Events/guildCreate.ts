import type { YuukoEvent } from "../Structures";
import { stat, statTables, db } from "../Database/db";

export const run: YuukoEvent<"guildCreate"> = async (client) => {
  const servers = client.guilds.cache.size;
  const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  const registered = (await db.query.anilistUser.findMany()).length;
  await stat.insert(statTables.BotStats).values({ servers, members, registered });
};
