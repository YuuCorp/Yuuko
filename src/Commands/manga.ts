import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { redis } from "../Caching/redis";
import type { MangaQuery } from "../GraphQL/types";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook, HookData, UsableInteraction } from "../Structures";
import { handleData, BuildPagination, EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions, normalize, type AlwaysExist, type CacheEntry, type GraphQLResponse } from "../Utils";

const name = "manga";
const usage = "manga <title>";
const description = "Gets an manga from anilist based on a search result.";

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

    const { query: manga } = getOptions<{ query: string }>(interaction.options, ["query"]);
    let normalizedQuery = "";
    if (manga) normalizedQuery = normalize(manga);

    const vars: Partial<{
      query: string;
      mID: number;
    }> = {};

    let mangaIdFound = false;

    if (!hook) {
      if (manga.length < 3) return void interaction.editReply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null,'', false)] });
      vars.query = manga;
    } else if (hook && hookdata) {
      if (hookdata.title) {
        vars.query = hookdata.title;
        normalizedQuery = normalize(hookdata.title);
      }
    } else return void interaction.editReply({ embeds: [EmbedError(`MangaCmd was hooked, yet there was no title or ID provided in hookdata.`, null,'', false)] });

    if (!vars.mID) {
      const mangaId = await redis.get(`_mangaId-${normalizedQuery}`);
      if (mangaId) {
        mangaIdFound = true;
        vars.mID = parseInt(mangaId);
        console.log(`[MangaCmd] Found cached ID for ${normalizedQuery} : ${vars.mID}`);
        console.log(`[MangaCmd] Querying for ${normalizedQuery} with ID ${vars.mID}`);
      }
    }

    const cacheData = await redis.json.get(`_manga-${vars.mID}`) as MangaQuery["Media"] | null;

    if (cacheData) {
      if(interaction.alID) {
        const _mediaListEntry = await redis.json.get(`_user${interaction.alID}-MANGA`) as Record<number, CacheEntry>; 
        if(!vars.mID) return void interaction.editReply({ embeds: [EmbedError(`Something went wrong while fetching your list entry.`, vars)] });
        const mediaListEntry = _mediaListEntry ? _mediaListEntry[vars.mID] : null;
        if(mediaListEntry) cacheData.mediaListEntry = mediaListEntry;
     }
      console.log("[MangaCmd] Found cache data, returning data...");
      return void handleData({ media: cacheData }, interaction, "manga");
    }

    console.log("[MangaCmd] No cache found, fetching from CringeQL");
    try {
      const {
        data: { Media: data },
        headers,
      } = await GraphQLRequest("Manga", vars, interaction.ALtoken);
      if (data) {
        if (!mangaIdFound) redis.set(`_mangaId-${normalizedQuery}`, data.id);
        const { mediaListEntry, ...redisData } = data;
        redis.json.set(`_manga-${data.id}`, "$", redisData);
        for(const synonym of redisData.synonyms || []) {
          if(!synonym) continue;
          redis.set(`_mangaId-${normalize(synonym)}`, data.id.toString());
        }
        return void handleData({ media: data, headers: headers }, interaction, "manga", hookdata);
      } else {
        return void interaction.editReply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
      }
    } catch (e: any) {
      console.error(e);
      return void interaction.editReply({ embeds: [EmbedError(e, vars)] });
    }
  },
} satisfies CommandWithHook;