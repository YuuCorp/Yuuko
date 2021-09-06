const Discord = require("discord.js"),
    Command = require("../Structures/Command"),
    CommandCategories = require("../Utils/CommandCategories"),
    axios = require("axios"),
    Footer = require("../Utils/Footer"),
    EmbedError = require("../Utils/EmbedError");

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

        let url = "https://graphql.anilist.co";

        axios
            .post(url, { query: query, variables: vars })
            .then((response) => {
                //console.log(response.data.data.Media);
                let data = response.data.data.Staff;
                if (data) {
                    //console.log(data);
                    // Fix the description by replacing and converting HTML tags
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
                            { name: "Staff Info: \n", value: `**Age**: ${data.age || "No age specified"} **Gender**: ${data.gender || "No gender specified."}\n **Home Town**: ${data.homeTown || "No home town specified."}` }
                            //gender
                            //{name: "Gender", value: `${data.gender || 'No gender specified'}`},
                            //Date of birth
                            //{name: "Date Of Birth", value: `${data.dateOfBirth.day || 'no' + data.dateOfBirth.month + data.dateOfBirth.year || 'No date of birth specified'}`},
                            //BloodType
                            //{name: "Blood Type", value: `${data.bloodType || 'No blood type specified'}`}
                        )
                        .setURL(data.siteUrl)
                        .setColor("0x00ff00")
                        .setFooter(Footer(response));
                    //data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
                    message.channel.send({ embeds: [charEmbed] });
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
