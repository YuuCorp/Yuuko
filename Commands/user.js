const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js");

module.exports = new Command({
    name: "user",
    description: "Searches for an AniList user and displays information about it.",

    async run(message, args, run) {
        let query = 
            `query ($username: String) {
                User(name:$username) {
                    id
                    name
                    avatar {
                      large
                      medium
                    }
                    bannerImage
                    siteUrl
                    createdAt
                    statistics {
                        anime {
                          count
                          meanScore
                        }
                        manga {
                          count
                          meanScore
                        }
                      }
                    }
              }`;
        
        let vars = { username: args.slice(1).join(" ") };

        let url = "https://graphql.anilist.co";

        // Make the HTTP Api request
        axios.post(url, { query: query, variables: vars })
            .then(response => {
                //console.log(response.data.data.Media);
                let data = response.data.data.User;
                //console.log(data.description);
                if (data) {
                    const titleEmbed = new Discord.MessageEmbed()
                        .setAuthor(data.name, 'https://anilist.co/img/icons/android-chrome-512x512.png', data.siteUrl)
                        .setImage(data.bannerImage)
                        .setThumbnail(data.avatar.large)
                        //.setTitle('Created At: ' + new Date(data.createdAt * 1000).toUTCString())
                        .addFields(
                            {name: "< Anime >\n\n", value: `**Watched:** ${data.statistics.anime.count.toString()}\n**Average score**: ${data.statistics.anime.meanScore.toString()}`, inline: true},
                            {name: "< Manga >\n\n", value: `**Read:** ${data.statistics.manga.count.toString()}\n**Average score**: ${data.statistics.manga.meanScore.toString()}`, inline: true}
                        )   
                        .setColor('0x00ff00')
                        .setFooter(Footer(response));
                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    message.channel.send({ embeds: [titleEmbed] });
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch(error => {
                // log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors)
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
