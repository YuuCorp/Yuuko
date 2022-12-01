const Discord = require('discord.js'),
    { ButtonBuilder } = require('discord.js'),
    PaginationWrapper = require("@acegoal07/discordjs-pagination");

/**
 * Creates the default pagination object to avoid boilerplate.
 * @param {Array} pageList - An array of pages to be embedded.
 * @param {Object} interaction - The Discord interaction object.
 * @returns {Object} The pagination object.
 */
module.exports = (interaction, pageList) => {
    const buttonList = [
        new ButtonBuilder().setCustomId("firstbtn").setLabel("First page").setStyle("Danger"),
        new ButtonBuilder().setCustomId("previousbtn").setLabel("Previous").setStyle("Success"),
        new ButtonBuilder().setCustomId("nextbtn").setLabel("Next").setStyle("Success"),
        new ButtonBuilder().setCustomId("lastbtn").setLabel("Last Page").setStyle("Danger"),
    ];

    return new PaginationWrapper().setInterface(interaction)
        .setPageList(pageList)
        .setButtonList(buttonList)
        .enableAutoButton(false)
        .enableAutoDelete()
        .setTimeout(20000);
}
