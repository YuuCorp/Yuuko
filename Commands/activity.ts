import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../Structures";
import { EmbedError, GraphQLRequest, SeriesTitle, getOptions } from "../Utils";
import { mwGetUserEntry } from "../Middleware/UserEntry";

const name = "activity";
const usage = "activity <user>";
const description = "Searches for an user and shows you their most recent activity.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  type: "Anilist",
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("user").setDescription("The user to search for").setRequired(false)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    getOptions;
    const { user: username } = getOptions<{ user: string | undefined }>(interaction.options, ["user"]);

    const vars: Partial<{
      username: string;
      userid: string;
    }> = {
      username,
      userid: interaction.alID,
    };

    if (!interaction.options.get("user") && !vars.userid) {
      return void interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token. You can see the instructions with /auth help`)] });
    }

    try {
      const uData = (
        await GraphQLRequest("User", {
          username: vars.username,
        })
      ).data.User;
      vars.userid = uData?.id.toString();
      if (!vars.userid) throw new Error("Couldn't find user id.");
    } catch (error: any) {
      console.error(error);
      interaction.reply({ embeds: [EmbedError(error, vars)] });
    }

    GraphQLRequest("Activity", {
      userid: Number(vars.userid),
    })
      .then((response) => {
        const data = response.data.Activity!;
        if (data) {
          const embed = new EmbedBuilder().setTimestamp(data?.createdAt * 1000);
          switch (data?.__typename) {
            case "ListActivity":
              embed.setURL(data?.siteUrl!);
              if (data.media?.bannerImage) {
                embed.setImage(data.media.bannerImage);
              } else {
                const thumbnail = data?.media?.coverImage?.large || data?.media?.coverImage?.medium;
                if (thumbnail) embed.setThumbnail(thumbnail);
              }
              break;
            case "TextActivity":
              embed
                .setTitle(`Here's ${data?.user?.name?.toString() || "Unknown Name"}'s most recent activity!`)
                .setDescription(data?.text?.replace(`!~`, `||`).replace(`~!`, `||`).replaceAll("~", ``) || "No text found.")
                .setThumbnail(data?.user?.avatar?.large!)
                .setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` });

              return void interaction.reply({ embeds: [embed] });

            case "MessageActivity":
              break;
          }
          return interaction.reply({ embeds: [embed] });
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
