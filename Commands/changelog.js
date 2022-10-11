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
        const gitResult = execSync('git log --oneline -n 5').toString();
        const gitLog = gitResult.split('\n').filter(item => item).map(commit => {
            return commit.replace(commit.substring(0, commit.indexOf(' ') + 1), '');
        });
        return interaction.reply({
            embeds: [{
                title: `Here are the most recent changes.`,
                description: `\`\`\`\n${gitLog.join('<BREAKCOMMIT>').replaceAll('<BREAKCOMMIT>', '\n\n')} \`\`\``,
                color: 0x00ff00,
                footer: Footer(),
            }]
        });

    }
});