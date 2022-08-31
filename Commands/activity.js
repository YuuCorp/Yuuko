const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    { mwGetUserEntry } = require("#Middleware/UserEntry.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "activity";
const usage = "activity <user>";
const description = "Searches for an user and shows you their most recent activity.";

module.exports = new Command({
    name,
    usage,
    description,
    middlewares: [mwGetUserEntry],
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('user')
                .setDescription('The user to search for')
                .setRequired(false)),

    async run(interaction, args, run) {

        const userName = interaction.options.getString('user')

        let vars = {
            username: userName
        };

        if (!interaction.options.getString('user')) {
            // We try to use the one the user set
            try {
                vars = { userid: interaction.alID }
            } catch (error) {
                console.log(error);
                return interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token. You can see the instructions with /auth help`)] });
            }
        } else {

            try {
                let uData = (await GraphQLRequest(GraphQLQueries.User, vars))?.User;
                vars = {
                    userid: uData?.id || "Unable to find ID"
                }
            } catch (error) {
                console.log(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            }
        };


        GraphQLRequest(GraphQLQueries.Activity, vars)
            .then((response, headers) => {
                let data = response.Activity;
                if (data) {
                    const embed = new EmbedBuilder()
                        .setURL(data?.siteUrl)
                        .setFooter(Footer(headers));

                    if (data?.__typename.includes("TextActivity")) {
                        embed
                            .setTitle(`Here's ${data?.user?.name?.toString() || "Unknown Name"}'s most recent activity!`)
                            .setDescription(data?.text?.replace(`!~`, `||`)
                                .replace(`~!`, `||`)
                                .replaceAll('~', ``))
                            .setThumbnail(data?.user?.avatar?.large)

                        return interaction.reply({ embeds: [embed] });

                    } else
                        embed
                            .setTitle(`Here's ${data?.user?.name?.toString()}'s most recent activity!`)
                            .setThumbnail(data?.media?.coverImage?.large || data?.media?.coverImage?.medium)
                            .setDescription(`**${data?.status?.toString().replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())} ${data?.progress?.toString() || ""} ${data?.media?.title?.romaji || data?.media?.title?.english || data?.media?.title?.native}**`)
                    return interaction.reply({ embeds: [embed] });
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});
