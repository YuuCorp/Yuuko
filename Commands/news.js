const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
    Command = require("#Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    fs = require("fs"),
    path = require("path"),
    TurndownService = require('turndown');

const name = "aninews";
const description = "Gets the latest anime news from RSS.";

module.exports = new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, run) {
        const rss_feed = "https://api.rss2json.com/v1/api.json?rss_url=https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss";
        axios.get(rss_feed)
            .then(res => {
                const rss = res.data;
                const turndownService = new TurndownService();
                const embed = new EmbedBuilder()
                    .setTitle(rss.feed.title)
                    .setColor(0x00AE86)
                    .setFooter(Footer());

                // console.log(rss.items);
                const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
                for (let i = 0; i < clamp(process.env.RSS_LIMIT || 5, 0, rss.items.length); i++) {
                    console.log("Processing " + i + "...")
                    //? We remove image tags since they don't work in embeds
                    //? And convert the HTML to markdown

                    let description = rss.items[i].description
                        .replace(/<img .*?>/g, "") // Remove image tags
                        .replace(/(<br\ ?\/?>)+/g, "\n") // Replace line breaks with newlines

                    if (description.length > 1024) {
                        description = description.substring(0, 1024) + "...";
                    }

                    //! BEWARE: There is an invisible character in the p tag as an embed spacer
                    if (i != (process.env.RSS_LIMIT || 5) - 1) {
                        description += "<p>‎</p>";
                    }

                    const news = turndownService.turndown(description);

                    embed.addFields({ name: ":newspaper:  " + rss.items[i].title, value: news });
                }

                interaction.reply({ embeds: [embed] });
            })
            .catch(error => {
                //^ Log Axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.error(error);
                }
                interaction.reply({ embeds: [EmbedError(error)] });
            })
    }
});
