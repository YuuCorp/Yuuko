import { execSync } from 'node:child_process'

import { SlashCommandBuilder } from 'discord.js'
import type { Command } from '../structures'
import { footer } from '../utils'

const name = 'changelog'
const description = 'See what has changed with the recent updates.'

export default {
  name,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),
  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return
    // example COMMIT by YuuCorp: Added changelog command
    const gitResult = execSync('git log --pretty="COMMIT by %an: %s%n%b" -n 5').toString()
    return void interaction.reply({
      embeds: [
        {
          title: `Here are the most recent changes.`,
          description: `\`\`\`\n${gitResult.trim()} \`\`\``,
          color: 0x00FF00,
          footer: footer(),
        },
      ],
    })
  },
} satisfies Command
