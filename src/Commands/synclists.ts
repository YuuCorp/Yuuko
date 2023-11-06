import { SlashCommandBuilder } from "discord.js";
import { redis } from "../Caching/redis";
import { MediaType, type GetMediaCollectionQuery } from "../GraphQL/types";
import { mwRequireALToken } from "../Middleware/ALToken";
import type { Command, UsableInteraction } from "../Structures";
import { stat, statTables, type StatUser } from "../Database/db";
import { EmbedError, GraphQLRequest, getSubcommand, type AlwaysExist, type CacheEntry, type GraphQLResponse } from "../Utils";
import { eq } from "drizzle-orm";

const name = "synclists";
const usage = "/synclists";
const description = "Syncs your AniList lists with our bot, allowing for quick access to your lists!";
const cooldown = 0; // 2 hours in seconds;

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
    if (!interaction.isCommand()) return;
    const subcommand = getSubcommand<["sync", "wipe"]>(interaction.options);

    if (subcommand === "wipe") {
      interaction.editReply(`Wiping your lists...`);
      try {
        (await redis.json.get(`_user${interaction.alID}-${MediaType.Anime}`)) as Record<number, CacheEntry>;

        redis.del(`_user${interaction.alID}-${MediaType.Anime}`);
        redis.del(`_user${interaction.alID}-${MediaType.Manga}`);

        const animeMediaIDs = await getMediaForUser(statTables.AnimeStats, interaction.alID!);
        const mangaMediaIDs = await getMediaForUser(statTables.AnimeStats, interaction.alID!);

        if (animeMediaIDs.length == 0 && mangaMediaIDs.length == 0) return void interaction.editReply(`You don't have any data synced with our bot!`);

        await removeUserFromMedia(statTables.AnimeStats, animeMediaIDs, { aId: interaction.alID!, dId: interaction.user.id });
        await removeUserFromMedia(statTables.AnimeStats, mangaMediaIDs, { aId: interaction.alID!, dId: interaction.user.id });
        
        return void interaction.editReply(`Successfully wiped your lists!`);
      } catch (e: any) {
        console.error(e);
        return void interaction.editReply({ embeds: [EmbedError(e)] });
      }
    } else if (subcommand === "sync") {
      interaction.editReply(`Syncing your lists...`);
      try {
        const { data: animeData } = await GraphQLRequest("GetMediaCollection", {
          userId: interaction.alID,
          type: MediaType.Anime,
        });
        if (animeData) handleData({ media: animeData }, interaction, MediaType.Anime);

        const { data: mangaData } = await GraphQLRequest("GetMediaCollection", {
          userId: interaction.alID,
          type: MediaType.Manga,
        });

        if (mangaData) handleData({ media: mangaData }, interaction, MediaType.Manga);

        const commandCooldown = client.cooldowns.get(name);
        if (commandCooldown) commandCooldown.set(interaction.user.id, Date.now() + cooldown * 1000);

        return void interaction.editReply(`Successfully synced your lists!`);
      } catch (e: any) {
        console.error(e);
        return void interaction.editReply({ embeds: [EmbedError(e)] });
      }
    }
  },
} satisfies Command;

async function handleData(
  data: {
    media: AlwaysExist<GetMediaCollectionQuery>;
    headers?: GraphQLResponse["headers"];
  },
  interaction: UsableInteraction,
  type: MediaType,
) {
  if (!interaction.isCommand()) return;
  if (!interaction.alID) return;

  const dataToGiveToRedis: Record<number, CacheEntry> = {};

  const lists = data.media.MediaListCollection?.lists;
  const user = data.media.MediaListCollection?.user;
  if (!lists || !user) return interaction.editReply(`You have no lists!`);
  for (const list of lists) {
    if (!list) continue;
    const entries = list.entries;
    if (!entries) continue;

    for (const entry of entries) {
      if (!entry || !entry.media || !entry.media.id) continue;
      if (dataToGiveToRedis[entry.media.id]) continue;
      const cacheEntry: CacheEntry = {
        user: {
          name: user.name,
          id: interaction.alID,
          mediaListOptions: user.mediaListOptions,
        },
        status: entry.status,
        progress: entry.progress,
        score: entry.score,
        notes: entry.notes,
      };

      if (type === MediaType.Anime) await getAndInsertOrUpdate(statTables.AnimeStats, entry.media.id, { aId: interaction.alID, dId: interaction.user.id });
      else if (type === MediaType.Manga) await getAndInsertOrUpdate(statTables.MangaStats, entry.media.id, { aId: interaction.alID, dId: interaction.user.id });

      dataToGiveToRedis[entry.media.id] = cacheEntry;
    }
  }
  redis.json.set(`_user${interaction.alID}-${type}`, "$", dataToGiveToRedis);
}

type TableType = typeof statTables.AnimeStats | typeof statTables.MangaStats;

function keepUnique(oldIds: StatUser[], newId: StatUser) {
  const ids = oldIds.map((id) => id.dId);
  if (ids.includes(newId.dId)) return oldIds;
  return [...oldIds, newId];
}

async function getAndInsertOrUpdate(table: TableType, mediaId: number, user: StatUser) {
  const stats = (await stat.select().from(table).where(eq(table.mediaId, mediaId)).limit(1))[0];
  if (stats) {
    await stat
      .update(table)
      .set({
        users: keepUnique(stats.users, user),
      })
      .where(eq(table.mediaId, mediaId));
    return;
  }
  await stat.insert(table).values({
    mediaId: mediaId,
    users: keepUnique([], user),
  });
}

async function removeUserFromMedia(table: TableType, mediaIds: number[], user: StatUser) {
  for (const mediaId of mediaIds) {
    const stats = (await stat.select().from(table).where(eq(table.mediaId, mediaId)).limit(1))[0];
    if (stats) {
      const newUsers = stats.users.filter((u) => u.dId !== user.dId);
      if (newUsers.length === 0) {
        await stat.delete(table).where(eq(table.mediaId, mediaId));
      } else {
        await stat.update(table).set({ users: newUsers }).where(eq(table.mediaId, mediaId));
      }
    }
  }
}

async function getMediaForUser(table: TableType, aId: number): Promise<number[]> {
  const mediaEntries = await stat.select().from(table);
  const mediaForUser = mediaEntries.filter((entry) => entry.users.some((user) => user.aId === aId));
  return mediaForUser.map((entry) => entry.mediaId);
}
