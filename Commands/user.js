const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js"),
    AnilistUser = require("#Models/AnilistUser.js");

module.exports = new Command({
    name: "user",
    usage: 'user <anilist name>',
    description: "Searches for an anilist user and displays information about them.",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        let anilistUser = args.slice(1).join(" ");

        // If the user hasn't provided a user
        if (!anilistUser) {
            // We try to use the one the user set
            try {
                const user = await AnilistUser.findOne({ where: { discord_id: message.author.id } });
                if (!user) {
                    return message.channel.send({ embeds: [EmbedError(`You haven't bound your AniList username to your Discord account.`)] });
                }
                anilistUser = user.anilist_id;
            } catch {
                return message.channel.send({ embeds: [EmbedError(`Please provide a valid AniList username.`)] });
            }
        }

        let vars = { username: anilistUser };
        // Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.User, vars)
            .then((response, headers) => {
                let data = response.User;
                if (data) {
                    const titleEmbed = new Discord.MessageEmbed()
                        // TODO: Fix depricated function calls 101
                        .setAuthor(data.name, "https://anilist.co/img/icons/android-chrome-512x512.png", data.siteUrl)
                        .setImage(data.bannerImage)
                        .setThumbnail(data.avatar.large)
                        .addFields(
                            { name: "< Anime >\n\n", value: `**Watched:** ${data.statistics.anime.count.toString()}\n**Average score**: ${data.statistics.anime.meanScore.toString()}`, inline: true },
                            { name: "< Manga >\n\n", value: `**Read:** ${data.statistics.manga.count.toString()}\n**Average score**: ${data.statistics.manga.meanScore.toString()}`, inline: true }
                        )
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    message.channel.send({ embeds: [titleEmbed] });
                } else {
                    return message.channel.send({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.error(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
