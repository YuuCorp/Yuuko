import { eq } from 'drizzle-orm';
import { db, tables } from "#database/db";

/**
 * Looks up a linked AniList account by Discord user ID. Returns the row or
 * undefined if the user has not linked their account.
 * @example const user = await getAniListUser(interaction.user.id)
 */
export async function getAniListUser(discordId: string) {
     return (await db.select().from(tables.aniListUser).where(eq(tables.aniListUser.discordId, discordId)).limit(1))[0]
}
