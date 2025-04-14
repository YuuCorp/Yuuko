import { YuukoEvent } from "#structures/index";
import { updateBotStats } from "#utils/index";

const guildCreate = new YuukoEvent({
    event: "guildCreate",
    run: async (client) => {
        await updateBotStats(client);
    }
});

const guildDelete = new YuukoEvent({
    event: "guildDelete",
    run: async (client) => {
        await updateBotStats(client);
    }
});

export default [guildCreate, guildDelete];