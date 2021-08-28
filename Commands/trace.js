const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    axios = require("axios"),
    EmbedError = require("../Utils/EmbedError.js"),
    Footer = require("../Utils/Footer.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "trace",
    description: "Gets an anime from an image.",
    type: CommandCategories.AniList,

    async run(message, args, run) {
        // Send and axios request to trace.moe with an image the user attached
        axios.get(`https://api.trace.moe/search?url=${message.attachments.first().url}`)
            .then(async res => {
                console.log(res.data.result[0]);
                // If the request was successful
                const embed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`Trace result for ${message.attachments.first().filename}`)
                    .setDescription(`[Link](${res.data.result[0].video})`)
                    .setImage(res.data.result[0].image)
                message.channel.send(embed);
            })
            .catch(err => {
                console.log(err.response);
            });
    }
});