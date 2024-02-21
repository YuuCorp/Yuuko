import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import type { Command } from '../Structures'
import { getStats } from '../Utils'

const name = 'stats'
const description = 'Shows you the statistics of the server & bot.'

export default {
  name,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return
    if (!interaction.guild) return

    const uptime = Date.now() - process.env.UPTIME
    const hours = Math.floor(uptime / 3600000)
    const minutes = Math.floor((uptime % 3600000) / 60000)
    const seconds = Math.floor(((uptime % 3600000) % 60000) / 1000)
    const uptimeString = `${hours} hours, ${minutes} minutes, ${seconds} seconds`

    const { servers, members, registered } = await getStats(client);

    const embed = new EmbedBuilder()
      .setTitle('Here are the stats!')
      .setColor('Blurple')
      .addFields(
        { name: 'Server Stats', value: `${interaction.guild.memberCount.toString()} members` },
        { name: 'Bot Stats', value: `${registered} registered users \n${servers} servers \n${members} members \nUptime: ${uptimeString}` },
      )
    interaction.reply({ embeds: [embed] })

  },
} satisfies Command
