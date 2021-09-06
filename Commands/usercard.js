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
    usage: 'usercard <anilist user>',
    description: "Searches for an anilist user and displays a banner with the user's manga and anime statistics.",
    type: CommandCategories.Misc,

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
                    //^ Create canvas
                    Canvas.registerFont(path.join(__dirname, "../Assets/OpenSans-SemiBold.ttf"), { family: "Open_Sans" });
                    const canvas = Canvas.createCanvas(1400, 330);
                    const ctx = canvas.getContext("2d");
                    const bg = await Canvas.loadImage("https://cdn.discordapp.com/attachments/875693863484932106/877230763261710397/anisuggest.png");
                    const pfp = await Canvas.loadImage(data.avatar.large);

                    //^ Show the Profile Picture and Background images
                    //TODO Maybe people could select a custom background
                    ctx.textAlign = "center"
                    ctx.drawImage(bg, 0, 0);
                    ctx.filter = "none";
                    ctx.drawImage(pfp, 50, 50);
                    //(canvas.width/2) - (pfp.width / 2)
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";

                    //^ Get all of the text needed and measure its width
                    //^ Profile name
                    const name = data.name.toUpperCase();
                    const nameWidth = ctx.measureText(name).width;

                    //^ Anime statistics
                    const anime = 'Anime';
                    const watched = `Watched: ${data.statistics.anime.count.toString()}`;
                    const watchedWidth = ctx.measureText(watched).width;
                    const aMeanScore = `Score: ${data.statistics.anime.meanScore.toString()}%`;

                    //^ Manga statistics
                    const manga = 'Manga';
                    const read = `Completed: ${data.statistics.manga.count.toString()}`;
                    //* Not needed right now
                    const readWidth = ctx.measureText(read).width;
                    const mMeanScore = `Score: ${data.statistics.manga.meanScore.toString()}%`;

                    //^ Create a round rectangle 
                    ctx.fillStyle = "rgba(255, 255, 255, 0.2);";
                    //roundRect(ctx, 800, 5, 600, 325, 100, true, false);
                    //roundRect(ctx, canvas.width / 2 - watchedWidth / 2, 100, watchedWidth, 120, 10, true, false);
                    ctx.fillRect(750, 5, 700, 320);

                    //^ Display all of the text 
                    
                    //^ Name text
                    ctx.fillStyle = "#fff";
                    ctx.font = "35pt Open_Sans";
                    ctx.textAlign = "left";
                    ctx.fillText(name, 290, 130);

                    //^ Anime Completed/Mean Score text
                    ctx.textAlign = "center";
                    ctx.font = "30pt Open_Sans";
                    ctx.fillText(anime, 1100, 20)
                    ctx.font = "25pt Open_Sans";
                    ctx.fillText(watched, 950, 90);
                    ctx.fillText(aMeanScore, 1250, 90);

                    //^ Manga Completed/Mean Score text
                    ctx.textAlign = "center"
                    ctx.font = "30pt Open_Sans";
                    ctx.fillText(manga, 1100, 170);
                    ctx.font = "25pt Open_Sans";
                    ctx.fillText(read, 950, 250);
                    ctx.fillText(mMeanScore, 1250, 250)

                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "anilist_banner.png");
                    message.channel.send({ files: [attachment] });
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
