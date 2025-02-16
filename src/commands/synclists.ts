import { SlashCommandBuilder } from "discord.js";
import { redis } from "#caching/redis";
import { MediaType, type GetMediaCollectionQuery } from "#graphQL/types";
import { mwRequireALToken } from "#middleware/alToken";
import type { Command } from "#structures/index";
import { db } from "#database/db";
import { normalize, graphQLRequest, getSubcommand, type AlwaysExist, type CacheEntry, type GraphQLResponse, YuukoError } from "#utils/index";
import { eq } from "drizzle-orm";
import { mediaStats, mediaStatUsers } from "#database/models";

const name = "synclists";
const usage = "/synclists";
const description = "Syncs your AniList lists with our bot, allowing for quick access to your lists!";
const cooldown = 60; // 1 minutes in seconds;

export default {
  name,
  usage,
  description,
  cooldown,
  middlewares: [mwRequireALToken],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommand((subcommand) => subcommand.setName("sync").setDescription("Sync your lists with our bot."))
    .addSubcommand((subcommand) => subcommand.setName("wipe").setDescription("Wipe your lists from our bot. (This will not wipe your AniList lists.)")),
  run: async ({ interaction, client }): Promise<void> => {
    const subcommand = getSubcommand<["sync", "wipe"]>(interaction.options);

    if (subcommand === "wipe") {
      interaction.editReply(`Wiping your lists from DB...`);
      redis.del(await redis.keys(`_user${interaction.alID}-*`))

      await db.delete(mediaStatUsers).where(eq(mediaStatUsers.anilistId, interaction.alID!));

      return void interaction.editReply(`Successfully wiped your lists from our DB!`);
    } else if (subcommand === "sync") {
      interaction.editReply(`Syncing your lists...`);
      const { data: animeData } = await graphQLRequest("GetMediaCollection", {
        userId: interaction.alID,
        type: MediaType.Anime,
      }, interaction.ALtoken);

      if (animeData) await handleSyncing({ media: animeData }, interaction.alID!, MediaType.Anime);

      const { data: mangaData } = await graphQLRequest("GetMediaCollection", {
        userId: interaction.alID,
        type: MediaType.Manga,
      }, interaction.ALtoken);

      if (mangaData) await handleSyncing({ media: mangaData }, interaction.alID!, MediaType.Manga);

      const commandCooldown = client.cooldowns.get(name);
      if (commandCooldown) commandCooldown.set(interaction.user.id, Date.now() + cooldown * 1000);

      return void interaction.editReply(`Successfully synced your lists!`);
    }
  },
} satisfies Command;

export async function handleSyncing(
  data: {
    media: AlwaysExist<GetMediaCollectionQuery>;
    headers?: GraphQLResponse["headers"];
  },
  alID: number,
  type: MediaType,
) {

  const lists = data.media.MediaListCollection?.lists;
  const user = data.media.MediaListCollection?.user;
  const bulkMedia = new Set<{ mediaId: number, type: MediaType }>();
  if (!lists || !user) throw new YuukoError("You have no lists!");

  for (const list of lists) {
    if (!list) continue;
    const entries = list.entries;
    if (!entries) continue;

    // for bulk inserting into DB
    for (const entry of entries) {
      if (!entry || !entry.media || !entry.media.id) continue;
      const cacheEntry: CacheEntry = {
        user: {
          name: user.name,
          id: alID,
          mediaListOptions: user.mediaListOptions,
        },
        status: entry.status,
        progress: entry.progress,
        score: entry.score,
        notes: entry.notes,
      };

      bulkMedia.add({ mediaId: entry.media.id, type });
      redis.json.set(`_user${user.id}-${entry.media.id}`, "$", cacheEntry);
      // should be all we need, but then we need to also update the wipe part

      if (entry.media) {
        const redisData = entry.media;
        if (type === MediaType.Anime) {
          delete redisData.chapters;
          delete redisData.volumes;

          redis.json.set(`_anime-${redisData.id}`, "$", redisData);
          redis.expireAt(`_anime-${redisData.id}`, new Date(Date.now() + 604800000));
          for (const synonym of redisData.synonyms || []) {
            if (!synonym) continue;
            redis.set(`_animeId-${normalize(synonym)}`, redisData.id);
          }
          if (redisData.nextAiringEpisode?.airingAt) {
            redis.expireAt(`_anime-${redisData.id}`, redisData.nextAiringEpisode.airingAt);
          }

        } else if (type === MediaType.Manga) {
          delete redisData.episodes;
          delete redisData.duration;
          delete redisData.nextAiringEpisode;

          redis.json.set(`_manga-${redisData.id}`, "$", redisData);
          redis.expireAt(`_manga-${redisData.id}`, new Date(Date.now() + 604800000))
          for (const synonym of redisData.synonyms || []) {
            if (!synonym) continue;
            redis.set(`_mangaId-${normalize(synonym)}`, redisData.id);
          }

        }
      }
    }
  }

  const mediasArray = Array.from(bulkMedia);
  // bulk insert media_id, do nothing if exists already
  await db
    .insert(mediaStats)
    .values(mediasArray)
    .onConflictDoNothing();

  const userFromMedias = mediasArray.map((m) => ({ mediaId: m.mediaId, anilistId: alID }));
  // bulk insert user into given media(s)
  await db
    .insert(mediaStatUsers)
    .values(userFromMedias)
    .onConflictDoNothing();
}
