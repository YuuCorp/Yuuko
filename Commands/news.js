const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories"),
    fs = require("fs"),
    path = require("path"),
    TurndownService = require('turndown'),
    Config = require("../config.json");

module.exports = new Command({
    name: "aninews",
    description: "Gets the latest anime news from RSS.",
    type: CommandCategories.Misc,
    
    async run(message, args, run) {
        const rss_feed = "https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Ffeeds.feedburner.com%2Fcrunchyroll%2Fanimenews";
        axios.get(rss_feed)
            .then(res => {
                const rss = res.data;
                const turndownService = new TurndownService();
                const embed = new Discord.MessageEmbed()
                    .setTitle(rss.feed.title)
                    .setColor(0x00AE86)
                    .setFooter(Footer());
                

                for (let i = 0; i < Config.rsslimit; i++) {
                    //? We remove image tags since they don't work in embeds
                    //? And convert the HTML to markdown
                    let description = rss.items[i].description.replace(/<img .*?>/g,"").replace(/(<br\ ?\/?>)+/g, "\n");
                    
                    if (description.length > 1024) {
                        description = description.substring(0, 1024) + "...";
                    }

                    //! BEWARE: There is an invisible character in the p tag as an embed spacer
                    if (i != Config.rsslimit - 1) {
                        description += "<p>‎</p>";
                    }
                                        
                    embed.addField(":newspaper:  " + rss.items[i].title, turndownService.turndown(description));
                }

                message.channel.send({embeds: [embed]});
                //* (Analyze on disk) fs.writeFileSync(path.join(__dirname, "rss.json"), JSON.stringify(res.data));
            })
            .catch(error => {
                //^ Log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, null, false)] });
            })
    }
});
