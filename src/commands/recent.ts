import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { mwGetUserEntry } from "#middleware/userEntry";
import Jimp from "jimp";
import type { Command } from "#structures/index";
import { CommandCategories, embedError, graphQLRequest, SeriesTitle, getOptions } from "#utils/index";
import type { MediaList, MediaType, RecentChartQuery, RecentChartQueryVariables } from "#graphQL/types";

const name = "recent";
const usage = "recent";
const description = "Shows the 9 most recent watched/read media of the user in a image grid.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: CommandCategories.Anilist,
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("type").setDescription("The type of media to search for").addChoices({ name: "Anime", value: "ANIME" }, { name: "Manga", value: "MANGA" }).setRequired(true))
    .addStringOption((option) => option.setName("user").setDescription("The user to search for").setRequired(false)),

  run: async ({ interaction, client }): Promise<void> => {

    const { user: userName } = getOptions<{ user: string }>(interaction.options, ["user"]);
    const { type } = getOptions<{ type: MediaType }>(interaction.options, ["type"]);

    const vars: RecentChartQueryVariables = {
      perPage: 9,
      type: type,
    };

    if (!userName) {
      // We try to use the one the user set
      try {
        if (!interaction.alID) return void interaction.editReply({ embeds: [embedError(`You have yet to set an AniList token.`)] });
        vars.userId = interaction.alID;
      } catch (error) {
        console.error(error);
        return void interaction.editReply({ embeds: [embedError(`You have yet to set an AniList token.`)] });
      }
    } else {
      vars.user = userName;
    }

    try {
      const {
        data: { Page: data },
      } = await graphQLRequest("RecentChart", vars, interaction.ALtoken);
      if (!data?.mediaList) return void interaction.editReply({ embeds: [embedError("Unable to find specified user", vars)] });
      interaction.editReply({ embeds: [{ description: "Creating image..." }] });
      const canvas = new Jimp(999, 999);

      let x = 0;
      let y = 0;

      for (const item of data.mediaList) {
        const media = item?.media;
        if (!media || !item) continue;
        const cover = media.coverImage?.extraLarge || "https://i.imgur.com/Hx8474m.png"; // Placeholder image
        const canvasImage = await Jimp.read(cover);

        const width = 333;
        const height = (width / canvasImage.getWidth()) * canvasImage.getHeight();
        canvasImage.resize(width, height);
        const infoRectangle = new Jimp(width, 60, "#000000bf");

        const useFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

        const title = SeriesTitle(media.title || undefined);
        const status = parseStatus(item, type);
        if (status) infoRectangle.print(useFont, 0, 0, { text: status, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, width, 40);
        infoRectangle.print(useFont, 0, 20, { text: title, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, width, 40);
        canvas.composite(canvasImage, x, y);
        canvas.composite(infoRectangle, x, y + width - 60);
        x += width;
        if (x >= 999) {
          x = 0;
          y += width;
        }
      }

      const canvasResult = await canvas.getBufferAsync(Jimp.MIME_PNG);
      if (!canvasResult) return void interaction.editReply({ embeds: [embedError("Encountered an error whilst trying to create the image.", vars)] });
      const attachment = new AttachmentBuilder(canvasResult, { name: "recent.png" });
      return void interaction.editReply({ files: [attachment], embeds: [] });
    } catch (error: any) {
      return void interaction.editReply({ embeds: [embedError(error, vars)] });
    }
  },
} satisfies Command;

function parseStatus(data: Pick<MediaList, "progress" | "status">, mediaType: MediaType) {
  if (!data.status) return "Unknown";
  switch (data.status) {
    case "CURRENT":
      if (mediaType === "ANIME") return `Watched Episode ${data.progress} of`;
      else return `Read Chapter ${data.progress} of`;
    case "PLANNING":
      if (mediaType === "ANIME") return `Planning to Watch`;
      else return `Planning to Read`;
    case "COMPLETED":
      return `Completed`;
    case "PAUSED":
      return `Paused`;
    case "DROPPED":
      return `Dropped`;
    case "REPEATING":
      if (mediaType === "ANIME") return `Re-watching`;
      else return `Re-reading`;
  }
}
