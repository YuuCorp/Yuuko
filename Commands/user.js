const Discord = require("discord.js");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Command = require("#Structures/Command.js");
const { mwGetUserEntry } = require("#Middleware/UserEntry.js");
const EmbedError = require("#Utils/EmbedError.js");
const Footer = require("#Utils/Footer.js");
const CommandCategories = require("#Utils/CommandCategories.js");
const GraphQLRequest = require("#Utils/GraphQLRequest.js");
const GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "user";
const usage = "user <?anilist name>";
const description = "Searches for an anilist user and displays information about them.";

module.exports = new Command({
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setRequired(false).setDescription("The query to search for")),
  // .setRequired(true)),

  async run(interaction, args, run) {
    const anilistUser = interaction.options.getString("query");
    let vars = { username: anilistUser };

    // If the user hasn't provided a user
    if (!anilistUser) {
      // We try to use the one the user set
      try {
        vars = { userid: interaction.alID };
      } catch (error) {
        console.error(error);
        return interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token.`)] });
      }
    }
    // Make the HTTP Api request
    GraphQLRequest(GraphQLQueries.User, vars)
      .then((response, headers) => {
        const data = response.User;
        if (data) {
          let userColor = data.options.profileColor.charAt(0).toUpperCase() + data.options.profileColor.slice(1);
          if (data.options.profileColor === "pink") userColor = "LuminousVividPink";
          if (data.options.profileColor === "gray") userColor = "Grey";
          const titleEmbed = new EmbedBuilder()
            // TODO: Fix depricated function calls 101
            .setAuthor({ name: data.name, iconURL: "https://anilist.co/img/icons/android-chrome-512x512.png", url: data.siteUrl })
            .setImage(data.bannerImage)
            .setThumbnail(data.avatar.large)
            .addFields(
              { name: "< Anime >\n\n", value: `**Watched:** ${data.statistics.anime.count.toString()}\n**Average score**: ${data.statistics.anime.meanScore.toString()}`, inline: true },
              { name: "< Manga >\n\n", value: `**Read:** ${data.statistics.manga.count.toString()}\n**Average score**: ${data.statistics.manga.meanScore.toString()}`, inline: true },
            )
            .setColor(userColor)
            .setFooter(Footer(headers));
          interaction.reply({ embeds: [titleEmbed] });
        } else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
        }
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
});
