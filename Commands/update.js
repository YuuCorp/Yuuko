// TODO: Fix
const Command = require("#Structures/Command.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    CommandCategories = require("#Utils/CommandCategories.js"),
    { spawn, execSync } = require('child_process'),
    path = require('path'),
    fs = require('fs');

const name = "update";
const description = "Checks for the latest update, and restarts the bot if any are found. (Trusted users only)";

module.exports = new Command({
    name,
    description,
    type: CommandCategories.Misc,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),

    async run(interaction, args, run) {
        try {

            if (JSON.parse(process.env.TRUSTED_USERS).includes(interaction.user.id)/* && process.env.NODE_ENV === "production"*/) {
                let updateMessage = await interaction.reply({ content: "Updating...", fetchReply: true });
                const editMessage = async content => {
                    await interaction.editReply("```sh\n" + content + "```");
                }

                const update = spawn('sh', ['update.sh']);
                let updateLogs = ""

                let rateLimitCurrent = 0;
                let rateLimitMax = 4;
                let updateInterval = setInterval(() => {
                    if (rateLimitCurrent < rateLimitMax) {
                        console.log(`Sending update logs ${rateLimitCurrent}/${rateLimitMax}`);
                        editMessage(updateLogs);
                        rateLimitCurrent++;
                    } else {
                        clearInterval(updateInterval);
                    }
                }, 500);
                update.stdout.on('data', data => {
                    console.log(data.toString());
                    updateLogs += data;
                });
                update.stderr.on('data', data => {
                    console.log(data.toString());
                    updateLogs += `STDERR: ${data}`;
                });
                update.on('close', async code => {
                    console.log(`Procedures completed with code ${code}, restarting...`);
                    updateLogs += `Procedures completed with code ${code}, restarting...  `;
                    if (updateInterval) clearInterval(updateInterval);
                    await editMessage(updateLogs);
                    //await interaction.deferEdit();

                    // Make a temporary file that stores the ID of the message sent, and the channel ID it was sent in
                    // This is so that the bot can react to the message after restarting
                    if (!fs.existsSync(path.join(__dirname, "../Local"))) {
                        fs.mkdirSync(path.join(__dirname, "../Local"));
                    }

                    const tempFile = path.join(__dirname, "../Local/updatemsg.json");
                    console.log(updateMessage)
                    fs.writeFileSync(tempFile, JSON.stringify({ id: updateMessage.id, channelId: updateMessage.channelId }));
                    //execSync('git rev-parse --short HEAD > commit.hash', { encoding: 'utf-8' });
                    execSync('pm2 restart "Yuuko Production"', { encoding: 'utf-8' });
                });
            }
        } catch (error) {
            console.log(error)
        }
    }
});
