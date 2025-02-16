import { handleSyncing } from "#commands/synclists";
import { db, tables } from "#database/index";
import { MediaType } from "#graphQL/types";
import { graphQLRequest, YuukoError } from "#utils/index";
import type { SyncUsers } from "#workers/manager";
import { client } from "app";
import { eq } from "drizzle-orm";

// for main thread to call
export async function syncAnilistUsers(data: SyncUsers) {
    const { anilistUsers, usersPerMinute } = data;
    const timeOut = Math.floor(60 * 1000 / usersPerMinute);

    const total = anilistUsers.length;
    let i = 1;
    for (const user of anilistUsers) {
        try {
            // GetUserList is a more optimized query for syncing lists compared to GetMediaCollection
            // as we don't care about the media, only user entries
            const start = performance.now();
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
                client.log(`Waiting ${localTimeout}ms before syncing the next user... (${i} / ${total})`, "SYNC");
                await new Promise((resolve) => setTimeout(resolve, localTimeout));
            }
            i++;

        } catch (e) {
            console.error(e);

            if (e instanceof YuukoError) {
                if (e.message.toLowerCase().includes("invalid token")) {
                    client.log(`User ${user.anilistId} has an invalid token, deleting from the DB...`, "SYNC");

                    await db
                        .delete(tables.anilistUser)
                        .where(eq(tables.anilistUser.anilistId, user.anilistId));
                }
            };

            if (i <= total) {
                client.log(`Waiting ${timeOut}ms before syncing the next user... (${i} / ${total})`, "SYNC");
                await new Promise((resolve) => setTimeout(resolve, timeOut));
            }

            i++;
        }
    }
}