const Event = require("../Structures/Event.js");
const fs = require("fs");

module.exports = new Event("ready", (client) => {
    n = 0;
    statusArray = [
        `${client.guilds.cache.size} Servers with ${client.users.cache.size} members.`,
        '!!help'
    ]
    setInterval(() => {
        if (n === statusArray.length) n = 0;
        const statusActivity = statusArray[n];
        client.user.setPresence({activities: [{ type: 'PLAYING', name: statusActivity }], status: 'online' });
        n++;
    }, 10000)
    
    console.log("Bot is ready")

    // React to update command output if exists
    if (fs.existsSync("./Local/updatemsg.json")) {
        let updatemsg = JSON.parse(fs.readFileSync("./Local/updatemsg.json"));
        try {
            client.channels.cache.get(updatemsg.channelID).messages.fetch(updatemsg.messageID).then(async msg => {
                await msg.react("❤️")
                console.log("Heartbeat sent to update output.")
            });
            fs.unlink("./Local/updatemsg.json", err => {
                if (err) {
                    throw err;
                }
                else {
                    console.log("Deleted updatemsg.json");
                }
            });
        } catch (err) {
            console.log("Failed to react to update message", err);
        }
    }
});