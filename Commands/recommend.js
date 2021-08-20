const Discord = require("discord.js"),
    Command = require("../Structures/Command.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "recommend",
    description: "Recommends anime/manga based off of your most watched genre.",
    type: CommandCategories.AniList,
    async run(message, args, run) {
        message.channel.send("Command is still work in progress.");
    },
});
