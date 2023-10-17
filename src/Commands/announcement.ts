import { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import type { Command } from '../Structures'

const name = 'announcement'
const usage = '/announcement'
const description = 'Make an announcement which shows up in the help menu. (Trusted users only)'

export default {
  name,
  usage,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return

    if (!process.env.TRUSTED_USERS.includes(interaction.user.id))
      return void interaction.reply({ content: 'Sorry, you don\'t have the permission to run this command!', ephemeral: true })

    const annModal = new ModalBuilder().setCustomId('annModal').setTitle('Announcement!')
    const annInput = new TextInputBuilder().setRequired(true).setMinLength(1).setMaxLength(128).setPlaceholder('Hereby I announce something!').setCustomId('annInput').setLabel('What would you like to announce?').setStyle(TextInputStyle.Paragraph)

    annModal.addComponents(new ActionRowBuilder<TextInputBuilder>().setComponents(annInput))
    await interaction.showModal(annModal)
  },
} satisfies Command
