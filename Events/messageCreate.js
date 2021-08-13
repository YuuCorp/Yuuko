const Event = require("../Structures/Event.js");
const config = require("../config.json");

module.exports = new Event("messageCreate", (client, message) => {
    if (!message.content.startsWith(client.prefix)) return;
    
    const args = message.content.substring(config.prefix.length).split(/ +/);

    const command = client.commands.find(cmd => cmd.name == args[0]);

    if(!command) return message.reply(`${args[0]} is not a valid command.`);

    command.run(message, args, client);
})