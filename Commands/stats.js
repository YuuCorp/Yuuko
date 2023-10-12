const Command = require("#Structures/Command.js"),
  fs = require("fs"),
  path = require("path"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const name = "stats";
const description = "Shows you the statistics of the server & bot.";

module.exports = new Command({
  name,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder().setName(name).setDescription(description),

  async run(interaction, args, client) {
    const uptime = Date.now() - process.env.UPTIME;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor(((uptime % 3600000) % 60000) / 1000);
    const uptimeString = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    const embed = new EmbedBuilder()
      .setTitle("Here are the stats!")
      .setColor("Blurple")
      .addFields(
        { name: "Server Stats", value: `${interaction.guild.memberCount.toString()} members` },
        { name: "Bot Stats", value: `${client.guilds.cache.size.toString()} servers \n ${getMemberCount(client).toString()} members \n Uptime: ${uptimeString}` },
      );
    interaction.reply({ embeds: [embed] });

    function getMemberCount(client) {
      let memberCount = 0;
      client.guilds.cache.forEach((guild) => {
        memberCount = memberCount + guild.memberCount;
      });
      return memberCount;
    }
  },
});
