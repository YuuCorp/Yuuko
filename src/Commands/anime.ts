import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { redis } from "../Caching/redis";
import type { AnimeQuery } from "../GraphQL/types";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook, HookData, UsableInteraction } from "../Structures";
import { handleData, normalize, BuildPagination, EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions, type AlwaysExist, type GraphQLResponse, type CacheEntry } from "../Utils";

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
      if (query.length < 3) return void interaction.editReply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null,'', false)] });
      vars.query = query;
    } else if (hook && hookdata) {
      if (hookdata.id) {
        console.log(`[AnimeCmd] Hookdata Anime ID: ${hookdata.id}`);
        vars.aID = hookdata.id;
      } else if (hookdata.title) {
        vars.query = hookdata.title;
        normalizedQuery = normalize(hookdata.title);
      }
    } else return void interaction.editReply({ embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null,'', false)] });

    console.log(`[AnimeCmd] Anime ID: ${vars.aID}`);

    if (!vars.aID) {
      const cachedId = await redis.get(`_animeId-${normalizedQuery}`);
      if (cachedId) {
        animeIdFound = true;
        vars.aID = parseInt(cachedId);
        console.log(`[AnimeCmd] Found cached ID for ${normalizedQuery} : ${vars.aID}`);
        console.log(`[AnimeCmd] Querying for ${normalizedQuery} with ID ${vars.aID}`);
      }
    }

    console.log(`[AnimeCmd] Querying Redis with hook animeId ${vars.aID}`);
    const cacheData = (await redis.json.get(`_anime-${vars.aID}`)) as AnimeQuery["Media"] | null; // jfc

    if (cacheData) {
      if (interaction.alID) {
        const _mediaListEntry = (await redis.json.get(`_user${interaction.alID}-ANIME`)) as Record<number, CacheEntry>
        if(!vars.aID) throw new Error("No anime ID found");
        const mediaListEntry = _mediaListEntry ? _mediaListEntry[vars.aID] : null;

        if (mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
      }
      console.log("[AnimeCmd] Found cache data, returning data...");
      return void handleData({ media: cacheData }, interaction, "anime");
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
          redis.expireAt(`_anime-${data.id}`, redisData.nextAiringEpisode.airingAt);
        }
        return void handleData({ media: data, headers: headers }, interaction, "anime", hookdata);
      } else {
        return void interaction.editReply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
      }
    } catch (e: any) {
      console.error(e);
      interaction.editReply({ embeds: [EmbedError(e, vars)] });
    }
  },
} satisfies CommandWithHook;