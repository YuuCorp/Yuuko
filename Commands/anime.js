const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "anime",
    description: "Gets an anime based on a search result.",
    type: CommandCategories.AniList,

    async run(message, args, run, hook = false, hookdata = null) {
        let query = `query ($query: String) { # Define which variables will be used in the query (id)
                Media (search: $query, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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
                }
            }`;

        let vars = { };
        if (!hook) {
            if (args.slice(1).join(" ").length < 3) {
                return message.channel.send({embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)]});
            }
            vars.query = args.slice(1).join(" ");
        } else if (hook && hookdata?.title) {
            vars.query = hookdata.title;
        } else if (hook & hookdata?.id) {
            vars.query = hookdata.id;
        } else {
            return message.channel.send({embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)]});
        }

        if (hookdata?.id) {
            query = query.replace("$query: String", "$query: Int");
            query = query.replace("search:", "id:");
        }

        let url = "https://graphql.anilist.co";

        //^ Make the HTTP Api request
        axios
            .post(url, { query: query, variables: vars })
            .then((response) => {
                //console.log(response.data.data.Media);
                let data = response.data.data.Media;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
                    let description =
                        data.description
                            .replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/\n\n/g, "\n") || "No description available.";
                    const titleEmbed = new Discord.MessageEmbed()
                        .setThumbnail(data.coverImage.large)
                        .setTitle(data.title.english)
                        .addFields(
                            //^ Add fields genres, format and mean score
                            {
                                name: "Genres",
                                value: data.genres.join(", ") || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Format",
                                value: data.format || "Unknown",
                                inline: true,
                            },
                            {
                                name: "Mean Score",
                                value: data.meanScore.toString() + "%" || "Unknown",
                                inline: true,
                            }
                        )
                        .setDescription(description || "No description available.")
                        .setURL("https://anilist.co/anime/" + data.id)
                        .setColor("0x00ff00")
                        .setFooter(Footer(response));
                    
                    if (hookdata?.image) {
                        titleEmbed.setImage(hookdata.image);
                    }

                    if (hookdata?.fields) {
                        for (const field of hookdata.fields) {
                            titleEmbed.addField(field.name, field.value, field.inline || false)
                        }
                    }

                    message.channel.send({ embeds: [titleEmbed] });
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
