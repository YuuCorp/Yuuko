const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    BuildPagination = require("#Utils/BuildPagination.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "anime";
const usage = "anime <title>";
const description = "Gets an anime from anilist based on a search result.";

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
                .setDescription('The query to search for')
                .setRequired(true)),

    async run(interaction, args, run, hook = false, hookdata = null) {
        let anime = interaction.options.getString('query');
        let vars = {};
        //^ Hook data is passed in if this command is called from another command
        if (!hook) {
            if (anime.length < 3) {
                return interaction.reply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });
            }
            vars.query = anime;
        } else if (hook && hookdata?.title) vars.query = hookdata.title;
        else if (hook && hookdata?.id) vars.query = hookdata.id;
        else return interaction.reply({ embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });

        if (hookdata && hookdata.id) {
            GraphQLQueries.Anime = GraphQLQueries.Anime.replace("$query: String", "$query: Int");
            GraphQLQueries.Anime = GraphQLQueries.Anime.replace("search:", "id:");
        }
        //^ Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.Anime, vars)
            .then((response, headers) => {
                let data = response.Media;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
                    const descLength = 350;
                    let description =
                        data?.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/\n\n/g, "\n") || "No description available.";
                    const firstPage = new EmbedBuilder()
                        .setImage(data.bannerImage)
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            {
                                name: "Episodes",
                                value: data?.episodes?.toString() || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Format",
                                value: data.format || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Mean Score",
                                value: data?.meanScore?.toString() == "undefined" ? data?.meanScore?.toString() : "Unknown",
                                inline: true,
                            },
                            {
                                name: "Start Date",
                                value: data.startDate.day ? `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                name: "End Date",
                                value: data.endDate.day ? `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}` : "Unknown",
                                inline: true,
                            },
                            {
                                //^ Check if the anime has finished airing
                                name: data?.nextAiringEpisode?.episode ? `Episode ${data.nextAiringEpisode.episode} airing in:` : "Completed on:",
                                value: data?.nextAiringEpisode?.airingAt ? `<t:${data.nextAiringEpisode.airingAt}:R>` : `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}`,
                                inline: true,
                            },
                            // {
                            //     name: '\u200B',
                            //     value: '\u200B',
                            //     inline: true,
                            // },
                            {
                                name: "Genres",
                                value: "``" + `${data.genres.join(", ") || "N/A"}` + "``",
                                inline: true,
                            }
                        )
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .setURL("https://anilist.co/anime/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    const secondPage = new EmbedBuilder()
                        .setAuthor({ name: `${data.title.english} | Additional info` })
                        .setThumbnail(data.coverImage.large)
                        .addFields(
                            {
                                name: "Source",
                                value: data.source || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Episode Duration",
                                value: data?.duration?.toString() || "Unknown",
                                inline: true,
                            },
                            {
                                name: "\u200B",
                                value: "\u200B",
                                inline: true,
                            },
                            {
                                name: "Synonyms",
                                value: "``" + `${data.synonyms.join(", ") || "N/A"}` + "``",
                                inline: true,
                            }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    if (hookdata?.image) {
                        firstPage.setImage(hookdata.image);
                    }

                    if (hookdata?.fields) {
                        for (const field of hookdata.fields) {
                            firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });
                        }
                    }

                    const pageList = [firstPage, secondPage];
                    BuildPagination(interaction, pageList).paginate();
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
