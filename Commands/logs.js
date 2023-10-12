const Command = require("#Structures/Command.js"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  Discord = require("discord.js"),
  { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
  Footer = require("#Utils/Footer.js"),
  path = require("path"),
  fs = require("fs");

const name = "logs";
const description = "Allows you to see the 25 most recent logs of the bot. (Trusted users only)";

module.exports = new Command({
  name,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder().setName(name).setDescription(description),

  async run(interaction, args, run) {
    if (JSON.parse(process.env.TRUSTED_USERS).includes(interaction.user.id) /* && process.env.NODE_ENV === "production"*/) {
      if (!fs.existsSync(path.join(__dirname, "../Logging", "logs.txt"))) {
        return interaction.reply(`\`There are no logs to view.\``);
      }
      const logs = fs
        .readFileSync(path.join(__dirname, "../Logging", "logs.txt"), "utf8")
        .split("\n")
        .reverse()
        .slice(0, 25)
        .reverse()
        .join("\n");
      return interaction.reply({
        embeds: [
          {
            title: `Here are the 25 most recent logs.`,
            /* example of formating
                        • 2021-08-01 12:00:00: akira#6505 ran command: logs
                        • 2021-08-01 12:00:00: akira#6505 ran command: user
                    */
            description: `\`\`\`\n${logs.replace(/\n/g, "\n")}\`\`\``,
            color: 0x00ff00,
            footer: Footer(),
          },
        ],
      });
    }
  },
});
