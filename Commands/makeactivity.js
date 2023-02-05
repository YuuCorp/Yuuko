const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    { mwRequireALToken } = require("#Middleware/ALToken.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    AnilistUser = require("#Models/AnilistUser.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "makeactivity";
const usage = 'makeactivity <list | status>';
const description = "Allows you to make an Anilist activity from Discord. Requires an AniList token.";

module.exports = new Command({
    name,
    usage,
    description,
    middlewares: [mwRequireALToken],
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription("Make a list activity.")
                .addIntegerOption((option) => option.setName("mediaid").setRequired(true).setDescription("The Media ID of the anime/manga"))
                .addStringOption((option) =>
                    option
                        .setName("status")
                        .setRequired(true)
                        .setDescription("The status you want it added as.")
                        .addChoices(
                            { name: "Current", value: "CURRENT" },
                            { name: "Planning", value: "PLANNING" },
                            { name: "Completed", value: "COMPLETED" },
                            { name: "Dropped", value: "DROPPED" },
                            { name: "Paused", value: "PAUSED" },
                            { name: "Repeating", value: "REPEATING" }
                    )
            )
                .addBooleanOption((option) => option.setName("hide").setDescription("Hide series from status list"))
                .addStringOption((option) => option.setName("lists")
                    .setDescription("The custom list you want the series added to. (shows both manga and anime lists)").setAutocomplete(true))
                .addNumberOption((option) => option.setName("score").setDescription("The score you want to give the series."))
                .addIntegerOption((option) => option.setName("progress").setDescription("How far you've watched/read the series."))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("status")
                .setDescription("Make a text activity.")
                .addStringOption((option) => option.setName("text").setRequired(true).setDescription("The text to use when making the activity."))
        ),

    async autocomplete(interaction) {
        try {
            // Get the users media lists
            const listQuery = `query Query($userId: Int) {
            User(id: $userId) {
              mediaListOptions {
                animeList {
                  customLists
                }
                mangaList {
                  customLists
                }
              }
            }
          }`
            const alUser = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });

            const vars = { userId: +alUser.anilist_id };
            const response = await GraphQLRequest(listQuery, vars);
            const animeLists = response?.User.mediaListOptions.animeList.customLists.map((list) => { return { name: list + " (Anime)", value: list } });
            const mangaLists = response?.User.mediaListOptions.mangaList.customLists.map((list) => { return { name: list + " (Manga)", value: list } });
            const lists = animeLists.concat(mangaLists);
            await interaction.respond(lists);
        } catch (error) {
            console.error(error);
        }
    },

    async run(interaction, args, run) {
        const type = interaction.options.getSubcommand();
        if (!type || (type != "status" && type != "list")) {
            return interaction.reply({ embeds: [EmbedError(`Please use either the status or list subcommand. (Yours was "${type}")`, null, false)], ephemeral: true });
        }

        if (type === "status") {
            let vars = { text: getEmojis(interaction.options.getString("text")) };
            GraphQLRequest(GraphQLQueries.TextActivity, vars, interaction.ALtoken)
                .then((response, headers) => {
                    let data = response?.SaveTextActivity;
                    const statusActivity = new EmbedBuilder()
                        .setURL(data?.siteUrl || "Unknown")
                        .setTitle(`${data?.user.name || "Unknown"} made a new activity!`)
                        .setDescription(data?.text || "Unknown")
                        .setFooter(Footer(headers));

                    return interaction.reply({ embeds: [statusActivity] });
                })
                .catch((error) => {
                    console.error(error);
                    interaction.reply({ embeds: [EmbedError(error, vars)] });
                });
        }

        if (type === "list") {
            let vars = {};
            for (option of interaction.options._hoistedOptions)
                vars[option.name] = option.value;

            vars["lists"] = [vars["lists"]];

            GraphQLRequest(GraphQLQueries.MediaList, vars, interaction.ALtoken)
                .then((response, headers) => {
                    let data = response?.SaveMediaListEntry;
                    const mediaListActivity = new EmbedBuilder()
                        .setURL(`https://anilist.co/${data?.media?.type || ""}/${data?.mediaId || ""}`)
                        .setTitle(`${data?.user.name || "Unknown"} added ${data?.media?.title?.userPreferred || "Unknown"} to ${data?.status || "Unknown"}!`)
                        .setImage(data?.media?.bannerImage)
                        .setFooter(Footer(headers));

                    return interaction.reply({ embeds: [mediaListActivity] });
                })
                .catch((error) => {
                    console.error(error);
                    interaction.reply({ embeds: [EmbedError(error, vars)] });
                });
        }
    },
});

function getEmojis(messageString) {
    let matchedResults = Array.from(messageString.matchAll(/<\w*:.*?:(\d+)>/gm), x => x[1]);
    let filteredResults = matchedResults.map(x => `img22(https://cdn.discordapp.com/emojis/${x})`);
    for (let i = 0; i < matchedResults.length; i++) {
        messageString = messageString.replace(/<\w*:.*?:(\d+)>/, filteredResults[i]);
    }
    return messageString;
}