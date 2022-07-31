const Middleware = require("#Structures/Middleware.js");
const AnilistUser = require("#Models/AnilistUser.js");

async function getUserEntry(interaction) {
    let id = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (alUser && alUser.anilist_id) {
        interaction.alID = alUser.anilist_id;
    }
}

const mwGetUserEntry = new Middleware({
    name: "Require AniList Token",
    description: "This middleware gets you the user's AniList ID and add's it to the interaction object.",
    run: getUserEntry
})

module.exports = { mwGetUserEntry }