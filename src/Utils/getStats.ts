import type { Client } from '../Structures'
import { db } from "../Database/db";

export async function getStats(client: Client) {
    return {
        servers: client.guilds.cache.size,
        members: getMemberCount(client),
        registered: (await db.query.anilistUser.findMany()).length,
    }
}

function getMemberCount(client: Client) {
    let memberCount = 0
    client.guilds.cache.forEach(guild => {
        memberCount += guild.memberCount
    })
    return memberCount
  }