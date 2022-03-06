const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    pagination = require("@acegoal07/discordjs-pagination"),
    ms = require("ms"),
    DefaultPaginationOpts = require("#Utils/DefaultPaginationOpts.js");

module.exports = new Command({
    name: "airing",
    usage: "airing <?in>",
    description: "Gets the airing schedule for today or `in`. (e.g. `1 week` means today the next week.)",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        let vars = {};
        //^ Check if the user wants to search for a specific day
        let airingIn = 0;
        if (args.length > 1) {
            try {
                airingIn = ms(args.slice(1).join(" "));
                if (!airingIn) {
                    throw new Error("Invalid time format.");
                }
            } catch (r) {
                return message.channel.send({
                    embeds: [
                        EmbedError(`Invalid time format. See "${run.prefix}help airing" for more information.`, { airingWhen: args.slice(1).join(" ") }) 
                    ]
                });
            }
        }

        const _day = new Date(Date.now() + airingIn);
        const day = new Date(Date.UTC(_day.getFullYear(), _day.getMonth(), _day.getDate()));
        const nextDay = new Date(day.getTime());
        nextDay.setHours(23, 59, 59, 999);
        vars.dateStart = Math.floor(day.getTime() / 1000);
        vars.nextDay = Math.floor(nextDay.getTime() / 1000);
        //^ Make the HTTP Api request
        GraphQLRequest(GraphQLQueries.Airing, vars)
            .then((response, headers) => {
                const data = response.Page;
                const { airingSchedules } = data;

                if (data) {
                    const chunkSize = 5;
                    const fields = [];
                    
                    // Sort the airing anime alphabetically by title
                    airingSchedules.sort(function(a, b){
                        a = a.media.title;
                        b = b.media.title;
                        const aTitle = (a.english || a.romaji || a.native).toLowerCase();
                        const bTitle = (b.english || b.romaji || b.native).toLowerCase();
                        if(aTitle < bTitle) { return -1; }
                        if(aTitle > bTitle) { return 1; }
                        return 0;
                    })

                    for (let i = 0; i < airingSchedules.length; i += chunkSize) {
                        fields.push(airingSchedules.slice(i, i + chunkSize));
                    }

                    let pageList = [];
                    fields.forEach((fieldSet, index) => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Airing on ${day.toDateString()}`);
                        embed.setColor(0x00ff00);
                        embed.setFooter(Footer(headers));

                        fieldSet.forEach((field) => {
                            const { media, episode, airingAt } = field;
                            const { title } = media;

                            embed.addFields({
                                name: `${title.english || title.romaji || title.native}`,
                                value: `> **[EP - ${episode}]** :airplane: ${new Date(airingAt * 1000) > new Date() ? `Going to air <t:${airingAt}:R>` : `Aired <t:${airingAt}:R>`}`,
                                inline: false,
                            });
                        });
                        pageList.push(embed);
                    });
                    
                    pagination(DefaultPaginationOpts(message, pageList));
                } else {
                    message.channel.send({
                        embeds: [
                            EmbedError("No airing anime found.")
                        ]
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
