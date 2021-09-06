const Discord = require("discord.js"),
    Command = require("../Structures/Command"),
    fs = require("fs"),
    path = require("path"),
    CommandCategories = require("../Utils/CommandCategories");

module.exports = new Command({
    name: "help",
    description: "Gives you the description of every command and how to use it.",

    async run(message, args, run) {
        // Require all files from the commands folder and fetch description
        let cmds = fs.readdirSync(__dirname).filter((x) => x.endsWith(".js") && x != "help.js");
        let cmdsDesc = [];
        let cmdGroups = {};
        for (let cmd of cmds) {
            const cmdEntry = require(path.join(__dirname, cmd));
            if (!cmdGroups[cmdEntry.type]) {
                cmdGroups[cmdEntry.type] = [];
            }
            cmdGroups[cmdEntry.type].push({ usage: cmdEntry.usage, name: cmdEntry.name, description: cmdEntry.description });
        }
        // Send the description to the user
        const helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setTitle(":grey_question: Help");
        helpEmbed.setDescription("Here is a list of every command and how to use it.");
        helpEmbed.setColor('BLUE');
        for (category of Object.keys(cmdGroups)) {
            helpEmbed.addField(`<**${category}**>`, cmdGroups[category].map((x) => `**${x.name}** - \`${x.usage || 'No parameters required.'}\` \n ${x.description} \n`).join("\n"));
        }
        await message.channel.send({ embeds: [helpEmbed] });
        //!!recommend userName genre
    },
});
