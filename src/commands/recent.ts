import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import { mwGetUserID } from "#middleware/userEntry";
import type { Command } from "#structures/index";
import { CommandCategories, graphQLRequest, SeriesTitle, getOptions, YuukoError } from "#utils/index";
import type { MediaList, MediaType, RecentChartQueryVariables } from "#graphQL/types";
import { ptr, toBuffer } from "bun:ffi";

const name = "recent";
const usage = "recent";
const description = "Shows the 9 most recent watched/read media of the user in a image grid.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserID],
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
    await interaction.reply({ embeds: [{ description: "Creating image..." }] });

    const parsedData = [];

    for (const item of data.mediaList) {
      const media = item?.media;
      if (!media) continue;
      const cover = media.coverImage?.large || "https://i.imgur.com/Hx8474m.png"; // Placeholder image
      const title = SeriesTitle(media.title);
      const status = parseStatus(item, type);

      parsedData.push({ status: `${status}\n${title}`, imageUrl: cover });
    }

    const lib = client.modules.getModule("modules");

    const enc = new TextEncoder();
    const rawJson = enc.encode(JSON.stringify(parsedData));
    const jsonPtr = ptr(rawJson);

    const imgPtr = lib.symbols.GenerateRecentImage(jsonPtr);
    if (!imgPtr) throw new YuukoError("Rust module experienced an error and returned an invalid pointer");

    const imgSize = toBuffer(imgPtr, 0, 4).readUint32BE();
    const buffer = toBuffer(imgPtr, 4, imgSize);

    if (!buffer) throw new YuukoError("Encountered an error whilst trying to create the image buffer.");
    const attachment = new AttachmentBuilder(buffer, { name: "recent.png" });
    await interaction.editReply({ files: [attachment], embeds: [] });

    lib.symbols.Free(imgPtr);
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
