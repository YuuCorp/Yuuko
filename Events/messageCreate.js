const Event = require("#Structures/Event.js");

module.exports = new Event("messageCreate", (client, message) => {
    // If it's not the prefix, or the author is the bot itself then reject
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;
    
    const args = message.content.substring((process.env.PREFIX || "as!").length).split(/ +/);
    const command = client.commands.find(cmd => cmd.name == args[0]);

    args[0] = args[0].replaceAll("\\", "");
    if(!command) return message.reply(`\`${args[0]}\` is not a valid command.`);

    command.run(message, args, client);
})