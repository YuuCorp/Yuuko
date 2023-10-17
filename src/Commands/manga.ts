import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook } from "../Structures";
import { EmbedError, GraphQLRequest, Footer, BuildPagination, getOptions, SeriesTitle } from "../Utils";

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
    // const manga = interaction.options.getString('query')
    const { query: manga } = getOptions<{ query: string }>(interaction.options, ["query"]);
    const vars = {} as any;
    // ^ Hook data is passed in if this command is called from another command
    if (!hook) {
      if (manga.length < 3) return void interaction.reply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });

      vars.query = manga;
    } else if (hook) {
      if (hookdata?.title) {
        vars.query = hookdata.title;
      } else if (hookdata?.id) {
        vars.query = hookdata.id;
      }
    } else {
      return void interaction.reply({ embeds: [EmbedError(`MangaCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });
    }
    // ^ Make the HTTP Api request
    GraphQLRequest("Manga", vars, interaction.ALtoken)
      .then((response) => {
        const data = response.data.Media; // my god damn
        if (data) {
          // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
          const descLength = 350;
          const description =
            data?.description
              ?.replace(/<br><br>/g, "\n")
              .replace(/<br>/g, "\n")
              .replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, " ")
              .replace(/\n\n/g, "\n") || "No description available.";

          const coverImage = data.coverImage?.large;
          const bannerImage = data.bannerImage;

          let startDate: string = "Unknown";
          let endDate: string = "Unknown";

          if (data.startDate) {
            const { year: startYear, month: startMonth, day: startDay } = data.startDate;

            startDate = `${startYear}-${startMonth}-${startDay}`;
          }
          if (data.endDate) {
            const { year: endYear, month: endMonth, day: endDay } = data.endDate;

            endDate = `${endYear}-${endMonth}-${endDay}`;
          }

          const firstPage = new EmbedBuilder()

            .setTitle(SeriesTitle(data.title || undefined))
            .addFields(
              {
                name: "Chapters",
                value: data?.chapters?.toString() || "Unknown",
                inline: true,
              },
              {
                name: "Format",
                value: data.format || "Unknown",
                inline: true,
              },
              {
                name: "Mean Score",
                value: data?.meanScore?.toString() == "undefined" ? data?.meanScore?.toString() : "Unknown",
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
                value: `\`\`${data.genres?.join(", ") || "N/A"}\`\``, // wanna check how it runs? hell yeah well that went well.
                inline: true,
              },
            )
            .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
            .setURL(data.siteUrl || "https://anilist.co") // like this is the url right? // yes
            .setColor("Green")
            .setFooter(Footer(response.headers));

          if (bannerImage) firstPage.setImage(bannerImage);

          const secondPage = new EmbedBuilder()
            .setAuthor({ name: `${SeriesTitle(data.title || undefined)} | Additional info` })
            .addFields(
              {
                name: "Source",
                value: data.source || "Unknown",
                inline: true,
              },
              {
                name: "Media ID",
                value: data?.id?.toString() || "Unknown",
                inline: true,
              },
              {
                name: "Synonyms",
                value: "``" + `${data.synonyms?.join(", ") || "N/A"}` + "``",
                inline: false,
              },
            )
            .setColor("Green")
            .setFooter(Footer(response.headers));

          if (coverImage) {
            firstPage.setThumbnail(coverImage);
            secondPage.setThumbnail(coverImage);
          }

          if (hookdata?.image) firstPage.setImage(hookdata.image);

          if (hookdata?.fields) for (const field of hookdata.fields) firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });

          const listEntry = data.mediaListEntry;
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
              .setAuthor({ name: `${SeriesTitle(data.title || undefined)} | ${listEntry.user?.name || "Unknown"}'s Stats` })
              .addFields(
                {
                  name: "Status",
                  value: listEntry.status?.toString() || "Unknown",
                  inline: true,
                },
                {
                  name: "Progress",
                  value: data.chapters ? `${data.mediaListEntry?.progress} chapter(s) out of ${data.chapters}` : `${data.mediaListEntry?.progress} chapter(s)` || "Unknown",
                  inline: true,
                },
                {
                  name: "Score",
                  value: score,
                  inline: true,
                },
                {
                  name: "Notes",
                  value: data.mediaListEntry?.notes || "No Notes Found",
                },
              )
              .setColor("Green")
              .setFooter(Footer(response.headers));

            if (coverImage) thirdPage.setThumbnail(coverImage);

            const pageList = [firstPage, secondPage, thirdPage];
            BuildPagination(interaction, pageList).paginate();
            return;
          }

          const pageList = [firstPage, secondPage];
          BuildPagination(interaction, pageList).paginate();
        } else {
          return void interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
        }
      })
      .catch((error) => {
        console.error(error);
        return void interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
} satisfies CommandWithHook;
