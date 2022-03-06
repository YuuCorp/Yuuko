const Discord = require('discord.js');

/**
 * Creates the default pagination object to avoid boilerplate.
 * @param {Array} pageList - An array of pages to be embedded.
 * @param {Object} message - The Discord message object.
 * @returns {Object} The pagination object.
 */
module.exports = (message, pageList) => {
    const buttonList = [
        new Discord.MessageButton().setCustomId("firstbtn").setLabel("First page").setStyle("DANGER"),
        new Discord.MessageButton().setCustomId("previousbtn").setLabel("Previous").setStyle("SUCCESS"),
        new Discord.MessageButton().setCustomId("nextbtn").setLabel("Next").setStyle("SUCCESS"),
        new Discord.MessageButton().setCustomId("lastbtn").setLabel("Last Page").setStyle("DANGER"),
    ];
    return {
        message,
        pageList,
        buttonList,
        autoButton: true,
        autoDelButton: true,
        timeout: 20000,
        replyMessage: true,
        autoDelete: false,
        authorIndependent: true,
    }
}
