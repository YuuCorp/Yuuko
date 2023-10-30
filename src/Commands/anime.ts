import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { redis } from "../Caching/redis";
import type { AnimeQuery } from "../GraphQL/types";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook, HookData, UsableInteraction } from "../Structures";
import { normalize, BuildPagination, EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions, type AlwaysExist, type GraphQLResponse } from "../Utils";

const name = "anime";
const usage = "anime <title>";
const description = "Gets an anime from anilist based on a search result.";

export default {
  name,
  usage,
  description,
  middlewares: [mwOptionalALToken],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  run: async ({ interaction, client, hook = false, hookdata = null }): Promise<void> => {
    if (!interaction.isCommand()) return;
    const { query } = getOptions<{ query: string }>(interaction.options, ["query"]);
    let normalizedQuery = "";
    if (query) normalizedQuery = normalize(query);

    let animeIdFound = false;

    const vars: Partial<{
      query: string;
      aID: number;
    }> = {};
    if (!hook) {
      if (query.length < 3) return void interaction.editReply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });
      vars.query = query;
    } else if (hook && hookdata) {
      if (hookdata.id) {
        console.log(`[AnimeCmd] Hookdata Anime ID: ${hookdata.id}`);
        vars.aID = hookdata.id;
      } else if (hookdata.title) {
        vars.query = hookdata.title;
        normalizedQuery = normalize(hookdata.title);
      }
    } else return void interaction.editReply({ embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });

    console.log(`[AnimeCmd] Anime ID: ${vars.aID}`);

    if (!vars.aID) {
      const cachedId = await redis.get<string>(`_animeId-${normalizedQuery}`);
      if (cachedId) {
        animeIdFound = true;
        vars.aID = parseInt(cachedId);
        console.log(`[AnimeCmd] Found cached ID for ${normalizedQuery} : ${vars.aID}`);
        console.log(`[AnimeCmd] Querying for ${normalizedQuery} with ID ${vars.aID}`);
      }
    }

    console.log(`[AnimeCmd] Querying Redis with hook animeId ${vars.aID}`);
    const cacheData = await redis.json.get(`_anime-${vars.aID}`);

    if (cacheData) {
       if(interaction.alID) {
          const mediaListEntry = await redis.json.get(`_user${interaction.alID}-${vars.aID}`); 
          if(mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
       }
      console.log("[AnimeCmd] Found cache data, returning data...");
      return void handleData({ anime: cacheData }, interaction);
    }
    console.log("[AnimeCmd] No cache found, fetching from CringeQL");
    try {
      const {
        data: { Media: data },
        headers,
      } = await GraphQLRequest("Anime", vars, interaction.ALtoken);
      if (data) {
        if (!animeIdFound) redis.set(`_animeId-${normalizedQuery}`, data.id);
        const { mediaListEntry, ...redisData } = data;
        redis.json.set(`_anime-${redisData.id}`, "$", redisData);
        for (const synonym of redisData.synonyms || []) {
          if (!synonym) continue;
          redis.set(`_animeId-${normalize(synonym)}`, data.id);
        }
        if (redisData.nextAiringEpisode?.airingAt) {
          console.log(`[AnimeCmd] Expiring anime-${redisData.id} at ${redisData.nextAiringEpisode.airingAt}`);
          redis.expireat(`_anime-${data.id}`, redisData.nextAiringEpisode.airingAt);
        }
        if(mediaListEntry)
          redis.json.set(`_user${mediaListEntry.user?.id}-${redisData.id}`, "$", mediaListEntry);
        return void handleData({ anime: data, headers: headers }, interaction, hookdata);
      } else {
        return void interaction.editReply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
      }
    } catch (e: any) {
      console.error(e);
      interaction.editReply({ embeds: [EmbedError(e, vars)] });
    }
  },
} satisfies CommandWithHook;

function handleData(
  data: {
    anime: AlwaysExist<AnimeQuery["Media"]>;
    headers?: GraphQLResponse["headers"];
  },
  interaction: UsableInteraction,
  hookdata?: HookData | null,
) {
  const { anime, headers } = data;
  // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
  const descLength = 350;
  const endDate = anime?.endDate?.year ? `${anime.endDate.day}-${anime.endDate.month}-${anime.endDate.year}` : "Unknown";
  const description =
    anime.description
      ?.replace(/<br><br>/g, "\n")
      .replace(/<br>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n\n/g, "\n") || "No description available.";
  const firstPage = new EmbedBuilder()
    .setImage(anime.bannerImage!)
    .setThumbnail(anime.coverImage?.large!)
    .setTitle(anime.title ? SeriesTitle(anime.title) : "Unknown")
    .addFields(
      {
        name: "Episodes",
        value: anime.episodes?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Format",
        value: anime.format || "Unknown",
        inline: true,
      },
      {
        name: "Mean Score",
        value: anime.meanScore?.toString() == "undefined" ? anime.meanScore?.toString() : "Unknown",
        inline: true,
      },
      {
        name: "Start Date",
        value: anime.startDate?.day ? `${anime.startDate.day}-${anime.startDate.month}-${anime.startDate.year}` : "Unknown",
        inline: true,
      },
      {
        name: "End Date",
        value: anime.endDate?.day ? `${anime.endDate.day}-${anime.endDate.month}-${anime.endDate.year}` : "Unknown",
        inline: true,
      },
      {
        // ^ Check if the anime has finished airing
        name: anime.nextAiringEpisode?.episode ? `Episode ${anime.nextAiringEpisode.episode} airing in:` : "Completed on:",
        value: anime.nextAiringEpisode?.airingAt ? `<t:${anime.nextAiringEpisode.airingAt}:R>` : endDate,
        inline: true,
      },
      {
        name: "Genres",
        value: "``" + `${anime.genres?.join(", ") || "N/A"}` + "``",
        inline: true,
      },
    )
    .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
    .setURL(anime.siteUrl?.toString() || "https://anilist.co/")
    .setColor("Green")
    .setFooter(Footer(headers));

  const secondPage = new EmbedBuilder()
    .setAuthor({ name: `${anime.title?.english || "N/A"} | Additional info` })
    // .setThumbnail(anime.coverImage.large)

    .addFields(
      {
        name: "Source",
        value: anime.source || "Unknown",
        inline: true,
      },
      {
        name: "Episode Duration",
        value: anime.duration?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Media ID",
        value: anime.id?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Synonyms",
        value: "``" + `${anime.synonyms?.join(", ") || "N/A"}` + "``",
        inline: false,
      },
    )
    .setColor("Green")
    .setFooter(Footer(headers));

  if (anime.coverImage?.large) secondPage.setThumbnail(anime.coverImage.large);

  if (hookdata?.image) firstPage.setImage(hookdata.image);

  if (hookdata?.fields) for (const field of hookdata.fields) firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });

  if (anime.mediaListEntry) {
    let score = "Unknown";
    const scoring = anime.mediaListEntry?.user?.mediaListOptions?.scoreFormat;
    if (anime.mediaListEntry.score) {
      score = anime.mediaListEntry.score.toString();
      if (scoring === ("POINT_10_DECIMAL" || "POINT_10")) score = `${score} / 10`;
      else if (scoring === ("POINT_100" || "POINT_5")) score = `${score} / ${scoring.split("POINT_")[1]}`;
      else if (scoring === "POINT_3") score = score === "1" ? "☹️" : score === "2" ? "😐" : "🙂";
    }

    const thirdPage = new EmbedBuilder()
      .setAuthor({ name: `${anime.title?.english || "N/A"} | ${anime.mediaListEntry?.user?.name}'s Stats` })

      .addFields(
        {
          name: "Status",
          value: anime.mediaListEntry?.status?.toString() || "Unknown",
          inline: true,
        },
        {
          name: "Progress",
          value: anime.episodes ? `${anime.mediaListEntry?.progress} episode(s) out of ${anime.episodes}` : `${anime.mediaListEntry?.progress} episode(s)` || "Unknown",
          inline: true,
        },
        {
          name: "Score",
          value: score,
          inline: true,
        },
        {
          name: "Notes",
          value: anime.mediaListEntry?.notes || "No Notes Found",
        },
      )
      .setColor("Green")
      .setFooter(Footer(headers));

    if (anime.coverImage?.large) thirdPage.setThumbnail(anime.coverImage.large);
    const pageList = [firstPage, secondPage, thirdPage];
    BuildPagination(interaction, pageList).paginate();
    return;
  }

  const pageList = [firstPage, secondPage];
  BuildPagination(interaction, pageList).paginate();
}
