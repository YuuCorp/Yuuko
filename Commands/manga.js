const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories"),
    { pagination } = require('reconlx');

module.exports = new Command({
    name: "manga",
    usage: "manga <title>",
    description: "Gets a manga from anilist based on a search result.",
    type: CommandCategories.Anilist,

    async run(message, args, run, hook = false, title = null) {
        let query = `query ($query: String) { 
                Media (search: $query, type: MANGA) {
                    id
                    description
                    coverImage {
                        large
                        medium
                    }
                    title {
                        romaji
                        english
                        native
                    }
                    format
                    chapters
                    source
                    synonyms
                    volumes
                    genres
                    meanScore
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    bannerImage
                }
            }`;

        let vars = { query: !hook ? args.slice(1).join(" ") : title };
        let url = "https://graphql.anilist.co";

        // Make the HTTP Api request
        axios
            .post(url, { query: query, variables: vars })
            .then((response) => {
                //console.log(response.data.data.Media);
                let data = response.data.data.Media;
                if (data) {
                    // Fix the description by replacing and converting HTML tags
                    const descLength = 350;
                    let description =
                        data.description
                            .replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    const firstPage = new Discord.MessageEmbed()
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            {
                                name: 'Chapters',
                                value: data.chapters ? data.chapters.toString() : 'N/A',
                                inline: true,
                            },
                            {
                                name: 'Format',
                                value: data.format || "Unknown",
                                inline: true,
                            },
                            {
                                name: 'Mean Score',
                                value: data.meanScore.toString() + "%" || "Unknown",
                                inline: true,
                            },
                            {
                                name: 'Start Date', 
                                value: `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}`,
                                inline: true,
                            },
                            {
                                name: 'End Date', 
                                value: data.endDate.day ? `${data.endDate.day}/${data.endDate.month}/${data.endDate.year}` : 'Unknown' ,
                                inline: true,
                            },
                            {
                                name: '\u200B', 
                                value: '\u200B',
                                inline: true,
                            },
                            {
                                name: 'Genres', 
                                value: '``' +`${data.genres.join(", ") || "N/A"}` + '``',
                                inline: true,
                            },
                        )
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .setURL("https://anilist.co/manga/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(response));

                        const secondPage = new Discord.MessageEmbed()
                        .setAuthor(`${data.title.english} | Additional info`)
                        .setThumbnail(data.coverImage.large)
                        .addFields(
                            {
                                name: 'Source',
                                value: data.source || "Unknown",
                                inline: true,
                            },
                            {
                                name: '\u200B', 
                                value: '\u200B',
                                inline: true,
                            },
                            {
                                name: 'Synonyms',
                                value: '``' +`${data.synonyms.join(", \n")|| "N/A"}` + '``',
                                inline: true,
                            }
                            ) 
                        .setColor("0x00ff00")
                        .setFooter(Footer(response))

                        const pages = [firstPage, secondPage]

                        pagination({
                            embeds: pages,
                            channel: message.channel,
                            message: message,
                            author: message.author,
                            time: 100000
                        })
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch((error) => {
                //^ log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
