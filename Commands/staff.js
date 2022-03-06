const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    Footer = require("#Utils/Footer.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

module.exports = new Command({
    name: "staff",
    usage: 'staff <name>',
    description: "Gives you info about a staff member from anilist's DB.",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        let vars = { staffName: args.slice(1).join(" ") };

        // TODO: Fixme description length, it crashes the bot.
        
        GraphQLRequest(GraphQLQueries.Staff, vars)
            .then((response, headers) => {
                let data = response.Staff;
                if (data) {
                    // Fix the description by replacing and converting HTML tags
                    const descLength = 1000;
                    let description =
                        data.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/~!|!~/g, "||") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    const charEmbed = new Discord.MessageEmbed()
                        .setThumbnail(data.image.large)
                        .setTitle(data.name.full)
                        .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
                        .addFields(
                            { name: "Staff Info: \n", value: `**Age**: ${data.age || "No age specified"} **Gender**: ${data.gender || "No gender specified."}\n **Home Town**: ${data.homeTown || "No home town specified."}` }
                        )
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    message.channel.send({ embeds: [charEmbed] });
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
