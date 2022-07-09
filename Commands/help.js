const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    fs = require("fs"),
    path = require("path"),
    DefaultPaginationOpts = require("#Utils/DefaultPaginationOpts.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    pagination = require("@acegoal07/discordjs-pagination");

function generateHelpEmbeds(cmdsArr, category) {
    let embeds = [];
    let iterations = Math.ceil(cmdsArr.join("").length / 1024);
    
    let rowIndex = 0;
    for (let i = 0; i < iterations; i++) {
        let cmdStr = "";
        let charCount = 0;
        //let shouldIncrement = true;
        while (true) {
            if (!cmdsArr[rowIndex]) {
                break;
            }
            if (charCount + cmdsArr[rowIndex].length < 1024) {
                cmdStr += cmdsArr[rowIndex] + "\n";
                charCount = charCount + cmdsArr[rowIndex].length;
                rowIndex++;
            } else {
                break;;
            }
        }
        let embed = new Discord.MessageEmbed();
        embed.setColor('BLUE');
        embed.addField(`**:ledger: ${category}**${iterations > 1 ? ` (${i+1} / ${iterations})` : ''}`, cmdStr);
        embeds.push(embed);
    }
    return embeds;
}

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
        const helpInfoEmbed = new Discord.MessageEmbed();
        helpInfoEmbed.setTitle(":grey_question: Help");
        helpInfoEmbed.setDescription("Here is a list of every command and how to use it. Parameters starting with \`?\` are optional. If you need more information about a command, use `" + run.prefix + "help <command>`.");
        helpInfoEmbed.addField("Usage", "Use the buttons below to navigate the help pages. Note that a category might have more than one page.");
        helpInfoEmbed.setColor('BLUE');

        let pageList = [helpInfoEmbed];
        for (category of Object.keys(cmdGroups)) {
            let cmdHelpArr = cmdGroups[category].map((x) => `\`$\` **${x.name}** - \`${x.usage || 'No parameters required.'}\` \n ${x.description} \n`);
            pageList.push(...generateHelpEmbeds(cmdHelpArr, category));
        }

        pagination(DefaultPaginationOpts(message, pageList));
    },
});
