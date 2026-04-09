import { eq } from 'drizzle-orm';
import { db, tables } from "#database/db";

export async function getAniListUser(discordId: string) {
     return (await db.select().from(tables.aniListUser).where(eq(tables.aniListUser.discordId, discordId)).limit(1))[0]
}
