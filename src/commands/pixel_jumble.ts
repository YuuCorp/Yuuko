import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import getOptions from "#utils/getOptions";
import type { MediaType } from "#graphQL/types";
import { YuukoError } from "#utils/types";
import { mwRequireALToken } from "#middleware/alToken";
import { graphQLRequest } from "#utils/graphQLRequest";
import { SeriesTitle } from "#utils/common";
import { ptr, toBuffer, type Library, type Pointer } from "bun:ffi";
import type { ModuleSymbols } from "#structures/modules";
import { createButtonCollector } from "#utils/buildPagination";

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

        const msg = await interaction.reply({ embeds: [{ description: "Preparing the game..." }], withResponse: true });

        const enc = new TextEncoder();
        const encodedImgUrl = enc.encode(coverImage);
        const urlPtr = ptr(encodedImgUrl);

        let pixelationLevel = 7;
        let originalImgPtr: Pointer | null = null;
        let pixelatedImgPtr: Pointer | null = null;
        let pixelatedImgBufferSize: number | null = null;

        originalImgPtr = lib.symbols.GetImage(urlPtr);
        if (!originalImgPtr) throw new YuukoError("Fetching image in Rust experienced an error and returned an invalid pointer");

        [pixelatedImgPtr, pixelatedImgBufferSize] = pixelateImage(lib, originalImgPtr, pixelationLevel);

        let attachment = getAttachment(pixelatedImgPtr, pixelatedImgBufferSize);

        const buttonList = [
            new ButtonBuilder().setCustomId('guess').setLabel('Guess').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('hint').setLabel('Next Hint').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('forfeit').setLabel('Give Up').setStyle(ButtonStyle.Primary),
        ];
        const customIDs = new Set(['guess', 'hint', 'forfeit']);
        const components = [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList)];

        const collector = createButtonCollector(interaction, customIDs, msg);

        interaction.editReply({ files: [attachment], components, embeds: [] })

        collector?.on("collect", async (i) => {
            if (!i.isButton()) return;

            switch (i.customId) {
                case "hint":
                    pixelationLevel = Math.max(1, pixelationLevel - 1.5);

                    if (pixelationLevel <= 1 || originalImgPtr === null) break;
                    if (!i.deferred) await i.deferUpdate();

                    [pixelatedImgPtr, pixelatedImgBufferSize] = pixelateImage(lib, originalImgPtr, pixelationLevel);
                    attachment = getAttachment(pixelatedImgPtr, pixelatedImgBufferSize);

                    interaction.editReply({ files: [attachment], components })

                    break;
            }


        })

        collector?.on("end", () => {
            if (originalImgPtr) lib.symbols.FreeRgbaImage(originalImgPtr);

            if (pixelatedImgPtr && pixelatedImgBufferSize)
                lib.symbols.FreeImageBuffer(pixelatedImgPtr, pixelatedImgBufferSize);
        })


    },
} satisfies Command;

function pixelateImage<T extends Library<ModuleSymbols["modules"]>>(lib: T, originalImg: Pointer, pixelationLevel: number): [Pointer, number] {
    const pixelatedImgBuffer = new Uint32Array(1);
    const pixelatedImgPtr = lib.symbols.PixelateImage(originalImg, pixelationLevel, pixelatedImgBuffer);

    if (!pixelatedImgPtr)
        throw new YuukoError("Pixelating image in Rust experienced an error and returned an invalid pointer");

    const pixelatedImgBufferSize = pixelatedImgBuffer[0];
    if (pixelatedImgBufferSize === undefined || pixelatedImgBufferSize === 0)
        throw new YuukoError("Rust module experienced an error and returned an invalid buffer size");

    return [pixelatedImgPtr, pixelatedImgBufferSize];
}

function getAttachment(imgPtr: Pointer, bufferSize: number) {
    const buffer = toBuffer(imgPtr, 0, bufferSize);
    if (!buffer) throw new YuukoError("Encountered an error whilst trying to create the image buffer.");
    const attachment = new AttachmentBuilder(buffer, { name: "output.png" });

    return attachment;
};