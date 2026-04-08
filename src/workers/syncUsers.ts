import { handleSyncing } from "#commands/synclists";
import { db, tables } from "#database/index";
import { MediaType } from "#graphQL/types";
import { decodeJWT, graphQLRequest, YuukoError } from "#utils/index";
import type { SyncUsers } from "#workers/manager";
import { client } from "#src/app";
import { eq } from "drizzle-orm";

// for main thread to call
export async function syncAnilistUsers(data: SyncUsers) {
    const { anilistUsers, usersPerMinute } = data;
    const timeOut = Math.ceil(60 * 1000 / usersPerMinute);

    const total = anilistUsers.length;

    client.logger.log("verbose", "Preparing to sync users", { total });

    const date = Math.floor(Date.now() / 1000);

    for (let i = 0; i < total; i++) {
        const user = anilistUsers[i]!;
        try {
            const start = performance.now();
            const { payload } = decodeJWT(user.anilistToken);
            if (date >= payload.exp) {
                await deleteUser(user.anilistId);
                continue;
            }
            const { data: animeData, headers: animeHeaders } = await graphQLRequest("GetUserList", { userId: user.anilistId, type: MediaType.Anime }, user.anilistToken);
            if (animeData) await handleSyncing({ media: animeData }, user.anilistId, MediaType.Anime);

            const remaining = parseInt(animeHeaders.get("x-ratelimit-remaining") ?? "1");

            if (remaining <= 2) {
                client.logger.log("warn", "Rate limit nearly exhausted, waiting 60s", { remaining });
                await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
            }

            const { data: mangaData } = await graphQLRequest("GetUserList", { userId: user.anilistId, type: MediaType.Manga }, user.anilistToken);
            if (mangaData) await handleSyncing({ media: mangaData }, user.anilistId, MediaType.Manga);

            client.logger.log("verbose", "Synced user", { anilistId: user.anilistId, idx: i + 1, total });

            const localTimeout = Math.max(0, Math.floor(timeOut - (performance.now() - start)));
            if (i < total - 1 && localTimeout > 0) {
                await new Promise((resolve) => setTimeout(resolve, localTimeout));
            }
        } catch (e) {
            console.error(e);
            if (e instanceof YuukoError && e.message.toLowerCase().includes("invalid token")) {
                await deleteUser(user.anilistId);
            }
            if (i < total - 1) {
                await new Promise((resolve) => setTimeout(resolve, timeOut));
            }
        }
    }
}

async function deleteUser(anilistId: number) {
    client.logger.log("warn", "User has invalid token, deleting from DB", { anilistId });
    await db
        .delete(tables.anilistUser)
        .where(eq(tables.anilistUser.anilistId, anilistId));
}