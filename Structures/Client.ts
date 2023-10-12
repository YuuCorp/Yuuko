import fs from "fs";
import path from "path";
import { REST } from "@discordjs/rest";
import { Client as DiscordClient, Collection } from "discord.js";
import { Routes, GatewayIntentBits } from "discord.js";
import { Command } from "./Command";
import { YuukoComponent } from "../Utils/types";

export class Client extends DiscordClient {
  public commands: Collection<string, Command>;
  public components: Collection<string, YuukoComponent>;
  constructor() {
    super({
      intents: [GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds],
      allowedMentions: { repliedUser: false },
    });

    this.commands = new Collection();
    this.components = new Collection();
  }
  start() {
    console.log(`Starting Yuuko in ${process.env.NODE_ENV} enviroment.`);
    const slashCommands: string[] = [];
    fs.readdirSync("./Commands")
      .filter((file) => file.endsWith(".ts"))
      .forEach((file) => {
        /**
         * @type {Command}
         * Legacy commands with prefix
         */
        const command = require(`#Commands/${file}`);
        console.log(`Command ${command.name} loaded`);
        // @ts-ignore
        this.commands.set(command.name, command);

        if (command.slash) {
          slashCommands.push(command.slash);
        }
      });

    fs.readdirSync("./Components")
      .filter((file) => file.endsWith(".ts"))
      .forEach((file) => {
        const comp: YuukoComponent = require(`#Components/${file}`);
        console.log(`Component ${comp.name} loaded`);
        // @ts-ignore
        this.components.set(comp.name, comp);
      });

    //^ Register Slash Commands
    (async () => {
      const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

      const clientId = process.env.CLIENT_ID || "867010131745177621";
      const guildId = process.env.GUILD_ID || "843208877326860299";

      try {
        console.log(`Started refreshing ${slashCommands.length} slash (/) commands.`);

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: slashCommands });

        if (process.env.NODE_ENV == "production") {
          await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
        }

        console.log(`Refreshed ${slashCommands.length} slash (/) commands.`);
      } catch (error) {
        console.error(error);
      }

      fs.readdirSync("./Events")
        .filter((file) => file.endsWith(".ts"))
        .forEach(async (file) => {
          const event = await import(`../Events/${file}`);
          console.log(`Event ${event.event} loaded`);
          this.on(event.event, event.run.bind(this));
        });

      if (!fs.existsSync(path.join(__dirname, "../Logging"))) {
        fs.mkdirSync(path.join(__dirname, "../Logging"));
      }
      process.env.UPTIME = Date.now().toString();
      this.login(process.env.TOKEN);
    })();
  }
}
