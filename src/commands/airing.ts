import { buildPagination, footer, getStringOption, graphQLRequest, SeriesTitle, YuukoError } from "#utils/index";
import { EmbedBuilder, SlashCommandBuilder, TimestampStyles, time } from "discord.js";
import { MediaType, type AiringQueryVariables } from "#graphQL/types";
import type { Command } from "#structures/index";

const name = "airing";
const usage = "airing <?in>";
const description = "Gets the airing schedule for today or a certain period";

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("user").setDescription("The users whose list you want to use for airing anime."))
    .addStringOption((option) => option.setName("period").setDescription("Choose the period when the anime is airing").addChoices(
      { name: "Today", value: "today" },
      { name: "Tomorrow", value: "tomorrow" },
      { name: "Next 7 days", value: "this_week" },
      { name: "Next 7-14 days", value: "next_week" },
      { name: "Next 2 weeks", value: "2weeks" },
      { name: "Next month (30 days)", value: "1month" },
    )),

  run: async ({ interaction }, hookData): Promise<void> => {
    await interaction.deferReply();

    const vars: AiringQueryVariables = {
      dateStart: 0,
      nextDay: 0,
      getID: undefined
    };

    const username = getStringOption(interaction, hookData, "user");
    const period = getStringOption(interaction, hookData, "period") as "today" | "tomorrow" | "this_week" | "next_week" | "2weeks" | "1month";
    const mediaIDs = [];

    let startOffset = 0;
    let periodLength = 7; // in days

    switch (period) {
      case "today":
        startOffset = 0;
        periodLength = 1;
        break;
      case "tomorrow":
        startOffset = 1;
        periodLength = 1;
        break;
      case "this_week":
        startOffset = 0;
        periodLength = 7;
        break;
      case "next_week":
        startOffset = 7;
        periodLength = 7;
        break;
      case "2weeks":
        startOffset = 14;
        periodLength = 14;
        break;
      case "1month":
        startOffset = 30;
        periodLength = 30;
        break;
    }

    const startDate = new Date();
    startDate.setUTCDate(startDate.getUTCDate() + startOffset);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + periodLength - 1);
    endDate.setUTCHours(23, 59, 59, 999);

    vars.dateStart = Math.floor(startDate.getTime() / 1000);
    vars.nextDay = Math.floor(endDate.getTime() / 1000);

    if (username) {
      const {
        data: { MediaListCollection: data }
      } = await graphQLRequest("GetMediaCollection", { type: MediaType.Anime, userName: username });

      if (data?.lists) {
        for (let i = 0; i < data.lists.length; i++) {
          if (!data.lists[i]?.entries) return;
          if (data.lists[i]?.entries?.length === 0) return;
          // check so the object is not undefined
          if (data.lists[i]?.entries && data.lists[i]?.entries?.length != 0) mediaIDs.push(...data.lists[i]!.entries!.map((entry) => {
            if (!entry?.media?.nextAiringEpisode?.airingAt) return;
            return entry!.media!.id;
          }));
        }
      }

      vars.getID = mediaIDs.filter((id) => id !== undefined);
    }

    // ^ Make the HTTP Api request

    const {
      data: { Page: data },
      headers,
    } = await graphQLRequest("Airing", vars);
    if (!data || !data.airingSchedules) throw new YuukoError("No airing anime found.", { vars });
    const { airingSchedules } = data;

    const chunkSize = 5;
    const fields = [];

    // Sort the airing anime by date
    airingSchedules.sort((a, b) => (a?.timeUntilAiring || 0) - (b?.timeUntilAiring || 0));
    for (let i = 0; i < airingSchedules.length; i += chunkSize) {
      fields.push(airingSchedules.slice(i, i + chunkSize));
    }

    // ^ Create pages with 5 airing anime per page and then make them into embeds
    const pageList: EmbedBuilder[] = [];
    fields.forEach((fieldSet, index) => {
      const embed = new EmbedBuilder();
      embed.setTitle(`Airing between ${startDate.toDateString()} to ${endDate.toDateString()}`);
      embed.setColor("Green");
      embed.setFooter(footer(headers));

      fieldSet.forEach((field) => {
        if (!field) return;
        const { media, episode, airingAt } = field;

        embed.addFields({
          name: `${SeriesTitle(media?.title || undefined)}`,
          value: `> **[EP - ${episode}]** :airplane: ${(new Date(airingAt * 1000) > new Date() ? `Going to air ` : `Aired`) + time(airingAt, TimestampStyles.RelativeTime)}`,
          inline: false,
        });
      });
      pageList.push(embed);
    });

    await buildPagination(interaction, pageList);
  },
} satisfies Command<{ user?: string, period?: string }>;
