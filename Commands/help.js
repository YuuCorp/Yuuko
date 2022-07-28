const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    fs = require("fs"),
    path = require("path"),
    BuildPagination = require("#Utils/BuildPagination.js");

function generateHelpEmbeds(cmdsArr, category) {
    let embeds = [];
    let iterations = Math.ceil(cmdsArr.join("").length / 1024);

    let rowIndex = 0;
    for (let i = 0; i < iterations; i++) {
        let cmdStr = "";
        let charCount = 0;
        while (true) {
            if (!cmdsArr[rowIndex]) {
                break;
            }
            // For some reason if this is left at 1024, it overflows to 1030+
            // in some rare cases.
            if (charCount + cmdsArr[rowIndex].length < 1000) {
                cmdStr += cmdsArr[rowIndex] + "\n";
                charCount = charCount + cmdsArr[rowIndex].length;
                rowIndex++;
            } else {
                break;
            }
        }

        let name = `**:ledger: ${category}**${iterations > 1 ? ` (${i + 1} / ${iterations})` : ''}`;
        //console.log(name, cmdStr)

        let embed = new EmbedBuilder();
        embed.setColor('#1873bf');
        try {
            embed.addFields({ name, value: cmdStr });
        } catch(err) {
            console.error(err)
        }
        embeds.push(embed);
    }
    return embeds;
}

const name = "help";
const description = "Gives you the description of every command and how to use it.";

module.exports = new Command({
    name,
    description,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, run) {
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
        const helpInfoEmbed = new EmbedBuilder();
        helpInfoEmbed.setTitle(":grey_question: Help");
        helpInfoEmbed.setDescription("Here is a list of every command and how to use it. Parameters starting with \`?\` are optional. If you need more information about a command, use `" + run.prefix + "help <command>`.");
        helpInfoEmbed.addFields({ name: "Usage", value: "Use the buttons below to navigate the help pages. Note that a category might have more than one page." });
        helpInfoEmbed.setColor('#1873bf');

        let pageList = [helpInfoEmbed];
        for (category of Object.keys(cmdGroups)) {
            let cmdHelpArr = cmdGroups[category].map((x) => `\`$\` **${x.name}** - \`${x.usage || 'No parameters required.'}\` \n ${x.description} \n`);
            pageList.push(...generateHelpEmbeds(cmdHelpArr, category));
        }

        BuildPagination(interaction, pageList).paginate()
    },
});
