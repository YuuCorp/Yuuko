import fs from 'fs'
import path from 'path'
import type { Command, UsableInteraction } from '#structures/index'
import type { YuukoLog } from './types'

export function logging(command: Command, interaction: UsableInteraction) {
  try {
    const logPath = path.join(import.meta.dir, '..', 'Logging/logs.json')
    const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

    if (!interaction.isCommand()) return
    const subcommand = interaction.options.getSubcommand(false);

    const log = {
      date: currentDate,
      user: `${interaction.user.username}${+interaction.user.discriminator === 0 ? '' : "#" + interaction.user.discriminator}`,
      info: `${command.name} ${subcommand}`
    } satisfies YuukoLog
    const previousLogs = JSON.parse(fs.readFileSync(logPath, 'utf8')) as Array<typeof log>
    previousLogs.push(log)

    fs.writeFileSync(logPath, JSON.stringify(previousLogs));
  }
  catch (e) {
    console.log(e)
  }
}
