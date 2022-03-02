const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories"),
    pagination = require("@acegoal07/discordjs-pagination"),
    ms = require("ms");

module.exports = new Command({
    name: "airing",
    usage: "airing <day>",
    description: "Gets the airing schedule for the specified day.",
    type: CommandCategories.Anilist,

    async run(message, args, run, hook = false, hookdata = null) {
        const query = `query($dateStart: Int, $nextDay: Int!) {
            Page{
              airingSchedules(sort: TIME, airingAt_greater: $dateStart, airingAt_lesser: $nextDay) {
                media {
                  siteUrl
                  format
                  duration
                  episodes
                  title {
                    english
                    romaji
                    native
                  }
                }
                id
                episode
                airingAt
                timeUntilAiring
              }
            }
          }`;

        let vars = {};
        //*DEBUG: console.log(`Hook: ${hook}\nHookData:`, hookdata)
        const [, ...rest] = args;
        let diff = 0;
        try {
            diff = ms(rest.join(" "));
        } catch (R) {}
        console.log(rest.join(" "));
        //rest ? ms(rest.join(' ')).catch(err => console.log("kur")) : 0

        const _day = new Date(Date.now() + diff);
        const day = new Date(Date.UTC(_day.getFullYear(), _day.getMonth(), _day.getDate()));
        console.log(day);

        if (!hook) {
            //vars.query = args.slice(1).join(" ");
            const nextDay = new Date(day.getTime());
            nextDay.setHours(23, 59, 59, 999);
            vars.dateStart = Math.floor(day.getTime() / 1000);
            vars.nextDay = Math.floor(nextDay.getTime() / 1000);
            console.log(nextDay);
        } else if (hook && hookdata?.title) vars.query = hookdata.title;
        else if (hook && hookdata?.id) vars.query = hookdata.id;
        else return message.channel.send({ embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });

        if (hookdata?.id) {
            query = query.replace("$query: String", "$query: Int");
            query = query.replace("search:", "id:");
        }

        let url = "https://graphql.anilist.co";

        //^ Make the HTTP Api request
        axios
            .post(url, { query: query, variables: vars })
            .then((response) => {
                const data = response.data.data.Page;
                const { airingSchedules } = data;
                //console.log(data);

                if (data) {
                    let i,
                        j,
                        chunk = 5,
                        fields = [];
                    for (i = 0, j = airingSchedules.length; i < j; i += chunk) {
                        fields.push(airingSchedules.slice(i, i + chunk));
                    }
                    fields.forEach((fieldSet, index) => {
                        let embed = new Discord.MessageEmbed();
                        embed.setTitle(`Airing on ${day.toDateString()}`);
                        embed.setColor(0x00ff00);
                        embed.setFooter(Footer(response));
                        fieldSet.forEach((field) => {
                            const { media, episode, airingAt } = field;
                            const { title } = media;

                            embed.addFields({
                                name: `${title.english || title.romaji || title.native}`,
                                value: ` - EP - ${episode} ${new Date(airingAt * 1000) > new Date() ? `Going to air <t:${airingAt}:R>` : `Aired <t:${airingAt}:R>`}`,
                                inline: false,
                            });

                        });
                        message.channel.send({ embeds: [embed] });
                    });

                    if (hookdata?.image) {
                        firstPage.setImage(hookdata.image);
                    }

                    if (hookdata?.fields) {
                        for (const field of hookdata.fields) {
                            firstPage.addField(field.name, field.value, field.inline || false);
                        }
                    }
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
