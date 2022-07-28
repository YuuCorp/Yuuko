const Discord = require("discord.js"),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    AnilistUser = require("#Models/AnilistUser.js");

const name = "iam";
const usage = "iam <anilist_username>";
const description = "Binds an existing AniList username to your Discord account in the bot database.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username to bind')
                .setRequired(true)),


    async run(interaction, args, run) {
        const username = interaction.options.getString('username');
        console.log(username);
        if (!username) {
            return interaction.reply({ embeds: [EmbedError(`Please provide a valid AniList username.`)] });
        }
        const user = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });

        // Update existing user
        if (user) {
            try {
                await user.update({ anilist_id: username });
                return interaction.reply({
                    embeds: [{
                        title: `Successfully updated your AniList username binding.`,
                        description: `Your Discord-bound AniList username has been changed to \`${username}\`.`,
                        color: 0x00ff00,
                        footer: Footer(),
                    }]
                });
            } catch (error) {
                return interaction.reply({
                    embeds: [EmbedError(`An error occurred while updating your AniList username binding:
                                                                   \n\n${error}`, username)]
                });
            }
        }

        // Create new user
        try {
            await AnilistUser.create({ discord_id: interaction.author.id, anilist_id: username });
            return interaction.reply({
                embeds: [{
                    title: `Successfully bound your AniList username to your Discord account.`,
                    description: `Your AniList username is now \`${username}\`.`,
                    color: 0x00ff00,
                    footer: Footer(),
                }]
            });
        } catch (error) {
            return interaction.reply({
                embeds: [EmbedError(`Something went wrong while trying to create your AniList username binding:
                                                               \n\n${error}`, username)]
            });
        }
    },
});
