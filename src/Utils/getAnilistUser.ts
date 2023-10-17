import { eq } from 'drizzle-orm';
import { db, tables } from "../Database";

export async function getAnilistUser(discordId: string) {
     return (await db.select().from(tables.anilistUser).where(eq(tables.anilistUser.discordId, discordId)).limit(1))[0]
}