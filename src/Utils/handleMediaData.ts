import type { Client, HookData, UsableInteraction } from "../Structures";
import type { AnimeQuery, MangaQuery, Maybe, ScoreFormat } from "../GraphQL/types";
import type { AlwaysExist, CacheEntry, GraphQLResponse } from "./types";
import { BuildPagination, Footer, SeriesTitle } from ".";
import { stat, statTables } from "../Database";
import { EmbedBuilder, hyperlink } from "discord.js";
import { redis } from "../Caching/redis";
import { eq } from "drizzle-orm";

export async function handleData(
  data: {
    media: AlwaysExist<AnimeQuery["Media"]> | AlwaysExist<MangaQuery["Media"]>;
    headers?: GraphQLResponse["headers"];
  },
  interaction: UsableInteraction,
  mediaType: "ANIME" | "MANGA",
  hookdata?: HookData | null,
) {
  const { media, headers } = data;
  // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
  const descLength = 350;
  const description =
    media.description
      ?.replace(/<br><br>/g, "\n")
      .replace(/<br>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n\n/g, "\n") || "No description available.";

  let episodeValue: number | null | undefined;
  if ("episodes" in media) episodeValue = media.episodes;
  else if ("chapters" in media) episodeValue = media.chapters;

  let startDate: string = "Unknown";
  let endDate: string = "Unknown";
  if (media.startDate) {
    const { year: startYear, month: startMonth, day: startDay } = media.startDate;
    if (startYear === null) startDate = "Unknown";
    else startDate = `${startYear}-${startMonth}-${startDay}`;
  }
  if (media.endDate) {
    const { year: endYear, month: endMonth, day: endDay } = media.endDate;
    if (endYear === null) endDate = "Unknown";
    else endDate = `${endYear}-${endMonth}-${endDay}`;
  }

  const firstPage = new EmbedBuilder()
    .setImage(media.bannerImage!)
    .setThumbnail(media.coverImage?.large!)
    .setTitle(media.title ? SeriesTitle(media.title) : "Unknown")
    .addFields(
      {
        name: `${mediaType === "ANIME" ? "Episodes" : "Chapters"}`,
        value: episodeValue?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Format",
        value: media.format || "Unknown",
        inline: true,
      },
      {
        name: "Mean Score",
        value: media.meanScore?.toString() == "undefined" ? media.meanScore?.toString() : "Unknown",
        inline: true,
      },
      {
        name: "Start Date",
        value: startDate,
        inline: true,
      },
      {
        name: "End Date",
        value: endDate,
        inline: true,
      },
      {
        // Spacing field that on anime command can be replaced with the next airing episode
        name: "\u200B",
        value: "\u200B",
        inline: true,
      },
      {
        name: "Genres",
        value: "``" + `${media.genres?.join(", ") || "N/A"}` + "``",
        inline: true,
      },
    )
    .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
    .setURL(media.siteUrl?.toString() || "https://anilist.co/")
    .setColor("Green")
    .setFooter(Footer(headers));

  if ("nextAiringEpisode" in media) {
    if (media.nextAiringEpisode) {
      firstPage.spliceFields(5, 1, {
        name: `Episode ${media.nextAiringEpisode.episode} airing in:`,
        value: `<t:${media.nextAiringEpisode.airingAt}:R>`,
        inline: true,
      });
    }
  }

  const secondPage = new EmbedBuilder()
    .setAuthor({ name: `${media.title?.english || "N/A"} | Additional info` })
    // .setThumbnail(anime.coverImage.large)

    .addFields(
      {
        name: "Source",
        value: media.source || "Unknown",
        inline: true,
      },
      {
        name: "Media ID",
        value: media.id?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Synonyms",
        value: "``" + `${media.synonyms?.join(", ") || "N/A"}` + "``",
        inline: false,
      },
    )
    .setColor("Green")
    .setFooter(Footer(headers));

  if (media.coverImage?.large) secondPage.setThumbnail(media.coverImage.large);

  if (hookdata?.image) firstPage.setImage(hookdata.image);

  if (hookdata?.fields) for (const field of hookdata.fields) firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });
  const pageList = [firstPage, secondPage];

  if (media.mediaListEntry) {
    const scoring = media.mediaListEntry?.user?.mediaListOptions?.scoreFormat;

    const userProgress = media.mediaListEntry?.progress ? `${media.mediaListEntry.progress} ${mediaType === "ANIME" ? "episode(s)" : "chapter(s)"}` : "Unknown";

    const thirdPage = new EmbedBuilder()
      .setAuthor({ name: `${media.title?.english || "N/A"} | ${media.mediaListEntry?.user?.name}'s Stats` })
      .addFields(
        {
          name: "Status",
          value: media.mediaListEntry?.status?.toString() ? capitalize(media.mediaListEntry?.status?.toString()) : "Unknown",
          inline: true,
        },
        {
          name: "Progress",
          value: userProgress,
          inline: true,
        },
        {
          name: "Score",
          value: fixScoring(null, scoring!, media.mediaListEntry?.score!),
          inline: true,
        },
        {
          name: "Notes",
          value: media.mediaListEntry?.notes || "No Notes Found",
        },
      )
      .setColor("Green")
      .setFooter(Footer(headers));

    if (media.coverImage?.large) thirdPage.setThumbnail(media.coverImage.large);
    pageList.push(thirdPage);
  }

  const tableToUse = mediaType === "ANIME" ? statTables.AnimeStats : statTables.MangaStats;
  const mediaUsers = (await stat.select().from(tableToUse).where(eq(tableToUse.mediaId, data.media.id)))[0];

  if (mediaUsers) {
    const mediaPool = mediaUsers.users.map(
      (user) =>
        redis.json.get(`_user${user.aId}-${mediaType}`, {
          path: `$.${media.id}`,
        }) as Promise<CacheEntry>,
    );
    const userData = (await Promise.allSettled(mediaPool)).filter((user): user is PromiseFulfilledResult<CacheEntry> => user.status === "fulfilled")
      .filter(Boolean).flatMap((user) => user.value);
    // console.log(userData.length);
    // console.log(userData);
    console.log(mediaType);
    if (userData.every((e) => e == null)) return BuildPagination(interaction, pageList).paginate();
    const statisticsEmbed = new EmbedBuilder()
      .setAuthor({ name: `${media.title?.english || "N/A"} | Guild Statistics for ${interaction.guild?.name}` })
      .setImage(media.bannerImage!)
      .setDescription(
        userData.map((user) => `${hyperlink(user.user!.name, `https://anilist.co/user/${user.user.id}`)}: ${user.progress} ${episodeValue
          ? ("/ " + episodeValue) 
          : (mediaType === "ANIME" ? "episodes" : "chapters")} | ${fixScoring(user, user.user?.mediaListOptions!.scoreFormat, user.score)}`).join("\n"),
      );
    pageList.push(statisticsEmbed);
  }

  return BuildPagination(interaction, pageList).paginate();
}

function fixScoring(user: CacheEntry | null, scoreType: Maybe<ScoreFormat> | undefined, scoreValue: Maybe<number> | undefined) {
  let score = "Unknown";
  if (scoreValue && scoreType) {
    score = scoreValue.toString();
    if (scoreType === ("POINT_10_DECIMAL" || "POINT_10")) score = `${score} / 10`;
    else if (scoreType === ("POINT_100" || "POINT_5")) score = `${score} / ${scoreType.split("POINT_")[1]}`;
    else if (scoreType === "POINT_3") score = score === "1" ? "☹️" : score === "2" ? "😐" : "🙂";
  } else if (user && user.status) score = capitalize(user.status.toString());
  return score;
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();
}
