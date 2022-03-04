const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    Footer = require("#Utils/Footer.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js");

module.exports = new Command({
    name: "staff",
    usage: 'staff <name>',
    description: "Gives you info about a staff member from anilist's DB.",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        let query = `query($staffName: String) {
        Staff(search: $staffName) {
            name{
                full
                }
            age
            image{
                large
            }
            description
            gender
            homeTown
            siteUrl
                }
          }`;
        let vars = { staffName: args.slice(1).join(" ") };

        GraphQLRequest(query, vars)
            .then((response, headers) => {
                let data = response.Staff;
                if (data) {
                    // Fix the description by replacing and converting HTML tags
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
                        .setDescription(description || "No description available.")
                        .addFields(

                            { name: "Staff Info: \n", value: `**Age**: ${data.age || "No age specified"} **Gender**: ${data.gender || "No gender specified."}\n **Home Town**: ${data.homeTown || "No home town specified."}` }
                        )
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    message.channel.send({ embeds: [charEmbed] });
                } else {
                    message.channel.send("Could not find any data.");
                }
            })
            .catch((error) => {
                console.error(error);
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
