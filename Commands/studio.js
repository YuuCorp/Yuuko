const { TimestampStyles } = require("@discordjs/builders");
const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    DefaultPaginationOpts = require("#Utils/DefaultPaginationOpts.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    pagination = require("@acegoal07/discordjs-pagination"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");
const anime = require("./anime");

module.exports = new Command({
    name: "studio",
    usage: "studio <?>",
    description: "Searches for an studio and displays a list of their anime",
    type: CommandCategories.Internal,

    async run(message, args, run, hook = false, hookdata = null) {
        let vars = { query: args.slice(1).join(" ") };

        GraphQLRequest(GraphQLQueries.Studio, vars)
            .then((response, headers) => {
                let data = response.Studio;
                console.log(data);
                if (data) {
                    let animes = [];
                    for (let anime of data.media.nodes) {
                        animes = animes.concat(`[${anime.title.romaji || anime.title.english}]` + `(https://anilist.co/anime/${anime.id})`);
                    }
                    animes = animes.toString().replaceAll(",", "\n");

                    const studioEmbed = new Discord.MessageEmbed()
                        // .setThumbnail(data.image.large)
                        .setTitle(`${data.name} | ${data.favourites} favourites`)
                        .setDescription(`\n${animes}`)
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));

                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    message.channel.send({ embeds: [studioEmbed] });
                } else {
                    return message.channel.send({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
