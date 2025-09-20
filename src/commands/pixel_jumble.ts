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

    run: async ({ interaction, client }): Promise<void> => {
        const { type } = getOptions<{ type: MediaType }>(interaction.options, ["type"]);

        if (type != "ANIME" && type != "MANGA") throw new YuukoError(`Please specify either manga, or anime as your content type. (Yours was "${type}")`);

        const msg = await interaction.deferReply({ withResponse: true });

        const { data: viewer } = await graphQLRequest("Viewer", {}, interaction.ALtoken);
        if (!viewer) throw new YuukoError("Couldn't fetch your profile using your token to get an entry");

        const statistics = viewer.Viewer?.statistics;
        const totalSize = type === "ANIME" ? statistics?.anime?.count : statistics?.manga?.count;;

        if (!totalSize) throw new YuukoError(`We could not find enough entries in your list for the specified media type (got ${totalSize})`)

        const vars = { type, userId: interaction.alID, chunk: Math.floor(Math.random() * totalSize) };
        const { data: { MediaListCollection: data } } = await graphQLRequest("PixelJumble", vars);

        if (!data || !data.lists || data.lists.length < 1) throw new YuukoError("Couldn't find any data from the user specified.", vars);

        const allMediaItems = data.lists
            .flatMap(list => list?.entries);

        const random = Math.floor(Math.random() * Math.floor(allMediaItems.length));
        const mediaEntry = allMediaItems[random]!.media;

        if (!mediaEntry) throw new YuukoError("Error fetching media entry from list");

        const title = SeriesTitle(mediaEntry.title);
        const coverImage = mediaEntry.coverImage?.large || "https://i.imgur.com/Hx8474m.png";

        const lib = client.modules.getModule("modules");

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

        const collector = createButtonCollector(interaction, customIDs, msg, { time: 30_000 });

        const possibleHints: string[] = [];

        const { year: startYear, month: startMonth, day: startDay } = mediaEntry.startDate ?? {};
        if (startYear !== null) possibleHints.push(`Has a start date of **${startYear}-${startMonth}-${startDay}**`);
        if (mediaEntry.source) possibleHints.push(`Has a source of **${mediaEntry.source}**`);
        if (mediaEntry.genres?.length) possibleHints.push(`Has genres **${mediaEntry.genres.join(", ")}**`);
        if (mediaEntry.popularity) possibleHints.push(`Has a popularity of **${mediaEntry.popularity}**`);
        if (mediaEntry.averageScore) possibleHints.push(`Has an average score of **${mediaEntry.averageScore}%**`);
        if (mediaEntry.characters?.edges?.length) possibleHints.push(`Has a character named **${selectRandom(mediaEntry.characters.edges)!.name}**`);
        if (mediaEntry.staff?.edges?.length) {
            const randomStaff = selectRandom(mediaEntry.staff.edges)!;
            possibleHints.push(`Has **${randomStaff.node?.name?.full}** who worked as **${randomStaff.role}**`);
        }
        if (mediaEntry.countryOfOrigin) possibleHints.push(`Has an origin of ${mediaEntry.countryOfOrigin}`);

        let hints = `- ${selectRandom(possibleHints)}\n- ${selectRandom(possibleHints)}\n- ${selectRandom(possibleHints)}\n`;

        const embed = new EmbedBuilder()
            .setTitle(`Pixel Jumble - Guess the ${type.toLowerCase()}`)
            .setDescription(`${hints}`);

        await interaction.editReply({ files: [attachment], components, embeds: [embed] })

        let forfeit = false;
        collector?.on("collect", async (i) => {
            if (!i.isButton()) return;

            switch (i.customId) {
                case "hint":
                    pixelationLevel = Math.max(0, pixelationLevel - 1.5);

                    if (pixelationLevel < 1 || originalImgPtr === null) {
                        i.deferUpdate();
                        break;
                    };

                    if (!i.deferred) await i.deferUpdate();

                    [pixelatedImgPtr, pixelatedImgBufferSize] = pixelateImage(lib, originalImgPtr, pixelationLevel);
                    attachment = getAttachment(pixelatedImgPtr, pixelatedImgBufferSize);

                    if (pixelationLevel === 5.5) hints += `- ${selectRandom(possibleHints)}\n`; // First hint
                    else if (pixelationLevel === 4) hints += `- ${selectRandom(possibleHints)}\n`; // Second hint
                    else if (pixelationLevel === 2.5) hints += `- ${selectRandom(possibleHints)}\n`; // Third hint
                    else if (pixelationLevel === 1) hints += `- **${scrambleSentence(title)}**`; // Fourth hint

                    embed.setDescription(hints);

                    if (pixelationLevel === 1) {
                        buttonList[1]?.setDisabled(true)
                        components[0]!.setComponents(buttonList);
                        await interaction.editReply({ files: [attachment], components, embeds: [embed] })
                        break;
                    }

                    await interaction.editReply({ files: [attachment], embeds: [embed] })

                    break;
                case "forfeit":
                    forfeit = true;
                    collector.stop();
                    break;
            }
        })

        collector?.on("end", async () => {
            [pixelatedImgPtr, pixelatedImgBufferSize] = pixelateImage(lib, originalImgPtr, 1);
            attachment = getAttachment(pixelatedImgPtr, pixelatedImgBufferSize);

            embed.setDescription(`${hints}\n\n**${interaction.user.displayName}** ${forfeit ? "gave up" : "failed to guess in time"}!\nAnswer was **${title}**`)
            await interaction.editReply({ files: [attachment], components: [], embeds: [embed] })

            if (originalImgPtr) {
                lib.symbols.FreeRgbaImage(originalImgPtr);
                originalImgPtr = null;
            }

            if (pixelatedImgPtr && pixelatedImgBufferSize) {
                lib.symbols.FreeImageBuffer(pixelatedImgPtr, pixelatedImgBufferSize);
                pixelatedImgPtr = null;
                pixelatedImgBufferSize = null;
            }
        })


    },
} satisfies Command;

function pixelateImage<T extends Library<ModuleSymbols["modules"]>>(lib: T, originalImg: Pointer | null, pixelationLevel: number): [Pointer, number] {
    if (!originalImg) throw new YuukoError("Original image pointerr is null when trying to pixelate it");

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

function scrambleSentence(input: string) {
    const scrambleWord = (word: string) => word
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return input.split(" ").map(scrambleWord).join(" ").toLocaleUpperCase();
}

function selectRandom<T>(source: T[]) {
    if (source.length === 0) return undefined;
    const idx = Math.floor(Math.random() * source.length);
    return source.splice(idx, 1)[0];
}