import fs from 'node:fs'
import path from 'node:path'
import { REST } from '@discordjs/rest'
import { Collection, Client as DiscordClient, GatewayIntentBits, Routes } from 'discord.js'
import type { YuukoComponent } from '../Utils/types'
import { removeExtension } from '../Utils'
import type { ClientCommand, Command } from './Command'

export class Client extends DiscordClient {
  public commands: Collection<string, ClientCommand>
  public components: Collection<string, YuukoComponent>
  constructor() {
    super({
      intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds],
      allowedMentions: { repliedUser: false },
    })

    this.commands = new Collection()
    this.components = new Collection()
  }

  start() {
    console.log(`Starting Yuuko in ${process.env.NODE_ENV} enviroment.`)
    const commandsPath = path.join(__dirname, '..', 'Commands')
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'))
    console.log(`Loading ${commandFiles.length} commands.`)
    const slashCommands = commandFiles.map((file) => {
      const cmd = require(path.join(commandsPath, file)).default as Command
      const builder = cmd?.withBuilder ?? {}
      
      delete cmd.withBuilder
      
      const data = { ...builder, ...cmd }
      this.commands.set(data.name, data)
      return data
    })

    console.log(`Loaded ${slashCommands.length} slash (/) commands.`)
    
    // fs.readdirSync('./Commands')
    //   .filter(file => file.endsWith('.ts'))
    //   .forEach(async (file) => {
    //     const command: Command = (await import(`#Commands/${file}`)).default
    //     console.log(`Command ${command.name} loaded`)
    //     this.commands.set(command.name, command)

    //     if (command.slash)
    //       slashCommands.push(command.slash)
    //   })

    fs.readdirSync('./Components')
      .filter(file => file.endsWith('.ts'))
      .forEach(async (file) => {
        const comp: YuukoComponent = (await import(`#Components/${file}`)).default
        console.log(`Component ${comp.name} loaded`)
        this.components.set(comp.name, comp)
      });

    // ^ Register Slash Commands
    (async () => {
      const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!)

      const clientId = process.env.CLIENT_ID || '867010131745177621'
      const guildId = process.env.GUILD_ID || '843208877326860299'

      try {
        console.log(`Started refreshing ${slashCommands.length} slash (/) commands.`)

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands })

        if (process.env.NODE_ENV == 'production')
          await rest.put(Routes.applicationCommands(clientId), { body: slashCommands })

        console.log(`Refreshed ${slashCommands.length} slash (/) commands.`)
      }
      catch (error) {
        console.error(error)
      }

      const eventsPath = path.join(__dirname, '..', 'Events')

      fs.readdirSync(eventsPath)
        .filter(x => x.endsWith('.ts'))
        .forEach((fileName) => {
          const event = require(`${eventsPath}/${fileName}`)
          let eventName = removeExtension(fileName)

          if (!event?.run) {
            console.log(`Event ${eventName} (${eventsPath}/${fileName}) does not have a run function`)
            process.exit(0)
          }
          const isOnce = eventName.startsWith('$')
          eventName = eventName.substring(isOnce ? 1 : 0)
          this[isOnce ? 'once' : 'on'](eventName, (...args) => event.run(this, ...args))
          console.log(`Registered ${isOnce ? 'once' : 'on'}.${eventName} (${eventsPath}/${fileName})`)
        })

      if (!fs.existsSync(path.join(__dirname, '../Logging')))
        fs.mkdirSync(path.join(__dirname, '../Logging'))

      process.env.UPTIME = Date.now()
      this.login(process.env.TOKEN)
    })()
  }
}
