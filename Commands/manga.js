const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "manga",
    description: "Gets a manga based on a search result.",
    type: CommandCategories.AniList,

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
                    genres
                    meanScore
                    source
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
                    console.log(data.source)
                    let description =
                        data.description
                            .replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    const titleEmbed = new Discord.MessageEmbed()
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english || data.title.romaji || data.title.native)
                        .addFields(
                            // add fields genres, format and mean score
                            {
                                name: "Source",
                                value: data.source || "N/A",
                                inline: true,
                            },
                            {
                                name: "Format",
                                value: data.format || "N/A",
                                inline: true,
                            },
                            {
                                name: "Mean Score",
                                value: data.meanScore.toString() || "N/A",
                                inline: true,
                            },
                            {

                                name: "Genres",
                                value: '``' +`${data.genres.join(", ") || "N/A"}` + '``',
                                inline: true,
                            },
                        )
                        .setDescription(description || "No description available.")
                        .setURL("https://anilist.co/anime/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(response));
                    message.channel.send({ embeds: [titleEmbed] });
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch((error) => {
                // log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
