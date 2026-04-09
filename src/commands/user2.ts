import {
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MediaGalleryBuilder,
  MessageFlags,
  SectionBuilder,
  SlashCommandBuilder,
  resolveColor,
  type ColorResolvable,
} from "discord.js";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { Command } from "#structures/index";
import { graphQLRequest, YuukoError, getStringOption } from "#utils/index";
import type { UserQuery, UserQueryVariables } from "#graphQL/types";

const name = "user2";
const usage = "user2 <?anilist name>";
const description = "[V2] Searches for an anilist user and displays a redesigned profile card.";

type UserData = NonNullable<UserQuery["User"]>;

// -------------------------------------------------------------------------
// Stats formatter — this controls how the stats section looks.
// Returns two markdown blocks (anime, manga); either may be null if the
// user has no entries. Edit freely to reshape the feel.
// Discord markdown cheat sheet: **bold**, *italic*, `code`, ⭐ / emojis,
// -# small caption text, > blockquote, <t:UNIX:R> relative time.
// -------------------------------------------------------------------------
function formatUserStats(user: UserData): { anime: string | null; manga: string | null } {
  const a = user.statistics?.anime;
  const m = user.statistics?.manga;

  let animeBlock: string | null = null;
  if (a && a.count > 0) {
    const days = (a.minutesWatched / 60 / 24).toFixed(1);
    const sigma = a.standardDeviation ? ` (σ ${a.standardDeviation.toFixed(1)})` : "";
    const lines: string[] = [
      `**Anime**`,
      `${a.count} total · ${days} days · ${a.episodesWatched} eps · ⭐ ${a.meanScore.toFixed(1)}${sigma}`,
    ];
    const meta: string[] = [];
    if (a.genres?.[0]?.genre) meta.push(`Top genre: **${a.genres[0].genre}**`);
    if (a.formats?.[0]?.format) meta.push(`Top format: **${a.formats[0].format}**`);
    if (meta.length) lines.push(meta.join(" · "));
    animeBlock = lines.join("\n");
  }

  let mangaBlock: string | null = null;
  if (m && m.count > 0) {
    const sigma = m.standardDeviation ? ` (σ ${m.standardDeviation.toFixed(1)})` : "";
    const lines: string[] = [
      `**Manga**`,
      `${m.count} total · ${m.chaptersRead} chapters · ${m.volumesRead ?? 0} volumes · ⭐ ${m.meanScore.toFixed(1)}${sigma}`,
    ];
    if (m.genres?.[0]?.genre) lines.push(`Top genre: **${m.genres[0].genre}**`);
    mangaBlock = lines.join("\n");
  }

  return { anime: animeBlock, manga: mangaBlock };
}

// Maps AniList's profile color names to a numeric accent color for the container.
function resolveProfileColor(profileColor: string | null | undefined): number {
  const map: Record<string, ColorResolvable> = {
    blue: "Blue",
    purple: "Purple",
    pink: "LuminousVividPink",
    orange: "Orange",
    red: "Red",
    green: "Green",
    gray: "Grey",
  };
  return resolveColor(map[profileColor ?? ""] ?? "Blurple");
}

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("username").setRequired(false).setDescription("The user to search for")),

  run: async ({ interaction }, hookData): Promise<void> => {
    const anilistUser = getStringOption(interaction, hookData, "username");

    let vars: UserQueryVariables = anilistUser ? { username: anilistUser } : {};
    if (!anilistUser) {
      if (!interaction.alID) throw new YuukoError("You have yet to set an AniList token.", { ephemeral: true });
      vars = { userid: interaction.alID };
    }

    const { data } = await graphQLRequest("User", vars, interaction.ALtoken);
    const user = data.User;
    if (!user) throw new YuukoError("Couldn't find any data.", { vars });

    const container = new ContainerBuilder().setAccentColor(resolveProfileColor(user.options?.profileColor));

    // Banner hero at the top (may be absent for some users).
    if (user.bannerImage) {
      container.addMediaGalleryComponents(
        new MediaGalleryBuilder().addItems((item) =>
          item.setURL(user.bannerImage!).setDescription(`${user.name} banner`),
        ),
      );
      container.addSeparatorComponents((sep) => sep);
    }

    // One tall section: header + anime + manga text displays, avatar accessory.
    // Consolidating them makes the section as tall as the thumbnail so nothing floats in empty space.
    const joined = user.createdAt ? `Joined <t:${user.createdAt}:D>` : "AniList Profile";
    const avatarUrl =
      user.avatar?.large ?? user.avatar?.medium ?? "https://anilist.co/img/icons/android-chrome-512x512.png";
    const { anime: animeBlock, manga: mangaBlock } = formatUserStats(user);

    const profileSection = new SectionBuilder()
      .addTextDisplayComponents((td) => td.setContent(`## ${user.name}\n-# ${joined}`))
      .setThumbnailAccessory((thumb) => thumb.setURL(avatarUrl));

    if (animeBlock) profileSection.addTextDisplayComponents((td) => td.setContent(animeBlock));
    if (mangaBlock) profileSection.addTextDisplayComponents((td) => td.setContent(mangaBlock));

    container.addSectionComponents(profileSection);

    // Link button at the bottom.
    if (user.siteUrl) {
      container.addSeparatorComponents((sep) => sep);
      container.addActionRowComponents((row) =>
        row.setComponents(
          new ButtonBuilder().setLabel("View on AniList").setStyle(ButtonStyle.Link).setURL(user.siteUrl!),
        ),
      );
    }

    await interaction.reply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  },
} satisfies Command<{ username: string }>;
