import MangaCmd from "#commands/manga";
import AnimeCmd from "#commands/anime";
import { embedError, graphQLRequest, SeriesTitle, getOptions } from "#utils/index";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/command";
import type { MediaType } from "#graphQL/types";

const name = "recommend";
const usage = "recommend <anime | manga> <anilist user> <genre1, genreN>";
const description = "Recommends unwatched anime/manga based on the requested genre(s).";

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("type").setDescription("The recommendation type").setRequired(true).addChoices({ name: "Anime", value: "ANIME" }, { name: "Manga", value: "MANGA" }))
    .addStringOption((option) => option.setName("anilist_user").setDescription("The AniList user the recommendation targets").setRequired(true))
    .addStringOption((option) => option.setName("genres").setDescription('A comma separated list of genres (e.g. "romance, drama")').setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;

    const { type } = getOptions<{ type: MediaType }>(interaction.options, ["type"]);
    const { anilist_user: anilistUser } = getOptions<{ anilist_user: string }>(interaction.options, ["anilist_user"]);
    const genres = getOptions<{ genres: string }>(interaction.options, ["genres"]).genres.replaceAll(", ", ",");

    const vars = { type, userName: anilistUser };

    if (type != "ANIME" && type != "MANGA") return void interaction.reply({ embeds: [embedError(`Please specify either manga, or anime as your content type. (Yours was "${type}")`, null, '', false)] });

    const excludeIDs: number[] = [];

    // ^ First we query the user to find what ID-s we should exclude from the search pool.
    try {
      const {
        data: { MediaListCollection: data },
      } = await graphQLRequest("GetMediaCollection", vars);
      if (data && data.lists && data.lists.length > 0) {
        // ^ We filter out the Planning list
        for (const MediaList of data.lists.filter((MediaList) => MediaList!.name != "Planning")) {
          if (MediaList && MediaList.entries) MediaList.entries.map((e) => excludeIDs.push(e!.media!.id));
        }
        if (!genres.length) return void interaction.reply({ embeds: [embedError(`Please specify at least one genre.`, null, '', false)] });

        const genresArray = genres.split(",").map((genre) => genre.trim());
        const recommendationVars = { type, exclude_ids: excludeIDs, genresArray };

        try {
          const {
            data: { Page: data },
          } = await graphQLRequest("Recommendations", recommendationVars);
          if (data && data.media) {
            // ^ Filter out the Planning list
            const recommendations = data.media.filter((Media) => Media!.title);
            const random = Math.floor(Math.random() * Math.floor(recommendations.length));
            const recommendedSeries = recommendations[random];
            if (!recommendedSeries) return void interaction.reply({ embeds: [embedError(`Couldn't find any data.`, recommendationVars)] });

            switch (type) {
              case "ANIME":
                AnimeCmd.run({ interaction, client, hook: true, hookdata: { title: SeriesTitle(recommendedSeries.title || undefined) } });
                break;
              case "MANGA":
                MangaCmd.run({ interaction, client, hook: true, hookdata: { title: SeriesTitle(recommendedSeries.title || undefined) } });
                break;
            }
          } else {
            return void interaction.reply({ embeds: [embedError(`Couldn't find any data.`, recommendationVars)] });
          }
        } catch (e: any) {
          console.error(e);
          interaction.reply({ embeds: [embedError(e, vars)] });
        }
      } else {
        return void interaction.reply({ embeds: [embedError(`Couldn't find any data from the user specified. (Which was "${vars.userName}")`, null, '', false)] });
      }
    } catch (e: any) {
      console.error(e);
      interaction.reply({ embeds: [embedError(e, vars)] });
    }
  },
} satisfies Command;
