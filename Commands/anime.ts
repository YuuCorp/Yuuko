import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwOptionalALToken } from "../Middleware/ALToken";
import type { CommandWithHook } from "../Structures";
import { BuildPagination, EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions } from "../Utils";

const name = "anime";
const usage = "anime <title>";
const description = "Gets an anime from anilist based on a search result.";

export default {
  name,
  usage,
  description,
  middlewares: [mwOptionalALToken],
  commandType: 'Anilist',
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  run: async ({ interaction, client, hook = false, hookdata = null }): Promise<void> => {
    if (!interaction.isCommand()) return;
    // const anime = interaction.options.getString("query");
    const { query } = getOptions<{ query: string }>(interaction.options, ["query"]);
    const vars = {} as any;
    // ^ Hook data is passed in if this command is called from another command
    if (!hook) {
      if (query.length < 3) return void interaction.reply({ embeds: [EmbedError(`Please enter a search query of at least 3 characters.`, null, false)] });

      vars.query = query;
    } else if (hook) {
      if (hookdata?.title) {
        vars.query = hookdata.title;
      }
      if (hookdata?.id) {
        vars.aID = hookdata.id;
      }
    } else {
      return void interaction.reply({ embeds: [EmbedError(`AnimeCmd was hooked, yet there was no title or ID provided in hookdata.`, null, false)] });
    }
    console.log(hookdata, "hookdata");
    console.log(vars, "vars");

    // if (hookdata && hookdata?.id) {
    //     GraphQLQueries.Anime = GraphQLQueries.Anime.replace("$query: String", "$query: Int");
    //     GraphQLQueries.Anime = GraphQLQueries.Anime.replace("search:", "id:");
    // }
    // ^ Make the HTTP Api request
    GraphQLRequest(
      "Anime",
      {
        query: vars.query,
        aID: vars.aID,
      },
      interaction.ALtoken,
    )
      .then(({ data: { Media }, headers }) => {
        const data = Media;
        if (data) {
          // ^ Fix the description by replacing and converting HTML tags, and replacing duplicate newlines
          const descLength = 350;
          const endDate = data?.endDate?.year ? `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}` : "Unknown";
          const description =
            data?.description
              ?.replace(/<br><br>/g, "\n")
              .replace(/<br>/g, "\n")
              .replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, " ")
              .replace(/\n\n/g, "\n") || "No description available.";
          const firstPage = new EmbedBuilder()
            .setImage(data.bannerImage!)
            .setThumbnail(data.coverImage?.large!)
            .setTitle(data.title ? SeriesTitle(data.title) : "Unknown")
            .addFields(
              {
                name: "Episodes",
                value: data?.episodes?.toString() || "Unknown",
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
                value: data.startDate?.day ? `${data.startDate.day}-${data.startDate.month}-${data.startDate.year}` : "Unknown",
                inline: true,
              },
              {
                name: "End Date",
                value: data.endDate?.day ? `${data.endDate.day}-${data.endDate.month}-${data.endDate.year}` : "Unknown",
                inline: true,
              },
              {
                // ^ Check if the anime has finished airing
                name: data?.nextAiringEpisode?.episode ? `Episode ${data.nextAiringEpisode.episode} airing in:` : "Completed on:",
                value: data?.nextAiringEpisode?.airingAt ? `<t:${data.nextAiringEpisode.airingAt}:R>` : endDate,
                inline: true,
              },
              {
                name: "Genres",
                value: "``" + `${data.genres?.join(", ") || "N/A"}` + "``",
                inline: true,
              },
            )
            .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
            .setURL(data.siteUrl?.toString() || "https://anilist.co/")
            .setColor("Green")
            .setFooter(Footer(headers));

          const secondPage = new EmbedBuilder()
            .setAuthor({ name: `${data.title?.english || "N/A"} | Additional info` })
            // .setThumbnail(data.coverImage.large)

            .addFields(
              {
                name: "Source",
                value: data.source || "Unknown",
                inline: true,
              },
              {
                name: "Episode Duration",
                value: data?.duration?.toString() || "Unknown",
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
            .setFooter(Footer(headers));

          if (data.coverImage?.large) secondPage.setThumbnail(data.coverImage.large);

          if (hookdata?.image) firstPage.setImage(hookdata.image);

          if (hookdata?.fields) for (const field of hookdata.fields) firstPage.addFields({ name: field.name, value: field.value, inline: field.inline || false });

          if (data.mediaListEntry) {
            let score = "Unknown";
            const scoring = data.mediaListEntry?.user?.mediaListOptions?.scoreFormat;
            if (data.mediaListEntry.score) {
              score = data.mediaListEntry.score.toString();
              if (scoring === ("POINT_10_DECIMAL" || "POINT_10")) score = `${score} / 10`;
              else if (scoring === ("POINT_100" || "POINT_5")) score = `${score} / ${scoring.split("POINT_")[1]}`;
              else if (scoring === "POINT_3") score = score === "1" ? "☹️" : score === "2" ? "😐" : "🙂";
            }

            const thirdPage = new EmbedBuilder()
              .setAuthor({ name: `${data.title?.english || "N/A"} | ${data.mediaListEntry?.user?.name}'s Stats` })

              .addFields(
                {
                  name: "Status",
                  value: data.mediaListEntry?.status?.toString() || "Unknown",
                  inline: true,
                },
                {
                  name: "Progress",
                  value: data.episodes ? `${data.mediaListEntry?.progress} episode(s) out of ${data.episodes}` : `${data.mediaListEntry?.progress} episode(s)` || "Unknown",
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
              .setFooter(Footer(headers));

            if (data.coverImage?.large) thirdPage.setThumbnail(data.coverImage.large);
            const pageList = [firstPage, secondPage, thirdPage];
            BuildPagination(interaction, pageList).paginate();
            return;
          }

          const pageList = [firstPage, secondPage];
          BuildPagination(interaction, pageList).paginate();
        } else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
        }
      })
      .catch((error: any) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
} satisfies CommandWithHook;
