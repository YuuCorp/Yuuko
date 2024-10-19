import { buildPagination, embedError, footer, graphQLRequest, SeriesTitle, getOptions } from "#utils/index";
import { EmbedBuilder, SlashCommandBuilder, TimestampStyles, time } from "discord.js";
import ms from "ms";
import { MediaType } from "#graphQL/types";
import type { Command } from "#structures/index";

const name = "airing";
const usage = "airing <?in>";
const description = "Gets the airing schedule for today or `period`. (e.g. `1 week` means today the next week.)";

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("user").setDescription("The users whose list you want to use for airing anime."))
    .addStringOption((option) => option.setName("in").setDescription('Airing *in* (e.g. "1 week")')),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    const vars: {
      dateStart: number;
      nextDay: number;
      getID: number[] | undefined;
    } = {
      dateStart: 0,
      nextDay: 0,
      getID: undefined
    };
    // ^ Check if the user wants to search for a specific day
    let airingIn = 0;

    const { user: username } = getOptions<{ user: string | undefined }>(interaction.options, ["user"]);
    const { in: period } = getOptions<{ in: string | undefined }>(interaction.options, ["in"]);
    // const period = interaction.options.getString("in");
    // const user = interaction.options.getString("user");
    const mediaIDs = [];

    if (period) {
      try {
        airingIn = ms(period);
        if (!airingIn) throw new Error("Invalid time format.");
      } catch (r) {
        return void interaction.reply({
          embeds: [embedError(`Invalid time format. See \`/help\` for more information.`, { period })],
        });
      }
    }

    // ^ Get current day and time in UTC
    const _day = new Date(Date.now() + airingIn);
    const day = new Date(Date.UTC(_day.getFullYear(), _day.getMonth(), _day.getDate()));
    const nextWeek = new Date(day.getTime());
    nextWeek.setHours(23, 59, 59, 999);
    nextWeek.setDate(day.getDate() + 7);
    vars.dateStart = Math.floor(day.getTime() / 1000);
    vars.nextDay = Math.floor(nextWeek.getTime() / 1000);

    if (username) {
      const tempVars = { userName: username, type: "ANIME" };
      const {
        data: { MediaListCollection: data },
        headers,
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

    try {
      const {
        data: { Page: data },
        headers,
      } = await graphQLRequest("Airing", vars);
      if (!data) return void interaction.reply({ embeds: [embedError("No airing anime found.")] });
      const { airingSchedules } = data;

      if (data) {
        const chunkSize = 5;
        const fields = [];
        // Sort the airing anime alphabetically by title
        if (!airingSchedules) return void interaction.reply({ embeds: [embedError("No airing anime found.")] });
        airingSchedules.sort((a, b) => (a?.timeUntilAiring || 0) - (b?.timeUntilAiring || 0));

        for (let i = 0; i < airingSchedules.length; i += chunkSize) {
          fields.push(airingSchedules.slice(i, i + chunkSize));
        }

        // ^ Create pages with 5 airing anime per page and then make them into embeds
        const pageList: EmbedBuilder[] = [];
        fields.forEach((fieldSet, index) => {
          const embed = new EmbedBuilder();
          embed.setTitle(`Airing between ${day.toDateString()} to ${nextWeek.toDateString()}`);
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

        buildPagination(interaction, pageList).paginate();
      } else {
        interaction.reply({
          embeds: [embedError("No airing anime found.")],
        });
      }
    } catch (e: any) {
      console.error(e);
      interaction.reply({ embeds: [embedError(e, vars)] });
    }
  },
} satisfies Command;
