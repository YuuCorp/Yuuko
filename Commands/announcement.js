const Command = require("#Structures/Command.js"),
  Discord = require("discord.js"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  { SlashCommandBuilder } = require("discord.js");

const name = "announcement";
const description = "Make an announcement which shows up in the help menu. (Trusted users only)";

module.exports = new Command({
  name,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder().setName(name).setDescription(description),

  async run(interaction, args, client) {
    if (!process.env.TRUSTED_USERS.includes(interaction.user.id)) return interaction.reply({ content: "Sorry, you don't have the permission to run this command!", ephemeral: true });

    const annModal = new Discord.ModalBuilder().setCustomId("annModal").setTitle("Announcement!");
    const annInput = new Discord.TextInputBuilder()
      .setCustomId("annInput")
      .setLabel("What would you like to announce?")
      .setMaxLength(128)
      .setMinLength(1)
      .setRequired(true)
      .setPlaceholder("Hereby I announce something!")
      .setStyle(Discord.TextInputStyle.Paragraph);

    annModal.addComponents(new Discord.ActionRowBuilder().addComponents(annInput));
    await interaction.showModal(annModal);
  },
});
