const Event = require("#Structures/Event.js");

module.exports = new Event("interactionCreate", (client, interaction) => {
    //console.log(interaction)

    // If the interaction wasn't a chat command, we ignore it
    if (!interaction.isChatInputCommand()) return;

    // We run the command based on the interaction
    const command = client.commands.find(cmd => cmd.name == interaction.commandName);
    command.run(interaction, null, client);
})