const Discord = require('discord.js'),
      Command = require("../Structures/Command.js")


module.exports = new Command({
    name: "say",
    description: "give text, text come back",
    async run(message, args, run) {
        message.channel.send(`${message.member} said: "${args.slice(1).join(" ")}"`);
    }
})