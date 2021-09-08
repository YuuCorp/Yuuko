const Event = require("../Structures/Event.js");

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
    }, 5000)
    
    console.log("Bot is ready")
});