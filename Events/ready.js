const Event = require("#Structures/Event.js");
const { ActivityType } = require('discord.js');
const fs = require("fs");

module.exports = new Event("ready", (client) => {

    client.user.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers with ${getMemberCount(client)} members.` }], status: 'online' })

    console.log(`${client.user.tag} is ready!`);

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

function getMemberCount(client){
    let memberCount = 0;
    client.guilds.cache.forEach(guild => {
        memberCount = memberCount + guild.memberCount;
    });
    return memberCount;
}