import { SlashCommandBuilder } from "discord.js";
import { redis } from "#caching/redis";
import type { MangaQuery } from "#graphQL/types";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { CommandWithHook } from "#structures/index";
import { graphQLRequest, getOptions, handleData, normalize, type CacheEntry, YuukoError } from "#utils/index";

const name = "manga";
const usage = "manga <title>";
const description = "Gets an manga from anilist based on a search result.";

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

    const { query: manga } = getOptions<{ query: string }>(interaction.options, ["query"]);
    let normalizedQuery = "";
    if (manga) normalizedQuery = normalize(manga);

    const vars: Partial<{
      query: string;
      mID: number;
    }> = {};

    let mangaIdFound = false;

    if (!hook) {
      if (manga.length < 3) throw new YuukoError("Please enter a search query of at least 3 characters.");
      vars.query = manga;
    } else if (hook && hookdata) {
      if (hookdata.title) {
        vars.query = hookdata.title;
        normalizedQuery = normalize(hookdata.title);
      }
    } else throw new YuukoError("MangaCmd was hooked, yet there was no title or ID provided in hookdata.");

    if (!vars.mID) {
      const mangaId = await redis.get(`_mangaId-${normalizedQuery}`);
      if (mangaId) {
        mangaIdFound = true;
        vars.mID = parseInt(mangaId);
        client.log(`[MangaCmd] Found cached ID for ${normalizedQuery} : ${vars.mID}`, "Debug");
        client.log(`[MangaCmd] Querying for ${normalizedQuery} with ID ${vars.mID}`, "Debug");
      }
    }

    const cacheData = await redis.json.get(`_manga-${vars.mID}`) as MangaQuery["Media"] | null;

    if (cacheData) {
      if (interaction.alID) {
        const _mediaListEntry = await redis.json.get(`_user${interaction.alID}-MANGA`) as Record<number, CacheEntry>;
        if (!vars.mID) throw new YuukoError("No mID found in cache data.", vars);
        const mediaListEntry = _mediaListEntry ? _mediaListEntry[vars.mID] : null;
        if (mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
      }
      client.log("[MangaCmd] Found cache data, returning data...", "Debug");
      return void handleData({ media: cacheData }, interaction, "MANGA");
    }

    client.log("[MangaCmd] No cache found, fetching from CringeQL", "Debug");

    const {
      data: { Media: data },
      headers,
    } = await graphQLRequest("Manga", vars, interaction.ALtoken);

    if (!data) {
      throw new YuukoError("Couldn't find any data.", vars);
    }

    if (!mangaIdFound) redis.set(`_mangaId-${normalizedQuery}`, data.id);
    const { mediaListEntry, ...redisData } = data;
    redis.json.set(`_manga-${data.id}`, "$", redisData);
    redis.expireAt(`_manga-${redisData.id}`, new Date(Date.now() + 604800000))
    for (const synonym of redisData.synonyms || []) {
      if (!synonym) continue;
      redis.set(`_mangaId-${normalize(synonym)}`, data.id.toString());
    }
    return void handleData({ media: data, headers: headers }, interaction, "MANGA", hookdata);
  },
} satisfies CommandWithHook;
