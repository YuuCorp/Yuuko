import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import getOptions from "#utils/getOptions";
import type { MediaType } from "#graphQL/types";
import { YuukoError } from "#utils/types";
import { mwRequireALToken } from "#middleware/alToken";
import { graphQLRequest } from "#utils/graphQLRequest";
import { SeriesTitle } from "#utils/common";
import { ptr, toBuffer } from "bun:ffi";

const name = "pixeljumble";
const usage = "/pixeljumble";
const description = "Play a game where you have to guess an anime or manga based off hints and a pixelated cover.";

export default {
    name,
    usage,
    description,
    middlewares: [mwRequireALToken],
    commandType: "Anilist",
    withBuilder: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption((option) =>
            option
                .setName("type")
                .setRequired(true)
                .setDescription("The media type you want the game to choose")
                .addChoices(
                    { name: "Anime", value: "ANIME" },
                    { name: "Manga", value: "MANGA" }
                )
        ),

    // for Rust:
    // https://github.com/dylanleclair/pixels/blob/24688f58aae9b8b2b0fc3046687ebea0514c3061/src/main.rs#L48
    run: async ({ interaction, client }): Promise<void> => {
        const { type } = getOptions<{ type: MediaType }>(interaction.options, ["type"]);

        if (type != "ANIME" && type != "MANGA") throw new YuukoError(`Please specify either manga, or anime as your content type. (Yours was "${type}")`);

        const vars = { type, userId: interaction.alID };
        const { data: { MediaListCollection: data } } = await graphQLRequest("PixelJumble", vars);

        if (!data || !data.lists || data.lists.length < 1) throw new YuukoError("Couldn't find any data from the user specified.", vars);

        data.lists = data.lists.filter(list => list && list.name !== "Planning");
        const allMediaItems = data.lists
            .filter((list): list is NonNullable<typeof list> => list != null && list.name !== "Planning")
            .flatMap(list => list.entries);

        const random = Math.floor(Math.random() * Math.floor(allMediaItems.length));
        const entry = allMediaItems[random]!;

        const title = SeriesTitle(entry.media?.title);
        const coverImage = entry.media?.coverImage?.large || "https://i.imgur.com/Hx8474m.png";

        const lib = client.modules.getModule("modules");

        await interaction.reply({ embeds: [{ description: "Creating image..." }] });

        const pixelationLevel = 1;

        const enc = new TextEncoder();
        const encodedImgUrl = enc.encode(coverImage);
        const urlPtr = ptr(encodedImgUrl);

        let originalImgPtr = null;
        let pixelatedImgPtr = null;
        let pixelatedImgBufferSize = null;

        try {
            originalImgPtr = lib.symbols.GetImage(urlPtr);
            if (!originalImgPtr) throw new YuukoError("Fetching image in Rust experienced an error and returned an invalid pointer");

            const pixelatedImgBuffer = new Uint32Array(1);
            let pixelatedImgPtr = lib.symbols.PixelateImage(originalImgPtr, pixelationLevel, pixelatedImgBuffer);

            if (!pixelatedImgPtr) throw new YuukoError("Pixelating image in Rust experienced an error and returned an invalid pointer");

            pixelatedImgBufferSize = pixelatedImgBuffer[0];
            if (pixelatedImgBufferSize === undefined || pixelatedImgBufferSize === 0) throw new YuukoError("Rust module experienced an error and returned an invalid buffer size");
            const buffer = toBuffer(pixelatedImgPtr, 0, pixelatedImgBufferSize);

            if (!buffer) throw new YuukoError("Encountered an error whilst trying to create the image buffer.");
            const attachment = new AttachmentBuilder(buffer, { name: "output.png" });
            await interaction.editReply({ files: [attachment], embeds: [] });
        } finally {
            if (originalImgPtr) lib.symbols.FreeRgbaImage(originalImgPtr);

            if (pixelatedImgPtr && pixelatedImgBufferSize)
                lib.symbols.FreeImageBuffer(pixelatedImgPtr, pixelatedImgBufferSize);
        }

    },
} satisfies Command;
