const Event = require("../Structures/Event.js");

module.exports = new Event("ready", (client) => {
    client.user.setPresence({activities: [{ type: 'PLAYING', name: '🔧 Being Developed' }], status: 'online' });
    console.log("Bot is ready")
});