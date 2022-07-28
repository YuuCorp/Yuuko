const Command = require("#Structures/Command.js"),
    { SlashCommandBuilder } = require('discord.js'),
    CommandCategories = require("#Utils/CommandCategories.js");

const name = "nhentai";
const usage = "nhentai <id>";
const description = "Gets a hentai from nhentai based on a search result.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args) {
        interaction.reply('This command is currently under development.')
    },
});

