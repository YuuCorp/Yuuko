// prevents TS errors
declare var self: Worker;

import { db, tables, type InferTable } from '#database/index';
import { env } from '#src/env';
import type { LogLevel } from '#utils/logger';
import { RSA } from "#utils/rsaEncryption";
import { eq } from 'drizzle-orm';

export type WorkerResponseUnion = ReminderMessage | SyncUsers | LogMessage;

export type ReminderMessage = {
    type: 'REMINDER'
    discordId: string;
    animeId: string;
    episode: number;
};

export type LogMessage = {
    type: 'LOG';
    text: string;
    level: LogLevel;
};

export type SyncUsers = {
    type: "SYNC",
    aniListUsers: InferTable<"aniListUser">[];
    usersPerMinute: number;
};


const CHECK_INTERVAL = 5000;

// TODO! rest of the magic
async function checkUpcomingEpisodes() {
}

async function updateSyncedUsers() {
    if (env().NODE_ENV === "development") return;

    try {

        const syncEvent = (await db.select().from(tables.workerEvents).where(eq(tables.workerEvents.type, "SYNC")).limit(1))[0];
        if (!syncEvent) return;

        // so they have same TZ
        const updateAt = new Date(syncEvent.updatedAt.getTime() + syncEvent.period);
        const currentDate = new Date();

        if (updateAt > currentDate) return;


        const aniListUsers = await db.select().from(tables.aniListUser);
        const rsa = new RSA();

        // we have to decrpyt the tokens
        const decryptedUsers = await Promise.all(aniListUsers.map(async (user) => {
            const decryptedToken = await rsa.decrypt(user.aniListToken);
            return {
                ...user,
                aniListToken: decryptedToken,
            }
        }));

        const usersPerMinute = Math.min(15, decryptedUsers.length);

        self.postMessage({
            type: "SYNC",
            aniListUsers: decryptedUsers,
            usersPerMinute,
        } satisfies SyncUsers);

    } catch (e) {
        console.error(e);
        return;
    }
}

await RSA.loadKeys();
let isSyncing = false;

setInterval(async () => {
    if (isSyncing) return;
    isSyncing = true;
    try {
        await updateSyncedUsers();
    } finally {
        isSyncing = false;
    }
}, CHECK_INTERVAL);
