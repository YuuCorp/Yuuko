const Discord = require("discord.js");
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const Command = require("#Structures/Command.js");
const CommandCategories = require("#Utils/CommandCategories.js");
const EmbedError = require("#Utils/EmbedError.js");
const MangaCmd = require("#Commands/manga.js");
const AnimeCmd = require("#Commands/anime.js");
const GraphQLRequest = require("#Utils/GraphQLRequest.js");
const GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "recommend";
const usage = "recommend <anime | manga> <anilist user> <genre1, genreN>";
const description = "Recommends unwatched anime/manga based on the requested genre(s).";

module.exports = new Command({
  name,
  usage,
  description,
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("type").setDescription("The recommendation type").setRequired(true).addChoices({ name: "Anime", value: "ANIME" }, { name: "Manga", value: "MANGA" }))
    .addStringOption((option) => option.setName("anilist_user").setDescription("The AniList user the recommendation targets").setRequired(true))
    .addStringOption((option) => option.setName("genres").setDescription('A comma separated list of genres (e.g. "romance, drama")').setRequired(true)),

  async run(interaction, args, run) {
    const type = interaction.options.getString("type");
    const anilistUser = interaction.options.getString("anilist_user");
    const genres = interaction.options.getString("genres").replaceAll(", ", ",");

    const vars = { type, userName: anilistUser };

    if (type != "ANIME" && type != "MANGA") return interaction.reply({ embeds: [EmbedError(`Please specify either manga, or anime as your content type. (Yours was "${type}")`, null, false)] });

    const excludeIDs = [];

    // ^ First we query the user to find what ID-s we should exclude from the search pool.
    GraphQLRequest(GraphQLQueries.GetMediaCollection, vars)
      .then((response, headers) => {
        const data = response.MediaListCollection;
        if (data) {
          // ^ We filter out the Planning list
          for (const MediaList of data.lists.filter((MediaList) => MediaList.name != "Planning")) MediaList.entries.map((e) => excludeIDs.push(e.media.id));

          ProcessRecommendations(genres);
        } else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data from the user specified. (Which was "${vars.userName}")`, null, false)] });
        }
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });

    function ProcessRecommendations(genres) {
      if (!genres.length) return interaction.reply({ embeds: [EmbedError(`Please specify at least one genre.`, null, false)] });

      genres = genres.split(",").map((genre) => genre.trim());
      const recommendationVars = { type, exclude_ids: excludeIDs, genres };

      GraphQLRequest(GraphQLQueries.Recommendations, recommendationVars)
        .then((response) => {
          const data = response.Page;
          if (data) {
            // ^ Filter out the Planning list
            const recommendations = data.media.filter((Media) => Media.title.english != null);
            const random = Math.floor(Math.random() * Math.floor(recommendations.length));
            switch (type) {
              case "ANIME":
                AnimeCmd.run(interaction, args, run, true, {
                  title: recommendations[random].title.english,
                });
                break;
              case "MANGA":
                MangaCmd.run(interaction, args, run, true, {
                  title: recommendations[random].title.english,
                });
                break;
            }
          } else {
            return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, recommendationVars)] });
          }
        })
        .catch((error) => {
          console.error(error);
          interaction.reply({ embeds: [EmbedError(error, vars)] });
        });
    }
  },
});
