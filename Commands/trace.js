const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories"),
    AnimeCmd = require("../Commands/anime.js"),
    HumanizeDuration = require("humanize-duration");

module.exports = new Command({
    name: "trace",
    description: "Gets an anime from an image.",
    type: CommandCategories.AniList,

    async run(message, args, run) {
        // Send and axios request to trace.moe with an image the user attached
        axios.get(`https://api.trace.moe/search?cutBorders&url=${message.attachments.first().url}`)
            .then(async res => {
                // If the request was successful
                const match = res.data.result[0];
                AnimeCmd.run(message, args, run, true,
                    {
                        id: match.anilist,
                        image: message.attachments.first().url,
                        fields: [
                            {name: "\u200B", value: "\u200B"},
                            {name: "In Episode", value: `${match.episode || "Full"} (${HumanizeDuration(match.from * 1000, { round: true }).toString()} in)`, inline: true},
                            {name: "Similarity", value: match.similarity.toFixed(2).toString(), inline: true},
                            {name: "Video", value: `[Link](${match.video})`, inline: true}
                        ]
                    }
                )
            })
            .catch(error => {
                //^ log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, null, false)] });
            });
    }
});