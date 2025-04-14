import MangaCmd from "#commands/manga";
import AnimeCmd from "#commands/anime";
import { graphQLRequest, SeriesTitle, getOptions, YuukoError } from "#utils/index";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
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
    interaction.deferReply();

    const { type } = getOptions<{ type: MediaType }>(interaction.options, ["type"]);
    const { anilist_user: anilistUser } = getOptions<{ anilist_user: string }>(interaction.options, ["anilist_user"]);
    const { genres } = getOptions<{ genres: string }>(interaction.options, ["genres"]);

    const vars = { type, userName: anilistUser };

    if (type != "ANIME" && type != "MANGA") throw new YuukoError(`Please specify either manga, or anime as your content type. (Yours was "${type}")`);

    const excludeIDs: number[] = [];

    // ^ First we query the user to find what ID-s we should exclude from the search pool.
    const {
      data: { MediaListCollection: data },
    } = await graphQLRequest("GetMediaCollection", vars);

    if (!data || !data.lists || data.lists.length < 1) throw new YuukoError("Couldn't find any data from the user specified.", vars);

    // ^ We filter out the Planning list
    for (const mediaList of data.lists) {
      if (!mediaList || !mediaList.entries || mediaList.name === "Planning") continue;
      mediaList.entries.forEach((e) => excludeIDs.push(e!.media!.id));
    }

    if (!genres.length) throw new YuukoError("Please specify at least one genre.");

    const genresArray = genres.split(",").map((genre) => genre.trim());
    const recommendationVars = { type, exclude_ids: excludeIDs, genresArray };

    const {
      data: { Page: recommendationData },
    } = await graphQLRequest("Recommendations", recommendationVars);

    if (!recommendationData || !recommendationData.media) {
      throw new YuukoError("Couldn't find any data.", recommendationVars);
    }

    const recommendations = recommendationData.media.filter((Media) => Media);
    const random = Math.floor(Math.random() * recommendations.length);
    const recommendedSeries = recommendations[random];
    if (!recommendedSeries) throw new YuukoError("Couldn't find any data.", recommendationVars);

    switch (type) {
      case "ANIME":
        AnimeCmd.run({ interaction, client, hook: true, hookdata: { id: recommendedSeries.id } });
        break;
      case "MANGA":
        MangaCmd.run({ interaction, client, hook: true, hookdata: { id: recommendedSeries.id } });
        break;
    }
  },
} satisfies Command;
