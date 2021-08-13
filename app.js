const fs = require("fs");
const Command = require("./Structures/Command.js");
const Client = require("./Structures/Client.js");
const config = require("./config.json");
const client = new Client();

fs.readdirSync("./Commands").filter(file => file.endsWith(".js"))
    .forEach(file => {
        /**
         * @type {Command}
         */
    const command = require(`./Commands/${file}`);
    console.log(`Command ${command.name} loaded`);
    client.commands.set(command.name, command);
})

client.on("ready", () => console.log("AniSuggest is online!"));
client.on("messageCreate", (message) => {
  
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.substring(config.prefix.length).split(/ +/);

    const command = client.commands.find(cmd => cmd.name == args[0]);

    if(!command) return message.reply(`${args[0]} is not a valid command.`);

    command.run(message, args, client);
});
client.login(config.token);
