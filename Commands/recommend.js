const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    MangaCmd = require("#Commands/manga.js"),
    AnimeCmd = require("#Commands/anime.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js");

module.exports = new Command({
    name: "recommend",
    usage: "recommend <anime | manga> <anilist user> <genre1 - genreN>",
    description: "Recommends unwatched anime/manga based on the requested genre(s).",
    type: CommandCategories.Anilist,
    async run(message, args, run) {
        let query = `query ($type: MediaType, $userName: String) {
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

        let excludeIDs = [];

        //^ First we query the user to find what ID-s we should exclude from the search pool.
        GraphQLRequest(query, vars)
            .then((response, headers) => {
                let data = response.MediaListCollection;
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
                console.error(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });

        let recommendationQuery = `
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
            if (!args.slice(3).length) {
                return message.channel.send({ embeds: [EmbedError(`Please specify at least one genre.`, null, false)] });
            }

            const genres = args.slice(3).join(" ").split(",").map(genre => genre.trim());
            const recommendationVars = { type: contentType, exclude_ids: excludeIDs, genres };

            GraphQLRequest(recommendationQuery, recommendationVars)
                .then((response) => {
                    let data = response.Page;
                    if (data) {
                        //^ Filter out the Planning list
                        let recommendations = data.media.filter((Media) => Media.title.english != null);
                        let random = Math.floor(Math.random() * Math.floor(recommendations.length));
                        switch (contentType) {
                            case "ANIME":
                                AnimeCmd.run(message, args, run, true, {
                                    title: recommendations[random].title.english
                                });
                                break;
                            case "MANGA":
                                MangaCmd.run(message, args, run, true, recommendations[random].title.english);
                                break;
                        }                        
                    } else {
                        return message.channel.send({ embeds: [EmbedError(`Couldn't find any data.`, recommendationVars)] });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    message.channel.send({ embeds: [EmbedError(error, vars)] });
                });
        }
        
    },
});
