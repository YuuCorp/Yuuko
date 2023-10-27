import { SlashCommandBuilder } from 'discord.js'
import type { Command } from '../Structures'

const name = 'ping'
const usage = '/ping'
const description = 'Shows the ping of the bot!'

export default {
  name,
  usage,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return
    interaction.reply(`Ping: ${client.ws.ping} ms.`)
  },
} satisfies Command
