// prevents TS errors
declare var self: Worker;

import { db, tables } from '#database/index';
import { rsaEncryption } from '#utils/rsaEncryption';
import { eq, sql } from 'drizzle-orm';

export type WorkerResponseUnion = ReminderMessage | SyncUsers;

export type ReminderMessage = {
    type: 'REMINDER'
    discordId: string;
    animeId: string;
    episode: number;
};

export type SyncUsers = {
    type: "SYNC",
    anilistUsers: {
        anilistId: number;
        discordId: string;
        anilistToken: string;
    }[];
    usersPerMinute: number;
};


const CHECK_INTERVAL = 5000;

// TODO! rest of the magic
async function checkUpcomingEpisodes() {
}

async function updateSyncedUsers() {
    try {
        const syncEvent = (await db.select().from(tables.workerEvents).limit(1))[0];
        if (!syncEvent) return;

        // so they have same TZ
        const updateAt = new Date(syncEvent.updatedAt + "Z");
        updateAt.setMilliseconds(updateAt.getMilliseconds() + syncEvent.period);

        const currentDate = new Date();
        if (updateAt > currentDate) return;

        await db.update(tables.workerEvents)
            .set({ updatedAt: sql`current_timestamp` })
            .where(eq(tables.workerEvents.type, "SYNC"));

        const anilistUsers = await db.select().from(tables.anilistUser);

        // we have to decrpyt the tokens
        const decryptedUsers = await Promise.all(anilistUsers.map(async (user) => {
            const decryptedToken = await rsaEncryption(user.anilistToken, false);
            return {
                ...user,
                anilistToken: decryptedToken,
            }
        }));

        const usersPerMinute = Math.min(15, decryptedUsers.length);

        self.postMessage({
            type: "SYNC",
            anilistUsers: decryptedUsers,
            usersPerMinute,
        } satisfies SyncUsers);

    } catch (e) {
        console.error(e);
        return;
    }
}

self.onmessage = (e) => {
    setInterval(async () => {
        // await checkUpcomingEpisodes();
        await updateSyncedUsers();
    }, CHECK_INTERVAL);
};