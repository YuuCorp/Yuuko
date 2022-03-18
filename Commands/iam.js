const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    EmbedError = require("#Utils/EmbedError.js"),
    Footer = require("#Utils/Footer.js"),
    CommandCategories = require("#Utils/CommandCategories.js"),
    AnilistUser = require("#Models/AnilistUser.js");

module.exports = new Command({
    name: "iam",
    usage: "iam <anilist_username>",
    description: "Binds an existing AniList username to your Discord account in the bot database.",
    type: CommandCategories.Anilist,

    async run(message, args, run) {
        const username = args[1];
        console.log(username);
        if (!username) {
            return message.channel.send({ embeds: [EmbedError(`Please provide a valid AniList username.`)] });
        }
        const user = await AnilistUser.findOne({ where: { discord_id: message.author.id } });

        // Update existing user
        if (user) {
            try {
                await user.update({ anilist_id: username });
                return message.channel.send({ embeds: [{
                        title: `Successfully updated your AniList username binding.`,
                        description: `Your bound AniList username has been changed to \`${username}\`.`,
                        color: 0x00ff00,
                        footer: Footer(),
                    }]
                });
            } catch(error) {
                return message.channel.send({ embeds: [EmbedError(`An error occurred while updating your AniList username binding:
                                                                   \n\n${error}`, username)] });
            }
        }

        // Create new user
        try {
            await AnilistUser.create({ discord_id: message.author.id, anilist_id: username });
            return message.channel.send({ embeds: [{
                    title: `Successfully bound your AniList username to your Discord account.`,
                    description: `Your AniList username is now \`${username}\`.`,
                    color: 0x00ff00,
                    footer: Footer(),
                }]
            });
        } catch (error) {
            return message.channel.send({ embeds: [EmbedError(`Something went wrong while trying to create your AniList username binding:
                                                               \n\n${error}`, username)]});
        }
    },
});
