const Discord = require("discord.js");
const fs = require("fs");
const Command = require("./Command.js");
const Event = require("./Event.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const intents = new Discord.Intents(32767);

require("dotenv-flow").config();
class Client extends Discord.Client {
    constructor() {
        super({ intents, allowedMentions: { repliedUser: false } });

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();

        this.prefix = process.env.PREFIX || "as!";
    }
    start(token) {
        console.log(`Starting AniSuggest in ${process.env.NODE_ENV} enviroment.`);
        const slashCommands = [];
        fs.readdirSync("./Commands")
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
                /**
                 * @type {Command}
                 * Legacy commands with prefix
                 */
                const command = require(`#Commands/${file}`);
                console.log(`Command ${command.name} loaded`);
                this.commands.set(command.name, command);

                slashCommands.push(new SlashCommandBuilder().setName(command.name).setDescription(command.description));
            });
        
        //^ Register Slash Commands
        const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

        rest.put(Routes.applicationGuildCommands("940695004458909776", "910072889812844604"), { body: slashCommands })
            .then(() => console.log("Successfully registered application commands."))
            .catch(console.error);

        fs.readdirSync("./Events")
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
                /**
                 * @type {Event}
                 */
                const event = require(`../Events/${file}`);
                console.log(`Event ${event.event} loaded`);
                this.on(event.event, event.run.bind(null, this));
            });

        this.login(process.env.TOKEN);
    }
}

module.exports = Client;
