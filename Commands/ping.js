const Command = require("#Structures/Command.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    { SlashCommandBuilder } = require("discord.js");

const name = "ping";
const description = "Shows the ping of the bot!";

module.exports = new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, client) {
        interaction.reply(`Ping: ${client.ws.ping} ms.`);
    },
});
