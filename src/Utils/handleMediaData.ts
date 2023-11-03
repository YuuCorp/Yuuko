import type { HookData, UsableInteraction } from "../Structures";
import type { AlwaysExist, GraphQLResponse } from "./types";
import type { AnimeQuery, MangaQuery } from "../GraphQL/types";
import { EmbedBuilder } from "discord.js";
import { BuildPagination, Footer, SeriesTitle } from ".";

export function handleData(
    data: {
        media: AlwaysExist<AnimeQuery["Media"]> | AlwaysExist<MangaQuery["Media"]>;
        headers?: GraphQLResponse["headers"];
    },
    interaction: UsableInteraction,
    mediaType: "anime" | "manga",
    hookdata?: HookData | null,
) {
    const { media, headers } = data;
    // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
    const descLength = 350;
    const endDate = media?.endDate?.year ? `${media.endDate.day}-${media.endDate.month}-${media.endDate.year}` : "Unknown";
    const description =
    media.description
        ?.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\n\n/g, "\n") || "No description available.";

    let episodeValue: number | null | undefined;
    if('episodes' in media) episodeValue = media.episodes;
    else if('chapters' in media) episodeValue = media.chapters;

    const firstPage = new EmbedBuilder()
      .setImage(media.bannerImage!)
      .setThumbnail(media.coverImage?.large!)
      .setTitle(media.title ? SeriesTitle(media.title) : "Unknown")
      .addFields(
        {
          name: `${mediaType === "anime" ? "Episodes" : "Chapters"}`,
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
          value: media.startDate?.day ? `${media.startDate.day}-${media.startDate.month}-${media.startDate.year}` : "Unknown",
          inline: true,
        },
        {
          name: "End Date",
          value: media.endDate?.day ? `${media.endDate.day}-${media.endDate.month}-${media.endDate.year}` : "Unknown",
          inline: true,
        },
        {
          // ^ Check if the anime has finished airing
          name: "Placeholder",
          value: "Placeholder",
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

      if('nextAiringEpisode' in media) {
          firstPage.spliceFields(5, 1, {
              name: media.nextAiringEpisode?.episode ? `Episode ${media.nextAiringEpisode.episode} airing in:` : "Completed on:",
              value: media.nextAiringEpisode?.airingAt ? `<t:${media.nextAiringEpisode.airingAt}:R>` : endDate,
              inline: true,
          });
        } else firstPage.spliceFields(5, 1, {
            name: "\u200B",
            value: "\u200B",
            inline: true,
          });
      
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
  
    if (media.mediaListEntry) {
      let score = "Unknown";
      const scoring = media.mediaListEntry?.user?.mediaListOptions?.scoreFormat;
      if (media.mediaListEntry.score) {
        score = media.mediaListEntry.score.toString();
        if (scoring === ("POINT_10_DECIMAL" || "POINT_10")) score = `${score} / 10`;
        else if (scoring === ("POINT_100" || "POINT_5")) score = `${score} / ${scoring.split("POINT_")[1]}`;
        else if (scoring === "POINT_3") score = score === "1" ? "☹️" : score === "2" ? "😐" : "🙂";
      }
      
      const userProgress = media.mediaListEntry?.progress ?
        `${media.mediaListEntry.progress} ${mediaType === "anime" ? "episode(s)" : "chapter(s)"}` : "Unknown";
  
      const thirdPage = new EmbedBuilder()
        .setAuthor({ name: `${media.title?.english || "N/A"} | ${media.mediaListEntry?.user?.name}'s Stats` })
        .addFields(
          {
            name: "Status",
            value: media.mediaListEntry?.status?.toString() || "Unknown",
            inline: true,
          },
          {
            name: "Progress",
            value: userProgress,
            inline: true,
          },
          {
            name: "Score",
            value: score,
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
      const pageList = [firstPage, secondPage, thirdPage];
      BuildPagination(interaction, pageList).paginate();
      return;
    }
  
    const pageList = [firstPage, secondPage];
    BuildPagination(interaction, pageList).paginate();
}