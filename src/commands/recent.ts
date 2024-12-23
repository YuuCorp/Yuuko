import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { mwGetUserEntry } from "#middleware/userEntry";
import { HorizontalAlign, Jimp, loadFont, VerticalAlign } from "jimp";
import { SANS_16_WHITE } from "jimp/fonts";
import type { Command } from "#structures/index";
import { CommandCategories, graphQLRequest, SeriesTitle, getOptions, YuukoError } from "#utils/index";
import type { MediaList, MediaType, RecentChartQueryVariables } from "#graphQL/types";

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
      if (!interaction.alID) throw new YuukoError("You have yet to set an AniList token.", null, true)
      vars.userId = interaction.alID;
    } else {
      vars.user = userName;
    }

    const {
      data: { Page: data },
    } = await graphQLRequest("RecentChart", vars, interaction.ALtoken);
    if (!data?.mediaList) throw new YuukoError("Unable to find specified user.", vars, true);
    interaction.editReply({ embeds: [{ description: "Creating image..." }] });
    const canvas = new Jimp({ width: 999, height: 999 });
    const useFont = await loadFont(SANS_16_WHITE);

    let x = 0;
    let y = 0;

    for (const item of data.mediaList) {
      const media = item?.media;
      if (!media || !item) continue;
      const cover = media.coverImage?.extraLarge || "https://i.imgur.com/Hx8474m.png"; // Placeholder image
      const canvasImage = await Jimp.read(cover);

      const width = 333;
      const height = (width / canvasImage.width) * canvasImage.height;
      canvasImage.resize({ w: width, h: height });
      const infoRectangle = new Jimp({ width, height: 60, color: "#000000bf" });


      const title = SeriesTitle(media.title || undefined);
      const status = parseStatus(item, type);
      if (status) infoRectangle.print({ maxWidth: width, maxHeight: 40, font: useFont, x: 0, y: 0, text: { text: status, alignmentX: HorizontalAlign.CENTER, alignmentY: VerticalAlign.MIDDLE } });
      infoRectangle.print({ maxWidth: width, maxHeight: 40, font: useFont, x: 0, y: 20, text: { text: title, alignmentX: HorizontalAlign.CENTER, alignmentY: VerticalAlign.MIDDLE } });
      canvas.composite(canvasImage, x, y);
      canvas.composite(infoRectangle, x, y + width - 60);
      x += width;
      if (x >= 999) {
        x = 0;
        y += width;
      }
    }

    const canvasResult = await canvas.getBuffer("image/png");
    if (!canvasResult) throw new YuukoError("Encountered an error whilst trying to create the image.");
    const attachment = new AttachmentBuilder(canvasResult, { name: "recent.png" });
    return void interaction.editReply({ files: [attachment], embeds: [] });
  }
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
