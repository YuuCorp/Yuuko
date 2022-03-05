const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    GraphQLQueries = require("#Utils/GraphQLQueries.js");

module.exports = new Command({
    name: "character",
    usage: "character <name>",
    description: "Gets a character from anilist's DB based on a search result.",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        let vars = { charName: args.slice(1).join(" ") };

        GraphQLRequest(GraphQLQueries.Character, vars)
            .then((response, headers) => {
                let data = response.Character;
                if (data) {
                    //^ Fix the description by replacing and converting HTML tags
                    let description =
                        data.description
                            ?.replace(/<br><br>/g, "\n")
                            .replace(/<br>/g, "\n")
                            .replace(/<[^>]+>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/~!|!~/g, "||") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
                    //console.log(data.dateOfBirth.day || 'no' + data.dateOfBirth.month + data.dateOfBirth.year)
                    const charEmbed = new Discord.MessageEmbed()
                        .setThumbnail(data.image.large)
                        .setTitle(data.name.full)
                        .setDescription(description || "No description available.")
                        .addFields(
                            //age
                            {
                                name: "Character Info: \n",
                                value: `**Age**: ${data.age || "No age specified"}\n **Gender**: ${data.gender || "No gender specified."}`,
                            }
                            //gender
                            //{name: "Gender", value: `${data.gender || 'No gender specified'}`},
                            //Date of birth
                            //{name: "Date Of Birth", value: `${data.dateOfBirth.day || 'no' + data.dateOfBirth.month + data.dateOfBirth.year || 'No date of birth specified'}`},
                            //BloodType
                            //{name: "Blood Type", value: `${data.bloodType || 'No blood type specified'}`}
                        )
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(headers));
                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    message.channel.send({ embeds: [charEmbed] });
                } else {
                    return message.channel.send({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
                }
            })
            .catch((error) => {
                console.log(error)
                message.channel.send({ embeds: [EmbedError(error, vars)] });
            });
    },
});
