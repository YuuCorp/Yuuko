import { Embed, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import ms from "ms";
import type { Command } from "../Structures";
import { EmbedError, Footer, GraphQLRequest, SeriesTitle, CommandCategories, BuildPagination, getOptions, type Media } from "../Utils";
import { MediaType } from "../GraphQL/types";

const name = "airing";
const usage = "airing <?in>";
const description = "Gets the airing schedule for today or `period`. (e.g. `1 week` means today the next week.)";

export default {
  name,
  usage,
  description,
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("user").setDescription("The users whose list you want to use for airing anime."))
    .addStringOption((option) => option.setName("in").setDescription('Airing *in* (e.g. "1 week")')),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    const vars: Partial<{
      dateStart: number;
      nextDay: number;
      getID: number[];
    }> = {
      dateStart: 0,
      nextDay: 0,
      getID: [],
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
          embeds: [EmbedError(`Invalid time format. See \`/help\` for more information.`, { period })],
        });
      }
    }

    if (username) {
      const tempVars = { userName: username, type: "ANIME" };
      // const response = await GraphQLRequest(GraphQLQueries.GetMediaCollection, tempVars);
      const repsonse = await GraphQLRequest("GetMediaCollection", { type: MediaType.Anime, userName: username });
      const data = repsonse.data.MediaListCollection;
      if (data?.lists)
        for (let i = 0; i < data.lists.length; i++) {
          if (!data.lists[i]?.entries) return;
          if (data.lists[i]?.entries?.length === 0) return;
          // check so the object is not undefined
          if (data.lists[i]?.entries && data.lists[i]?.entries?.length != 0) {
            mediaIDs.push(...data.lists[i]!.entries!.map((entry) => entry!.media!.id));
          }
        }

      vars.getID = mediaIDs;
    }
    // ^ Get current day and time in UTC
    const _day = new Date(Date.now() + airingIn);
    const day = new Date(Date.UTC(_day.getFullYear(), _day.getMonth(), _day.getDate()));
    const nextWeek = new Date(day.getTime());
    nextWeek.setHours(23, 59, 59, 999);
    nextWeek.setDate(day.getDate() + 7);
    vars.dateStart = Math.floor(day.getTime() / 1000);
    vars.nextDay = Math.floor(nextWeek.getTime() / 1000);
    // ^ Make the HTTP Api request
    console.log(vars, "vars");
    GraphQLRequest("Airing", { nextDay: vars.nextDay, dateStart: vars.dateStart, getID: vars.getID })
      .then((response) => {
        const data = response.data.Page;
        if (!data) return interaction.reply({ embeds: [EmbedError("No airing anime found.")] });
        const { airingSchedules } = data;

        if (data) {
          const chunkSize = 5;
          const fields = [];
          // Sort the airing anime alphabetically by title
          if (!airingSchedules) return interaction.reply({ embeds: [EmbedError("No airing anime found.")] });
          airingSchedules.sort((a, b) => {
            if (!a || !b) return 0;
            if (!a.media || !b.media) return 0;
            if (a.media.title == null || b.media.title == null) return 0;
            const aTitle = (a!.media!.title!.english || a!.media!.title!.romaji || a!.media!.title!.native!).toLowerCase();
            const bTitle = (b!.media!.title!.english || b!.media!.title!.romaji || b!.media!.title!.native!).toLowerCase();
            if (aTitle < bTitle) return -1;

            if (aTitle > bTitle) return 1;

            return 0;
          });

          for (let i = 0; i < airingSchedules.length; i += chunkSize) fields.push(airingSchedules.slice(i, i + chunkSize));

          // ^ Create pages with 5 airing anime per page and then make them into embeds
          const pageList: EmbedBuilder[] = [];
          fields.forEach((fieldSet, index) => {
            const embed = new EmbedBuilder();
            embed.setTitle(`Airing between ${day.toDateString()} to ${nextWeek.toDateString()}`);
            embed.setColor("Green");
            embed.setFooter(Footer(response.headers));

            fieldSet.forEach((field) => {
              if (!field) return;
              const { media, episode, airingAt } = field;

              embed.addFields({

                name: `${SeriesTitle(media as Media)}`,
                value: `> **[EP - ${episode}]** :airplane: ${new Date(airingAt * 1000) > new Date() ? `Going to air <t:${airingAt}:R>` : `Aired <t:${airingAt}:R>`}`,
                inline: false,
              });
            });
            pageList.push(embed);
          });

          BuildPagination(interaction, pageList).paginate();
        } else {
          interaction.reply({
            embeds: [EmbedError("No airing anime found.")],
          });
        }
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
} satisfies Command;
