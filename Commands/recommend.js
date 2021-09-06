const Discord = require("discord.js"),
    Command = require("../Structures/Command"),
    CommandCategories = require("../Utils/CommandCategories"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError"),
    MangaCmd = require("../Commands/manga.js"),
    AnimeCmd = require("../Commands/anime.js");

module.exports = new Command({
    name: "recommend",
    usage: "recommend <anime | manga> <anilist user> <genre1 - genreN>",
    description: "Recommends unwatcged anime/manga besed on the requested genre(s).",
    type: CommandCategories.Anilist,
    async run(message, args, run) {
        //& USER QUERY
        let userquery = `query ($type: MediaType, $userName: String) {
                MediaListCollection(userName: $userName, type: $type) {
                    lists {
                        entries {
                            media {
                                id
                                title {
                                    english
                                }
                                genres
                            }
                            score
                        }
                        name
                    }
                }
            }`;
        const contentType = args[1].toUpperCase();
        let vars = { type: contentType, userName: args[2] };

        if (contentType != "ANIME" && contentType != "MANGA") {
            return message.channel.send({ embeds: [EmbedError(`Please specify either manga, or anime as your content type. (Yours was "${contentType}")`, null, false)] });
        }

        let url = "https://graphql.anilist.co";
        let excludeIDs = [];

        //^ First we query the user to find what ID-s we should exclude from the search pool.
        axios
            .post(url, { query: userquery, variables: vars })
            .then((response) => {
                let data = response.data.data.MediaListCollection;
                if (data) {
                    //^ We filter out the Planning list
                    for (let MediaList of data.lists.filter((MediaList) => MediaList.name != "Planning")) {
                        MediaList.entries.map((e) => excludeIDs.push(e.media.id));
                    }
                    ProcessRecommendations();
                } else {
                    return message.channel.send({ embeds: [EmbedError(`Couldn't find any data from the user specified. (Which was "${vars.userName}")`, null, false)] });
                }
            })
            .catch((error) => {
                //^ Log Axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                    return message.channel.send({ embeds: [EmbedError(error.response.data.errors.map(e => e.message).join("\n"), vars)] });
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });

        //& RECOMMENDATION QUERY
        let recommendationquery = `
            query ($type: MediaType, $exclude_ids: [Int], $genres: [String]) {
                Page (perPage: 50) {
                    media (genre_in: $genres, id_not_in: $exclude_ids, type: $type, sort: SCORE_DESC, averageScore_greater: 6) {
                        title {
                            english
                        }
                        genres
                    }
                }
            }`;

        function ProcessRecommendations() {
            axios
                .post(url, 
                    {
                        query: recommendationquery, 
                        variables: { type: contentType, exclude_ids: excludeIDs, genres: args.slice(3) } 
                    }
                )
                .then((response) => {
                    let data = response.data.data.Page;
                    if (data) {
                        //^ Filter out the Planning list
                        let recommendations = data.media.filter((Media) => Media.title.english != null);
                        let random = Math.floor(Math.random() * Math.floor(50));
                        switch (contentType) {
                            case "ANIME":
                                AnimeCmd.run(message, args, run, true, { title: recommendations[random].title.english });
                                break;
                            case "MANGA":
                                MangaCmd.run(message, args, run, true, recommendations[random].title.english);
                                break;
                        }                        
                    } else {
                        message.channel.send("Could not find any data.");
                    }
                })
                .catch((error) => {
                    //^ Log Axios request status code and error
                    if (error.response) {
                        console.log(error.response.data.errors);
                    } else {
                        console.log(error);
                    }
                    message.channel.send({ embeds: [EmbedError(error, vars)] });
                });
        }
        
    },
});
