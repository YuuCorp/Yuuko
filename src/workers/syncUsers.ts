import { handleSyncing } from "#commands/synclists";
import { db, tables } from "#database/index";
import { MediaType } from "#graphQL/types";
import { decodeJWT, graphQLRequest, YuukoError } from "#utils/index";
import type { SyncUsers } from "#workers/manager";
import { client } from "app";
import { eq } from "drizzle-orm";

// for main thread to call
export async function syncAnilistUsers(data: SyncUsers) {
    const { anilistUsers, usersPerMinute } = data;
    const timeOut = Math.ceil(60 * 1000 / usersPerMinute);

    const total = anilistUsers.length;
    let i = 1;

    const date = Math.floor(Date.now() / 1000);
    for (const user of anilistUsers) {
        try {
            // GetUserList is a more optimized query for syncing lists compared to GetMediaCollection
            // as we don't care about the media, only user entries
            const start = performance.now();

            // If the user's token is expired, instantly delete, saves on requests to AniList
            const { payload } = decodeJWT(user.anilistToken);
            if (date >= payload.exp) {
                i++
                await deleteUser(user.anilistId);
                continue;
            }

            const { data: animeData } = await graphQLRequest("GetUserList", {
                userId: user.anilistId,
                type: MediaType.Anime,
            }, user.anilistToken);

            if (animeData) await handleSyncing({ media: animeData }, user.anilistId, MediaType.Anime);

            const { data: mangaData } = await graphQLRequest("GetUserList", {
                userId: user.anilistId,
                type: MediaType.Anime,
            }, user.anilistToken);

            if (mangaData) await handleSyncing({ media: mangaData }, user.anilistId, MediaType.Manga);

            client.log(`Synced user ${user.anilistId} (${i} / ${anilistUsers.length})`, "SYNC");

            const localTimeout = Math.max(0, Math.floor(timeOut - (performance.now() - start)));
            if (i <= total && localTimeout > 0) {
                await new Promise((resolve) => setTimeout(resolve, localTimeout));
            }
            i++;

        } catch (e) {
            console.error(e);

            if (e instanceof YuukoError) {
                if (e.message.toLowerCase().includes("invalid token")) {
                    await deleteUser(user.anilistId);
                }
            };

            if (i <= total) {
                await new Promise((resolve) => setTimeout(resolve, timeOut));
            }

            i++;
        }
    }
}

async function deleteUser(anilistId: number) {
    client.log(`User ${anilistId} has an invalid token, deleting from the DB...`, "SYNC");
    await db
        .delete(tables.anilistUser)
        .where(eq(tables.anilistUser.anilistId, anilistId));
}