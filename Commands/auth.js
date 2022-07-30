const Discord = require("discord.js"),
    path = require('path'),
    fs = require('fs'),
    { EmbedBuilder, SlashCommandBuilder } = require('discord.js'),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    AnilistUser = require("#Models/AnilistUser.js"),
    GraphQLRequest = require("#Utils/GraphQLRequest.js"),
    NodeRSA = require('node-rsa'),
    encryptor = new NodeRSA(fs.readFileSync(path.join(__dirname, '../RSA/id_rsa.pub').toString())),
    decryptor = new NodeRSA(fs.readFileSync(path.join(__dirname, '../RSA/id_rsa').toString()));

const name = "auth";
const usage = "auth <help / anilist_token>";
const description = "Binds an existing AniList user to your Discord account in the bot database.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Anilist,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('Shows you info on how to get your AniList token.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('token')
                .setDescription('Use the AniList token here.')
                .addStringOption(option =>
                    option.setName('token')
                        .setDescription('Add the AniList token here.')
                        .setRequired(true))),

    async run(interaction, args, run) {
        if (!fs.existsSync(path.join(__dirname, '../RSA/id_rsa.pub')) && !fs.existsSync(path.join(__dirname, '../RSA/id_rsa'))) {
            return interaction.reply({
                embeds: [{
                    description: `The person that is hosting this bot has forgotten to add RSA keys, please ping them and bring this to their attention.`,
                    footer: Footer(),
                }], ephemeral: true
            });
        };

        if ("hello" != decryptor.decrypt(encryptor.encrypt('hello', 'base64'), 'utf8')) {
            return interaction.reply({
                embeds: [{
                    description: `The person that is hosting this bot has invalid RSA keys, please ping them and bring this to their attention.`,
                    footer: Footer(),
                }], ephemeral: true
            });
        };

        const type = interaction.options.getSubcommand();
        const token = interaction.options.getString('token');

        if (type != "help" && type != "token") {
            return interaction.reply({ embeds: [EmbedError(`Please use either the help or token subcommand. (Yours was "${type}")`, null, false)], ephemeral: true });
        }

        if (type === "token" && !token) { return interaction.reply({ embeds: [EmbedError(`Please provide a token with this option.`)], ephemeral: true }); }

        if (type === "help") {
            return await interaction.reply({
                embeds: [{
                    title: `Steps to get your AniList Token.`,
                    description: `To add you as an user you have to [login with AniList](https://anilist.co/api/v2/oauth/authorize?client_id=9020&response_type=token). \n Once you've done that, all you have to do is run the command again with the type ` + "`" + "AL_Token" + "`" + ` and paste the token you received on the site into the token option.`,
                    footer: Footer(),
                }], ephemeral: true
            });
        }
        const user = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });

        // Update existing user
        if (user) {
            try {
                let data = (await GraphQLRequest(`query{Viewer{name id}}`, "", token)).Viewer;
                await user.update({ anilist_token: encryptor.encrypt(token, 'base64'), anilist_id: data.id });
                return interaction.reply({
                    embeds: [{
                        title: `Successfully updated your AniList account binding.`,
                        description: `Your Discord-bound AniList account has been changed to \`${data.name}\`.`,
                        color: 0x00ff00,
                        footer: Footer(),
                    }], ephemeral: true
                });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    embeds: [EmbedError(`An error occurred while updating your AniList account binding:
                                                                   \n\n${error}`, null)], ephemeral: true
                });
            }
        }

        // Create new user
        try {
            let data = (await GraphQLRequest(`query{Viewer{name id}}`, "", token)).Viewer;
            await AnilistUser.create({ discord_id: interaction.user.id, anilist_token: encryptor.encrypt(token, 'base64'), anilist_id: data.id });
            return interaction.reply({
                embeds: [{
                    title: `Successfully bound your AniList account to your Discord account.`,
                    description: `Your AniList account is now \`${data.name}\`.`,
                    color: 0x00ff00,
                    footer: Footer(),
                }], ephemeral: true
            });
        } catch (error) {
            console.error(error);
            return await interaction.reply({
                embeds: [EmbedError(`Something went wrong while trying to create your AniList account binding:
                                                               \n\n${error}`, null)], ephemeral: true
            });
        }
    },
});
