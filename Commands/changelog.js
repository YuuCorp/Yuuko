const Command = require("#Structures/Command.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    { SlashCommandBuilder } = require('discord.js'),
    { execSync } = require('child_process'),
    Footer = require("#Utils/Footer.js");

const name = "changelog";
const description = "See what has changed with the recent updates.";

module.exports = new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, run) {
        //example COMMIT: Added changelog command
        const gitResult = execSync('git log --pretty="COMMIT: %s%n%b" -n 5').toString();
        return interaction.reply({
            embeds: [{
                title: `Here are the most recent changes.`,
                description: `\`\`\`\n${gitResult.trim()} \`\`\``,
                color: 0x00ff00,
                footer: Footer(),
            }]
        });

    }
});