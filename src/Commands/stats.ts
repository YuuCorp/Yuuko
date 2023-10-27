import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import type { Client, Command } from '../Structures'

const name = 'stats'
const description = 'Shows you the statistics of the server & bot.'

export default {
  name,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return
    if (!interaction.guild)
      return

    const uptime = Date.now() - process.env.UPTIME
    const hours = Math.floor(uptime / 3600000)
    const minutes = Math.floor((uptime % 3600000) / 60000)
    const seconds = Math.floor(((uptime % 3600000) % 60000) / 1000)
    const uptimeString = `${hours} hours, ${minutes} minutes, ${seconds} seconds`

    const embed = new EmbedBuilder()
      .setTitle('Here are the stats!')
      .setColor('Blurple')
      .addFields(
        { name: 'Server Stats', value: `${interaction.guild.memberCount.toString()} members` },
        { name: 'Bot Stats', value: `${client.guilds.cache.size.toString()} servers \n${getMemberCount(client).toString()} members \nUptime: ${uptimeString}` },
      )
    interaction.reply({ embeds: [embed] })

    function getMemberCount(client: Client) {
      let memberCount = 0
      client.guilds.cache.forEach((guild) => {
        memberCount = memberCount + guild.memberCount
      })
      return memberCount
    }
  },
} satisfies Command
