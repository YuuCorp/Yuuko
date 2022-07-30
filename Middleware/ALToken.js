const Middleware = require("#Structures/Middleware.js");
const AnilistUser = require("#Models/AnilistUser.js");


async function requireALToken(interaction) {
    let id = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (!alUser || !alUser.anilist_token) {
        throw new Error("You must have an AniList token set to use this action.");
    }
    interaction.token = alUser.anilist_token;
}

async function optionalALToken(interaction) {
    let id = interaction.user.id;
    let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
    if (alUser && alUser.anilist_token) {
        interaction.token = alUser.anilist_token;
    }
}

const mwRequireALToken = new Middleware({
    name: "Require AniList Token",
    description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
    run: requireALToken
})

const mwOptionalALToken = new Middleware({
    name: "Optional AniList Token",
    description: "This middleware makes an AniList token available on the interaction object if present",
    run: optionalALToken
})

module.exports = { mwRequireALToken, mwOptionalALToken }