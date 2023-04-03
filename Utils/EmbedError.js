const Discord = require('discord.js'),
    { EmbedBuilder } = require('discord.js');

/**
 * Returns a Discord embed with the error message.
 * @param {Error} err The error to embed.
 * @param {Object} params The parameters the user specified that might
 *                        have caused this error.
 * @param {Boolean} [showParams=true] Whether or not to show the parameters.
 * @returns {EmbedBuilder} The embed.
 */
module.exports = (err, params = null, showparams = true) => {
    const embed = new EmbedBuilder()
        .setTitle("Error")
        .addFields({ name: `Tracelog / Message `, value: "```" + `${err.toString()}` + "```" })
        .setColor('Red')
    if (showparams) {
        embed.addFields({ name: `Params `, value: params ? "```json\n" + JSON.stringify(params) + "```" : "No parameters provided" })
    }

    return embed;
}