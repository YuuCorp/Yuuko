import fs from 'node:fs'
import path from 'node:path'
import { SlashCommandBuilder } from 'discord.js'

import { mwTrustedUser } from '../Middleware/TrustedUser'
import { Footer } from '../Utils'
import type { Command } from '../Structures'

const name = 'logs'
const description = 'Allows you to see the 25 most recent logs of the bot. (Trusted users only)'

export default {
  name,
  description,
  commandType: 'Internal',
  middlewares: [mwTrustedUser],
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return

      if (!fs.existsSync(path.join(__dirname, '..', 'Logging', 'logs.json')))
        return void interaction.reply(`\`There are no logs to view.\``)

      const logData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'Logging', 'logs.json'), 'utf8')) as Array<{ date: string, user: string, info: string }>
      const logs = logData.slice(-25).map(log => `${log.date}: ${log.user} ran ${log.info}`).join('\n');
      
      return void interaction.reply({
        embeds: [
          {
            title: `Here are the 25 most recent logs.`,
            description: "```\n" + logs + "```",
            color: 0x00FF00,
            footer: Footer(),
          },
        ],
      })
  },
} satisfies Command
