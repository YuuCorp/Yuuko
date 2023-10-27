import { ActionRowBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { mwTrustedUser } from '../Middleware/TrustedUser'
import type { Command } from '../Structures'

const name = 'announcement'
const usage = '/announcement'
const description = 'Make an announcement which shows up in the help menu. (Trusted users only)'

export default {
  name,
  usage,
  description,
  commandType: 'Internal',
  middlewares: [mwTrustedUser],
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return

    const annModal = new ModalBuilder().setCustomId('annModal').setTitle('Announcement!')
    const annInput = new TextInputBuilder().setRequired(true).setMinLength(1).setMaxLength(200).setPlaceholder('Hereby I announce something!').setCustomId('annInput').setLabel('What would you like to announce?').setStyle(TextInputStyle.Paragraph)

    annModal.addComponents(new ActionRowBuilder<TextInputBuilder>().setComponents(annInput))
    await interaction.showModal(annModal)
  },
} satisfies Command
