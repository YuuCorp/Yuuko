const { execSync } = require("node:child_process");
const { SlashCommandBuilder } = require("discord.js");
const Command = require("#Structures/Command.js");
const CommandCategories = require("#Utils/CommandCategories.js");
const Footer = require("#Utils/Footer.js");

const name = "changelog";
const description = "See what has changed with the recent updates.";

module.exports = new Command({
  name,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder().setName(name).setDescription(description),

  async run(interaction, args, run) {
    // example COMMIT by YuuCorp: Added changelog command
    const gitResult = execSync('git log --pretty="COMMIT by %an: %s%n%b" -n 5').toString();
    return interaction.reply({
      embeds: [
        {
          title: `Here are the most recent changes.`,
          description: `\`\`\`\n${gitResult.trim()} \`\`\``,
          color: 0x00ff00,
          footer: Footer(),
        },
      ],
    });
  },
});
