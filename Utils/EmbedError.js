const Discord = require('discord.js');

/**
 * Returns a Discord embed with the error message.
 * @param {Error} err The error to embed.
 * @param {Object} params The parameters the user specified that might
 *                        have caused this error.
 * @param {Boolean} [showParams=true] Whether or not to show the parameters.
 * @returns {Discord.MessageEmbed} The embed.
 */
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