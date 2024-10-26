import { SlashCommandBuilder, EmbedBuilder, type ColorResolvable } from "discord.js";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { Command } from "#structures/index";
import { graphQLRequest, footer, getOptions } from "#utils/index";
import type { UserQueryVariables } from "#graphQL/types";

const name = "user";
const usage = "user <?anilist name>";
const description = "Searches for an anilist user and displays information about them.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setRequired(false).setDescription("The user to search for")),
  // .setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {

    const { query: anilistUser } = getOptions<{ query: string }>(interaction.options, ["query"]);

    let vars: UserQueryVariables = {
      username: anilistUser,
    };

    // If the user hasn't provided a user
    if (!anilistUser) {
      // We try to use the one the user set
      if (interaction.alID) {
        vars = { userid: interaction.alID };
      } else {
        throw new Error("You have yet to set an AniList token.");
      }
    }

    // Make the HTTP Api request
    const { data, headers } = await graphQLRequest("User", vars, interaction.ALtoken);
    const response = data.User;

    if (!response) throw new Error("Couldn't find any data.", { cause: vars });

    const titleEmbed = new EmbedBuilder()
      // TODO: Fix depricated function calls 101
      .setAuthor({ name: response.name, iconURL: "https://anilist.co/img/icons/android-chrome-512x512.png", url: response.siteUrl || "https://anilist.co" })
      .setFooter(footer(headers));

    if (response.avatar?.large) titleEmbed.setThumbnail(response.avatar.large);
    if (response.bannerImage) titleEmbed.setImage(response.bannerImage);

    const statistics = response.statistics;

    if (statistics) {
      titleEmbed.addFields(
        { name: "< Anime >\n\n", value: `**Watched:** ${statistics.anime?.count.toString()}\n**Average score**: ${statistics.anime?.meanScore.toString()}`, inline: true },
        { name: "< Manga >\n\n", value: `**Read:** ${statistics.manga?.count.toString()}\n**Average score**: ${statistics.manga?.meanScore.toString()}`, inline: true },
      );
    }

    let userColor: ColorResolvable | null;
    const profileColor = response.options?.profileColor;

    if (profileColor) {
      userColor = profileColor.charAt(0).toUpperCase() + profileColor.slice(1);

      if (profileColor === "pink") userColor = "LuminousVividPink";
      if (profileColor === "gray") userColor = "Grey";
      // this is just cancer
      // re: yeah, this is cancer
      titleEmbed.setColor(userColor as ColorResolvable);
    }
    interaction.editReply({ embeds: [titleEmbed] });

  },
} satisfies Command;
