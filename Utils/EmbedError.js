const Discord = require('discord.js');

module.exports = (err, params) => {
    return new Discord.MessageEmbed()
        .setTitle("Error")
        .addField(`Params `, params ? "```json\n" + JSON.stringify(params) + "```" : "No parameters provided")
        .addField(`Tracelog `,"```" + `${err.toString()}` + "```")
        .setColor('0xff0000')
}