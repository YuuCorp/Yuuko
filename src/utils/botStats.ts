import type { Client } from "#structures/index";
import { db, tables } from "#database/db";

export async function getStats() {
    const stats = (await db.select().from(tables.botStats))[0];
    if (!stats) return { servers: 0, members: 0, registered: 0 };
    return stats;
}

export async function updateBotStats(client: Client) {
    const servers = client.guilds.cache.size;
    const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const registered = (await db.query.anilistUser.findMany()).length;
    await db.update(tables.botStats).set({ servers, members, registered });


    return { servers, members, registered };
}
