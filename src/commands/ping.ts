import { SlashCommandBuilder } from 'discord.js'
import type { Command } from '../structures'

const name = 'ping'
const usage = '/ping'
const description = 'Shows the ping of the bot!'
const cooldown = 5;

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
    const commandCooldown = client.cooldowns.get(name);
    if (commandCooldown)
      commandCooldown.set(interaction.user.id, Date.now() + cooldown * 1000);
  },
} satisfies Command
