import { SlashCommandBuilder } from "discord.js";
import { redis } from "#caching/redis";
import type { MangaQuery } from "#graphQL/types";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { Command } from "#structures/index";
import { graphQLRequest, handleData, normalize, type CacheEntry, YuukoError, getStringOption } from "#utils/index";

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
    .addStringOption((option) => option.setName("manga").setDescription("The manga to search for").setRequired(true)),

  run: async ({ interaction, client }, hookData): Promise<void> => {

    const vars: Partial<{
      query: string;
      mID: number;
    }> = {};
    let mangaIdFound = false;

    if (!hookData?.id) {
      const query = getStringOption(interaction, hookData, "manga", true);
      if (!query || query.length < 3) throw new YuukoError("Query must be at least 3 characters long.");
      const normalizedQuery = normalize(query);
      vars.query = normalizedQuery;

      const cachedId = await redis.get(`_mangaId-${normalizedQuery}`);
      if (cachedId) {
        mangaIdFound = true;
        vars.mID = parseInt(cachedId);
        client.logger.debug("Series cache hit", { query: normalizedQuery, seriesId: vars.mID, type: "generic", mediaType: "MANGA" })
      }

    } else {
      vars.mID = hookData.id;
    }

    const cacheData = await redis.json.get(`_manga-${vars.mID}`) as MangaQuery["Media"] | null;

    if (cacheData) {
      if (interaction.aniListId) {
        const _mediaListEntry = await redis.json.get(`_user${interaction.aniListId}-MANGA`) as Record<number, CacheEntry>;
        if (!vars.mID) throw new YuukoError("No mID found in cache data.", { vars });
        const mediaListEntry = _mediaListEntry ? _mediaListEntry[vars.mID] : null;
        if (mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
      }

      client.logger.debug("User cache hit", { seriesId: vars.mID, aniListId: interaction.aniListId, type: "generic" })

      return void handleData({ media: cacheData }, interaction, client, "MANGA");
    }

    const {
      data: { Media: data },
      headers,
    } = await graphQLRequest("Manga", vars, interaction.aniListToken);

    if (!data) {
      throw new YuukoError("Couldn't find any data.", { vars });
    }

    if (!mangaIdFound) redis.set(`_mangaId-${vars.query}`, data.id);

    const { mediaListEntry, ...redisData } = data;
    redis.json.set(`_manga-${data.id}`, "$", redisData);
    redis.expireAt(`_manga-${redisData.id}`, new Date(Date.now() + 604800000))

    for (const synonym of redisData.synonyms || []) {
      if (!synonym) continue;
      redis.set(`_mangaId-${normalize(synonym)}`, data.id.toString());
    }

    return void handleData({ media: data, headers: headers }, interaction, client, "MANGA", hookData);
  },
} satisfies Command<{ id?: number, manga?: string }>;
