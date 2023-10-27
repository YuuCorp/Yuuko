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

      if (!fs.existsSync(path.join(__dirname, '..', 'Logging', 'logs.txt')))
        return void interaction.reply(`\`There are no logs to view.\``)

      const logs = fs
        .readFileSync(path.join(__dirname, '..', 'Logging', 'logs.txt'), 'utf8')
        .split('\n')
        .reverse()
        .slice(0, 25)
        .reverse()
        .join('\n')
      return void interaction.reply({
        embeds: [
          {
            title: `Here are the 25 most recent logs.`,
            /* example of formating
                        • 2021-08-01 12:00:00: akira#6505 ran command: logs
                        • 2021-08-01 12:00:00: akira#6505 ran command: user
                    */
            description: `\`\`\`\n${logs.replace(/\n/g, '\n')}\`\`\``,
            color: 0x00FF00,
            footer: Footer(),
          },
        ],
      })
  },
} satisfies Command
