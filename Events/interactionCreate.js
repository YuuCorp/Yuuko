const Event = require("#Structures/Event.js"),
    { EmbedBuilder } = require('discord.js'),
    Logging = require('#Utils/Logging.js'),
    EmbedError = require("#Utils/EmbedError.js");

module.exports = new Event("interactionCreate", async (client, interaction) => {
    //console.log(interaction)

    // If the interaction wasn't a chat command, we ignore it
    if (!interaction.isChatInputCommand()) return;

    // We run the command based on the interaction
    const command = client.commands.find(cmd => cmd.name == interaction.commandName);
    Logging(command, interaction);
    if (command.middlewares) {
        for (let middleware of command.middlewares) {
            try {
                await middleware.run(interaction);
            } catch (e) {
                return interaction.reply({ embeds: [EmbedError(e)] });
            }
        }
    }
    command.run(interaction, null, client);
})