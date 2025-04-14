import { _YuukoEvent } from "#structures/index";
import { updateBotStats } from "#utils/index";

const guildCreate = new _YuukoEvent({
    event: "guildCreate",
    run: async (client) => {
        await updateBotStats(client);
    }
});

const guildDelete = new _YuukoEvent({
    event: "guildDelete",
    run: async (client) => {
        await updateBotStats(client);
    }
});

export default [guildCreate, guildDelete];