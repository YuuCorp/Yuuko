import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook, HookData, UsableInteraction } from "../Structures";
import { normalize, EmbedError, GraphQLRequest, Footer, BuildPagination, getOptions, SeriesTitle, type AlwaysExist, type GraphQLResponse } from "../Utils";
import type { MangaQuery } from "../GraphQL/types";

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
    if (manga) normalizedQuery = normalize(manga); // we got ghosts in code fr

    const vars: Partial<{
      query: string;
      mID: number;
    }> = {};

    // let mangaIdFound = false;

    if (!hook) {
      if (manga.length < 3) return void interaction.editReply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });
      vars.query = manga;
    } else if (hook && hookdata) {
      if (hookdata.title) {
        vars.query = hookdata.title;
        // normalizedQuery = normalize(hookdata.title);
      }
    } else return void interaction.editReply({ embeds: [EmbedError(`MangaCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });

    // if (!vars.mID) {
    //   const mangaId = await redis.get<string>(`_mangaId-${normalizedQuery}`);
    //   if (mangaId) {
    //     mangaIdFound = true;
    //     vars.mID = parseInt(mangaId);
    //     console.log(`[MangaCmd] Found cached ID for ${normalizedQuery} : ${vars.mID}`);
    //     console.log(`[MangaCmd] Querying for ${normalizedQuery} with ID ${vars.mID}`);
    //   }
    // }

    // const cacheData = await redis.json.get(`_manga-${vars.mID}`);

    // if (cacheData) {
    //   console.log("[MangaCmd] Found cache data, returning data...");
    //   return void handleData({ manga: cacheData }, interaction);
    // }

    console.log("[MangaCmd] No cache found, fetching from CringeQL");
    try {
      const {
        data: { Media: data },
        headers,
      } = await GraphQLRequest("Manga", vars, interaction.ALtoken);
      if (data) {
        // if (!mangaIdFound) redis.set(`_mangaId-${normalizedQuery}`, data.id);
        // redis.json.set(`_manga-${data.id}`, "$", data);
        // for(const synonym of data.synonyms || []) {
        //   if(!synonym) continue;
        //   redis.set(`_mangaId-${normalize(synonym)}`, data.id.toString());
        // }
        return void handleData({ manga: data, headers: headers }, interaction, hookdata);
      } else {
        return void interaction.editReply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
      }
    } catch (e: any) {
      console.error(e);
      return void interaction.editReply({ embeds: [EmbedError(e, vars)] });
    }
  },
} satisfies CommandWithHook;

function handleData(
  data: {
    manga: AlwaysExist<MangaQuery["Media"]>;
    headers?: GraphQLResponse["headers"];
  },
  interaction: UsableInteraction,
  hookdata?: HookData | null,
) {
  const { headers, manga } = data;
  // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
  const descLength = 350;
  const description =
    manga?.description
      ?.replace(/<br><br>/g, "\n")
      .replace(/<br>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\n\n/g, "\n") || "No description available.";

  const coverImage = manga.coverImage?.large;
  const bannerImage = manga.bannerImage;

  let startDate: string = "Unknown";
  let endDate: string = "Unknown";

  if (manga.startDate) {
    const { year: startYear, month: startMonth, day: startDay } = manga.startDate;
    if (startYear === null) startDate = "Unknown";
    else startDate = `${startYear}-${startMonth}-${startDay}`;
  }
  if (manga.endDate) {
    const { year: endYear, month: endMonth, day: endDay } = manga.endDate;
    if (endYear === null) endDate = "Unknown";
    else endDate = `${endYear}-${endMonth}-${endDay}`;
  }

  const firstPage = new EmbedBuilder()

    .setTitle(SeriesTitle(manga.title || undefined))
    .addFields(
      {
        name: "Chapters",
        value: manga?.chapters?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Format",
        value: manga.format || "Unknown",
        inline: true,
      },
      {
        name: "Mean Score",
        value: manga?.meanScore?.toString() == "undefined" ? manga?.meanScore?.toString() : "Unknown",
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
        name: "\u200B",
        value: "\u200B",
        inline: true,
      },
      {
        name: "Genres",
        value: `\`\`${manga.genres?.join(", ") || "N/A"}\`\``, // wanna check how it runs? hell yeah well that went well.
        inline: true,
      },
    )
    .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
    .setURL(manga.siteUrl || "https://anilist.co") // like this is the url right? // yes
    .setColor("Green")
    .setFooter(Footer(headers));

  if (bannerImage) firstPage.setImage(bannerImage);

  const secondPage = new EmbedBuilder()
    .setAuthor({ name: `${SeriesTitle(manga.title || undefined)} | Additional info` })
    .addFields(
      {
        name: "Source",
        value: manga.source || "Unknown",
        inline: true,
      },
      {
        name: "Media ID",
        value: manga?.id?.toString() || "Unknown",
        inline: true,
      },
      {
        name: "Synonyms",
        value: "``" + `${manga.synonyms?.join(", ") || "N/A"}` + "``",
        inline: false,
      },
    )
    .setColor("Green")
    .setFooter(Footer(headers));

  if (coverImage) {
    firstPage.setThumbnail(coverImage);
    secondPage.setThumbnail(coverImage);
  }

  if (hookdata?.image) firstPage.setImage(hookdata.image);

  if (hookdata?.fields) for (const field of hookdata.fields) firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });

  const listEntry = manga.mediaListEntry;
  if (listEntry) {
    let score = "Not scored";
    const scoring = listEntry.user?.mediaListOptions?.scoreFormat;
    if (listEntry.score && scoring) {
      score = listEntry.score.toString();
      if (scoring === ("POINT_10_DECIMAL" || "POINT_10")) score = `${score} / 10`;
      else if (scoring === ("POINT_100" || "POINT_5")) score = `${score} / ${scoring.split("POINT_")[1]}`;
      else if (scoring === "POINT_3") score = score === "1" ? "☹️" : score === "2" ? "😐" : "🙂";
    }

    const thirdPage = new EmbedBuilder()
      .setAuthor({ name: `${SeriesTitle(manga.title || undefined)} | ${listEntry.user?.name || "Unknown"}'s Stats` })
      .addFields(
        {
          name: "Status",
          value: listEntry.status?.toString() || "Unknown",
          inline: true,
        },
        {
          name: "Progress",
          value: manga.chapters ? `${manga.mediaListEntry?.progress} chapter(s) out of ${manga.chapters}` : `${manga.mediaListEntry?.progress} chapter(s)` || "Unknown",
          inline: true,
        },
        {
          name: "Score",
          value: score,
          inline: true,
        },
        {
          name: "Notes",
          value: manga.mediaListEntry?.notes || "No Notes Found",
        },
      )
      .setColor("Green")
      .setFooter(Footer(headers));

    if (coverImage) thirdPage.setThumbnail(coverImage);

    const pageList = [firstPage, secondPage, thirdPage];
    BuildPagination(interaction, pageList).paginate();
    return;
  }

  const pageList = [firstPage, secondPage];
  BuildPagination(interaction, pageList).paginate();
}
