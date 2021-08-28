const Discord = require('discord.js');

module.exports = (err, params = null, showparams = true) => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Error")
        .addField(`Tracelog / Message `,"```" + `${err.toString()}` + "```")
        .setColor('0xff0000')
    if (showparams) {
        embed.addField(`Params `, params ? "```json\n" + JSON.stringify(params) + "```" : "No parameters provided")
    }
    
    return embed;
}