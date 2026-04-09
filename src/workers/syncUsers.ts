import { handleSyncing } from "#commands/synclists";
import { db, tables } from "#database/index";
import { MediaType } from "#graphQL/types";
import { decodeJWT, graphQLRequest, YuukoError } from "#utils/index";
import type { SyncUsers } from "#workers/manager";
import { client } from "#src/app";
import { eq } from "drizzle-orm";

// for main thread to call
export async function syncAnilistUsers(data: SyncUsers) {
    const { aniListUsers, usersPerMinute } = data;
    const timeOut = Math.ceil(60 * 1000 / usersPerMinute);

    const total = aniListUsers.length;

    client.logger.log("verbose", "Preparing to sync users", { type: "generic", total });

    const date = Math.floor(Date.now() / 1000);

    for (let i = 0; i < total; i++) {
        const user = aniListUsers[i]!;
        try {
            const start = performance.now();
            const { payload } = decodeJWT(user.aniListToken);
            if (date >= payload.exp) {
                await deleteUser(user.aniListId);
                continue;
            }
            const { data: animeData, headers: animeHeaders } = await graphQLRequest("GetUserList", { userId: user.aniListId, type: MediaType.Anime }, user.aniListToken);
            if (animeData) await handleSyncing({ media: animeData }, user.aniListId, MediaType.Anime);

            const remaining = parseInt(animeHeaders.get("x-ratelimit-remaining") ?? "1");

            if (remaining <= 2) {
                client.logger.log("warn", "Rate limit nearly exhausted, waiting 60s", { type: "generic", remaining });
                await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
            }

            const { data: mangaData } = await graphQLRequest("GetUserList", { userId: user.aniListId, type: MediaType.Manga }, user.aniListToken);
            if (mangaData) await handleSyncing({ media: mangaData }, user.aniListId, MediaType.Manga);

            client.logger.log("verbose", "Synced user", { type: "generic", aniListId: user.aniListId, idx: i + 1, total });

            const localTimeout = Math.max(0, Math.floor(timeOut - (performance.now() - start)));
            if (i < total - 1 && localTimeout > 0) {
                await new Promise((resolve) => setTimeout(resolve, localTimeout));
            }
        } catch (e) {
            console.error(e);
            if (e instanceof YuukoError && e.message.toLowerCase().includes("invalid token")) {
                await deleteUser(user.aniListId);
            }
            if (i < total - 1) {
                await new Promise((resolve) => setTimeout(resolve, timeOut));
            }
        }
    }
}

async function deleteUser(aniListId: number) {
    client.logger.log("warn", "User has invalid token, deleting from DB", { type: "generic", aniListId });
    await db
        .delete(tables.aniListUser)
        .where(eq(tables.aniListUser.aniListId, aniListId));
}
