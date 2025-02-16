// prevents TS errors
declare var self: Worker;

export type WorkerResponseUnion = ReminderMessage | SyncUsers;

type ReminderMessage = {
    type: 'REMINDER'
    discordId: string;
    animeId: string;
    episode: number;
};

type SyncUsers = {
    type: "SYNC",
    anilistIDs: string[];
};


const CHECK_INTERVAL = 5000;

// TODO! rest of the magic
async function checkUpcomingEpisodes() {
    console.log("we balling");
}

self.onmessage = (e) => {
    setInterval(async () => {
        await checkUpcomingEpisodes();
        self.postMessage({
            type: "REMINDER",
            discordId: "51562",
            animeId: "10313",
            episode: 12,
        } satisfies ReminderMessage); // talk back to main thread
    }, CHECK_INTERVAL);

};