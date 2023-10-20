import fs from 'fs'
import path from 'path'
import type { CommandInteractionOptionResolver, Interaction } from 'discord.js'
import type { Command } from '../Structures/Command'

export function Logging(command: Command, interaction: Interaction) {
  try {
    const logPath = path.join(__dirname, '..', 'Logging/logs.txt')
    const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    if (!fs.existsSync(path.join(__dirname, '..', 'Logging'))) {
      fs.mkdirSync(path.join(__dirname, '..', 'Logging'))
      fs.writeFileSync(logPath, 'Initiating log!')
    }
    if (!interaction.isCommand()) return
    const subcommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand(false)
    const log = `${fs.readFileSync(logPath, 'utf8').toString()}\n` + `${currentDate}: ${interaction.user.username}#${interaction.user.discriminator} ran command: ${command.name}${subcommand ? ` ${subcommand}` : ''}`
    fs.writeFileSync(logPath, log, 'utf8')
  }
  catch (e) {
    console.log(e)
  }
}
