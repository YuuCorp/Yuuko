const Event = require("#Structures/Event.js"),
    { EmbedBuilder } = require('discord.js'),
    Logging = require('#Utils/Logging.js'),
    EmbedError = require("#Utils/EmbedError.js");

module.exports = new Event("interactionCreate", async (client, interaction) => {
    //console.log(interaction)

    // If the interaction wasn't a chat command, we ignore it
    if (interaction.isChatInputCommand()) {

    // We run the command based on the interaction
    const command = client.commands.find(cmd => cmd.name == interaction.commandName);
    Logging(command, interaction);
        command.run(await runMiddleware(command, interaction), null, client);

        // Check for autocomplete
    } else if (interaction.isAutocomplete()) {
        const command = client.commands.find(cmd => cmd.name == interaction.commandName);
        await command.autocomplete(await runMiddleware(command, interaction));

        // Check for modal
    } else if (interaction.isModalSubmit()) {
        const component = client.components.find(comp => comp.name == interaction.customId);
        component.run(await runMiddleware(component, interaction), null, client);
    }
})

async function runMiddleware(item, interaction) {
    if (!item.middlewares) return interaction;
    for (let middleware of item.middlewares) {
        try {
            await middleware.run(interaction);
        } catch (e) {
            return interaction.reply({ embeds: [EmbedError(e)] });
        }
    }
    return interaction;
}