const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "studio";
const usage = "studio <?>";
const description = "Searches for an studio and displays a list of their anime";

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

    async run(interaction, args, run) {
        let vars = { query: interaction.options.getString('query') };

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

                    const studioEmbed = new EmbedBuilder()
                        // .setThumbnail(data.image.large)
                        .setTitle(`${data.name} | ${data.favourites} favourites`)
                        .setDescription(`\n${animes}`)
                        .setURL(data.siteUrl)
                        .setColor("Green")
                        .setFooter(Footer(headers));

                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    interaction.reply({ embeds: [studioEmbed] });
                } else {
                    return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.error(error);
                interaction.reply({ embeds: [EmbedError(error, vars)] });
            });
    },
});
