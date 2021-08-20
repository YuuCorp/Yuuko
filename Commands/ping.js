const Command = require("../Structures/Command.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "ping",
    description: "Shows the ping of the bot!",
    type: CommandCategories.Misc,

    async run(message, args, client) {
        message.channel.send(`Ping: ${client.ws.ping} ms.`);
    },
});
