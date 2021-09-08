const Command = require("../Structures/Command"),
    CommandCategories = require("../Utils/CommandCategories"),
    { spawn, execSync } = require('child_process'),
    path = require('path'),
    fs = require('fs');

module.exports = new Command({
    name: "update",
    description: "Checks for the latest update, and restarts the bot if any are found. (Trusted users only)",
    type: CommandCategories.Misc,

    async run(message, args, run) {

        if (JSON.parse(process.env.TRUSTED_USERS).includes(message.author.id)/* && process.env.NODE_ENV === "production"*/) {
            let updateMessage = await message.channel.send("Updating...");
            const editMessage = async content => {
                await updateMessage.edit("```sh\n" + content + "```");
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

                // Make a temporary file that stores the ID of the message sent, and the channel ID it was sent in
                // This is so that the bot can react to the message after restarting
                const tempFile = path.join(__dirname, "../Local/updatemsg.json");
                const tempFileData = {
                    messageID: updateMessage.id,
                    channelID: updateMessage.channel.id
                }
                fs.writeFileSync(tempFile, JSON.stringify(tempFileData));
                execSync('git rev-parse --short HEAD > commit.hash', { encoding: 'utf-8' });
            });
        }
    }
});
