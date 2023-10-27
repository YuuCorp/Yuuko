import { SlashCommandBuilder, EmbedBuilder, type ColorResolvable } from "discord.js";
import { mwGetUserEntry } from "../Middleware/UserEntry";
import type { Command } from "../Structures";
import { CommandCategories, EmbedError, GraphQLRequest, Footer, getOptions } from "../Utils";

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
    .addStringOption((option) => option.setName("query").setRequired(false).setDescription("The query to search for")),
  // .setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;

    const { query: anilistUser } = getOptions<{ query: string }>(interaction.options, ["query"]);

    console.log(interaction.alID)

    let vars: Partial<{
      username: string;
      userid: number;
    }> = {
      username: anilistUser,
    };

    // If the user hasn't provided a user
    if (!anilistUser) {
      // We try to use the one the user set
      try {
        vars = { userid: interaction.alID };
      } catch (error) {
        console.error(error);
        return void interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token.`)] });
      }
    }
    // Make the HTTP Api request
    GraphQLRequest("User", vars)
      .then((response) => {
        const data = response.data.User;
        if (data) {
          const titleEmbed = new EmbedBuilder()
            // TODO: Fix depricated function calls 101
            .setAuthor({ name: data.name, iconURL: "https://anilist.co/img/icons/android-chrome-512x512.png", url: data.siteUrl || "https://anilist.co" })
            .setFooter(Footer(response.headers));

          if (data.avatar?.large) titleEmbed.setThumbnail(data.avatar.large);
          if (data.bannerImage) titleEmbed.setImage(data.bannerImage);

          const statistics = data.statistics;

          if (statistics) {
            titleEmbed.addFields(
              { name: "< Anime >\n\n", value: `**Watched:** ${statistics.anime?.count.toString()}\n**Average score**: ${statistics.anime?.meanScore.toString()}`, inline: true },
              { name: "< Manga >\n\n", value: `**Read:** ${statistics.manga?.count.toString()}\n**Average score**: ${statistics.manga?.meanScore.toString()}`, inline: true },
            );
          }

          let userColor: ColorResolvable | null;
          const profileColor = data.options?.profileColor;

          if (profileColor) {
            userColor = profileColor.charAt(0).toUpperCase() + profileColor.slice(1);

            if (profileColor === "pink") userColor = "LuminousVividPink";
            if (profileColor === "gray") userColor = "Grey";
            // this is just cancer
            // re: yeah, this is cancer
            titleEmbed.setColor(userColor as any);
          }
          interaction.reply({ embeds: [titleEmbed] });
        } else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
        }
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
} satisfies Command;
