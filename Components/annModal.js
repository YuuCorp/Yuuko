const discord = require("discord.js"),
    Announcement = require("#Models/Announcement.js");

module.exports = {
    name: "annModal",
    async run(interaction, args, client) {
        const annInput = interaction.fields.getTextInputValue("annInput");
        await Announcement.create({ date: new Date(), announcement: annInput });
        return interaction.reply({ content: "Announcement created!", ephemeral: true });
    },
}