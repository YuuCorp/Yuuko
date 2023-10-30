import { GraphQLRequest, type AlwaysExist, type GraphQLResponse, type Media, type CacheEntry, EmbedError, getSubcommand } from "../Utils";
import { MediaType, type GetMediaCollectionQuery } from "../GraphQL/types";
import type { Command, UsableInteraction } from "../Structures";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwRequireALToken } from "../Middleware/ALToken";
import { redis } from "../Caching/redis";

const name = "synclists";
const usage = "/synclists";
const description = "Syncs your AniList lists with our bot, allowing for quick access to your lists!";
const cooldown = 7200; // 2 hours in seconds;

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
        const dbExists = redis.exists(`_user${interaction.alID}-${MediaType.Anime}`);
        if (!dbExists) return void interaction.editReply(`You have not synced your lists!`);
        redis.del(`_user${interaction.alID}-${MediaType.Anime}`);
        redis.del(`_user${interaction.alID}-${MediaType.Manga}`);
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

function handleData(
  data: {
    media: AlwaysExist<GetMediaCollectionQuery>;
    headers?: GraphQLResponse["headers"];
  },
  interaction: UsableInteraction,
  type: MediaType,
) {
  // GAMEPLAN: Go through lists -> Go through entries -> Add entry data to redis
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

      dataToGiveToRedis[entry.media.id] = cacheEntry;
    }
  }
  redis.json.set(`_user${interaction.alID}-${type}`, "$", dataToGiveToRedis);
}
