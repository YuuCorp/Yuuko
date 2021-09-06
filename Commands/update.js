const Command = require("../Structures/Command"),
    CommandCategories = require("../Utils/CommandCategories"),
    Footer = require("../Utils/Footer"),
    EmbedError = require("../Utils/EmbedError"),
    { spawn, execSync } = require('child_process');

module.exports = new Command({
    name: "update",
    description: "Checks for the latest update, and restarts the bot if any are found. (Trusted users only)",
    type: CommandCategories.Misc,

    async run(message, args, run) {
        if (JSON.parse(process.env.TRUSTED_USERS).includes(message.author.id)/* && process.env.NODE_ENV === "production"*/) {
            let updateMessage = await message.channel.send("Updating...");
            const editMessage = content => {
                updateMessage.edit("```sh\n" + content + "```");
            }

            const update = spawn('sh', ['update.sh']);
            let updateLogs = ""
            let updateInterval = setInterval(() => editMessage(updateLogs), 500);
            update.stdout.on('data', data => {
                console.log(data.toString());
                updateLogs += data;
                //editMessage(updateLogs);
            });
            update.stderr.on('data', data => {
                console.log(data.toString());
                updateLogs += `ERR: ${data}`;
                //editMessage(updateLogs);
            });
            update.on('close', code => {
                console.log(`Procedures completed with code ${code}, restarting...`);
                updateLogs += `Procedures completed with code ${code}, restarting...  `;
                clearInterval(updateInterval);
                editMessage(updateLogs);
                execSync('git rev-parse --short HEAD > commit.hash', { encoding: 'utf-8' });
            });
        }
    }
});
