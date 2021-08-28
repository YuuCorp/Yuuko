const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    Canvas = require("canvas"),
    path = require("path"),
    { roundRect } = require("../Utils/CanvasHelper.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "usercard",
    description: "Searches for an AniList user and displays a banner for it.",
    type: CommandCategories.AniList,

    async run(message, args, run) {
        let query = `query ($username: String) {
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
        axios
            .post(url, { query: query, variables: vars })
            .then(async (response) => {
                let data = response.data.data.User;
                if (data) {
                    //const titleEmbed = new Discord.MessageEmbed()
                    //    .setAuthor(data.name, 'https://anilist.co/img/icons/android-chrome-512x512.png', data.siteUrl)
                    //    .setImage(data.bannerImage)
                    //    .setThumbnail(data.avatar.large)
                    //    //.setTitle('Created At: ' + new Date(data.createdAt * 1000).toUTCString())
                    //    .addFields(
                    //        {name: "< Anime >\n\n", value: `**Watched:** ${data.statistics.anime.count.toString()}\n**Average score**: ${data.statistics.anime.meanScore.toString()}`, inline: true},
                    //        {name: "< Manga >\n\n", value: `**Read:** ${data.statistics.manga.count.toString()}\n**Average score**: ${data.statistics.manga.meanScore.toString()}`, inline: true}
                    //    )
                    //    .setColor('0x00ff00')
                    //    .setFooter(Footer(response))

                    Canvas.registerFont(path.join(__dirname, "../Assets/OpenSans-SemiBold.ttf"), { family: "Open_Sans" });
                    const canvas = Canvas.createCanvas(1400, 330);
                    const ctx = canvas.getContext("2d");
                    const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/875693863484932106/877230763261710397/anisuggest.png");
                    const pfp = await Canvas.loadImage(data.avatar.large);

                    ctx.filter = "blur(4px)";
                    ctx.drawImage(bg, 0, 0);
                    ctx.filter = "none";
                    ctx.drawImage(pfp, 50, 50);
                    //(canvas.width/2) - (pfp.width / 2)
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";

                    const text = data.name.toUpperCase();
                    const textWidth = ctx.measureText(text).width;
                    const watched = `Watched: ${data.statistics.anime.count.toString()}`;
                    const watchedWidth = ctx.measureText(watched).width;

                    ctx.fillStyle = "rgba(255, 255, 255, 0.3);";

                    roundRect(ctx, canvas.width / 2 - watchedWidth / 2, textWidth, 120, 10, true, false);
                    roundRect(ctx, canvas.width / 2 - watchedWidth / 2, 100, watchedWidth, 120, 10, true, false);
                    //ctx.fillRect((canvas.width/2) - (textWidth / 2) - 15, 300, textWidth + 30, 120);

                    ctx.fillStyle = "#fff";
                    ctx.font = "45pt Open_Sans";
                    ctx.textAlign = "left";
                    ctx.fillText(text, 290, 130);
                    ctx.textAlign = "center";
                    ctx.font = "40pt Open_Sans";
                    ctx.fillText(watched, 1000, canvas.height / 2);

                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "anilist_banner.png");
                    message.channel.send({ files: [attachment] });
                    //message.channel.send({ embeds: [titleEmbed] });
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch((error) => {
                // log axios request status code and error
                if (error.response) {
                    console.log(error.response.data.errors);
                } else {
                    console.log(error);
                }
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
