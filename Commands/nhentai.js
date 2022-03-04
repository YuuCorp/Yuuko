const Command = require("../Structures/Command.js"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "nhentai",
    usage: "nhentai <id>",
    description: "Gets a hentai from nhetai based on a search result.",
    type: CommandCategories.Anilist,

    async run(message, args, run, hook = false, hookdata = null) {
        message.reply('This command is currently under development.')
    },
});

