import { graphQLRequest, getOptions, handleData, normalize, type CacheEntry, YuukoError } from "#utils/index";
import { SlashCommandBuilder } from "discord.js";
import { redis } from "#caching/redis";
import type { AnimeQuery, AnimeQueryVariables } from "#graphQL/types";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { CommandWithHook } from "#structures/index";

const name = "anime";
const usage = "anime <title>";
const description = "Gets an anime from anilist based on a search result.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  run: async ({ interaction, client, hook = false, hookdata = null }): Promise<void> => {
    const { query } = getOptions<{ query: string }>(interaction.options, ["query"]);
    let normalizedQuery = "";
    if (query) normalizedQuery = normalize(query);

    let animeIdFound = false;

    const vars: AnimeQueryVariables = {};
    if (!hook) {
      if (query.length < 3) throw new YuukoError("Query must be at least 3 characters long.");
      vars.query = query;
    } else if (hook && hookdata) {
      if (hookdata.id) {
        client.log(`Hookdata Anime ID: ${hookdata.id}`, "debug");
        vars.aID = hookdata.id;
      } else if (hookdata.title) {
        vars.query = hookdata.title;
        normalizedQuery = normalize(hookdata.title);
      }
    } else throw new YuukoError("AnimeCmd was hooked, yet there was no title or ID provided in hookdata.");

    client.log(`Anime ID: ${vars.aID}`, "debug");

    if (!vars.aID) {
      const cachedId = await redis.get(`_animeId-${normalizedQuery}`);
      if (cachedId) {
        animeIdFound = true;
        vars.aID = parseInt(cachedId);
        client.log(`Found cached ID for ${normalizedQuery} : ${vars.aID}`, "debug");
        client.log(`Querying for ${normalizedQuery} with ID ${vars.aID}`, "debug");
      }
    }

    client.log(`Querying Redis with hook animeId ${vars.aID}`, "debug");
    const cacheData = (await redis.json.get(`_anime-${vars.aID}`)) as AnimeQuery["Media"] | null;

    if (cacheData) {
      if (interaction.alID) {
        const _mediaListEntry = (await redis.json.get(`_user${interaction.alID}-ANIME`)) as Record<number, CacheEntry>;
        if (!vars.aID) throw new YuukoError("No anime ID found");
        const mediaListEntry = _mediaListEntry ? _mediaListEntry[vars.aID] : null;

        if (mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
      }
      client.log("Found cache data, returning data...", "debug");
      return void handleData({ media: cacheData }, interaction, "ANIME");
    }
    client.log("No cache found, fetching from CringeQL", "debug");
    const {
      data: { Media: data },
      headers,
    } = await graphQLRequest("Anime", vars, interaction.ALtoken);

    if (!data) {
      throw new YuukoError("No anime found.", vars);
    }

    if (!animeIdFound) redis.set(`_animeId-${normalizedQuery}`, data.id);
    const { mediaListEntry, ...redisData } = data;
    redis.json.set(`_anime-${redisData.id}`, "$", redisData);
    redis.expireAt(`_anime-${redisData.id}`, new Date(Date.now() + 604800000));
    for (const synonym of redisData.synonyms || []) {
      if (!synonym) continue;
      redis.set(`_animeId-${normalize(synonym)}`, data.id);
    }
    if (redisData.nextAiringEpisode?.airingAt) {
      client.log(`Expiring anime-${redisData.id} at ${redisData.nextAiringEpisode.airingAt}`, "debug");
      redis.expireAt(`_anime-${data.id}`, redisData.nextAiringEpisode.airingAt);
    }
    return void await handleData({ media: data, headers: headers }, interaction, "ANIME", hookdata);
  },
} satisfies CommandWithHook;
