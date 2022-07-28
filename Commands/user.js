const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js"),
    AnilistUser = require("#Models/AnilistUser.js");

const name = "user";
const usage = 'user <?anilist name>';
const description = "Searches for an anilist user and displays information about them.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('query')
                .setRequired(false)
                .setDescription('The query to search for')),
    //.setRequired(true)),


    async run(interaction, args, run) {
        let anilistUser = interaction.options.getString('query');

        // If the user hasn't provided a user
        if (!anilistUser) {
            // We try to use the one the user set
            try {
                const user = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });
                if (!user) {
                    return interaction.reply({ embeds: [EmbedError(`You haven't bound your AniList username to your Discord account.`)] });
                }
                anilistUser = user.anilist_id;
            } catch {
                return interaction.reply({ embeds: [EmbedError(`Please provide a valid AniList username.`)] });
            }
        }

        let vars = { username: anilistUser };
        // Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.User, vars)
            .then((response, headers) => {
                let data = response.User;
                if (data) {
                    const titleEmbed = new EmbedBuilder()
                        // TODO: Fix depricated function calls 101
                        .setAuthor({ name: data.name, iconURL: "https://anilist.co/img/icons/android-chrome-512x512.png", url: data.siteUrl })
                        .setImage(data.bannerImage)
                        .setThumbnail(data.avatar.large)
                        .addFields(
                            { name: "< Anime >\n\n", value: `**Watched:** ${data.statistics.anime.count.toString()}\n**Average score**: ${data.statistics.anime.meanScore.toString()}`, inline: true },
                            { name: "< Manga >\n\n", value: `**Read:** ${data.statistics.manga.count.toString()}\n**Average score**: ${data.statistics.manga.meanScore.toString()}`, inline: true }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    interaction.reply({ embeds: [titleEmbed] });
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.error(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});
