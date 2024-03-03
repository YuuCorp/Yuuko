import { stat, statTables } from "../Database/db";

export async function getStats() {
  const stats = (await stat.select().from(statTables.BotStats))[0];
  console.log(stats);
  if (!stats) return { servers: 0, members: 0, registered: 0 };
  return stats;
}
