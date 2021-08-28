const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "say",
    description: "give text, text come back",
    type: CommandCategories.Misc,

    async run(message, args, run) {
        message.channel.send(`${message.member} said: "${args.slice(1).join(" ")}"`);
    },
});
