const RSACryption = require("#Utils/RSACryption.js");
const Discord = require("discord.js"),
  { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
  Command = require("#Structures/Command.js"),
  EmbedError = require("#Utils/EmbedError.js"),
  Footer = require("#Utils/Footer.js"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  AnilistUser = require("#Models/AnilistUser.js"),
  GraphQLRequest = require("#Utils/GraphQLRequest.js");

const name = "auth";
const usage = "auth <help | anilist_token | wipe>";
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
                        .setMinLength(750)
                        .setRequired(true))),

  async run(interaction, args, run) {
    const type = interaction.options.getSubcommand();
    const token = interaction.options.getString("token");

    if (type === "token" && !token) {
      return interaction.reply({ embeds: [EmbedError(`Please provide a token with this option.`)], ephemeral: true });
    }

    if (type === "help") {
      return await interaction.reply({
        embeds: [
          {
            title: `Steps to get your AniList Token.`,
            description:
              `To add you as an user you have to [login with AniList](https://anilist.co/api/v2/oauth/authorize?client_id=9020&response_type=token). \n Once you've done that, all you have to do is run the command again with the subcommand ` +
              "`" +
              "token" +
              "`" +
              ` and paste the token you received on the site into the token option.`,
            footer: Footer(),
          },
        ],
        ephemeral: true,
      });
    }

    const user = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });

    if(type === "wipe") {
      if(!user) return interaction.reply({ embeds: [EmbedError(`You don't have an AniList account bound to your Discord account.`, null, false)], ephemeral: true });
      try {
        await AnilistUser.destroy({ where: { discord_id: interaction.user.id } });
        return interaction.reply({
          embeds: [
            {
              title: `Successfully wiped your AniList account binding.`,
              description: `Your Discord-bound AniList account has been wiped from our database.`,
              color: 0x00ff00,
              footer: Footer(),
            },
          ],
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        return interaction.reply({
          embeds: [
            EmbedError(
              `An error occurred while updating your AniList account binding:
                                                                   \n\n${error}`,
              null
            ),
          ],
          ephemeral: true,
        });
      }
    }

    // Update existing user
    if (user) {
      try {
        let data = (await GraphQLRequest(`query{Viewer{name id}}`, "", token)).Viewer;
        await user.update({ anilist_token: RSACryption(token, false), anilist_id: data.id });
        return interaction.reply({
          embeds: [
            {
              title: `Successfully updated your AniList account binding.`,
              description: `Your Discord-bound AniList account has been changed to \`${data.name}\`.`,
              color: 0x00ff00,
              footer: Footer(),
            },
          ],
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        return interaction.reply({
          embeds: [
            EmbedError(
              `An error occurred while updating your AniList account binding:
                                                                   \n\n${error}`,
              null
            ),
          ],
          ephemeral: true,
        });
      }
    }

    // Create new user
    try {
      let data = (await GraphQLRequest(`query{Viewer{name id}}`, "", token)).Viewer;
      await AnilistUser.create({ discord_id: interaction.user.id, anilist_token: RSACryption(token, false), anilist_id: data.id });
      return interaction.reply({
        embeds: [
          {
            title: `Successfully bound your AniList account to your Discord account.`,
            description: `Your AniList account is now \`${data.name}\`.`,
            color: 0x00ff00,
            footer: Footer(),
          },
        ],
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        embeds: [
          EmbedError(
            `Something went wrong while trying to create your AniList account binding:
                                                               \n\n${error}`,
            null
          ),
        ],
        ephemeral: true,
      });
    }
  },
});
