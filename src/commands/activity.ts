import { embedError, graphQLRequest, SeriesTitle, getOptions, buildPagination } from "#utils/index";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwGetUserEntry } from "#middleware/userEntry";
import type { Command } from "#structures/index";
import type { ActivityReply, UserQueryVariables } from "#graphQL/types";

const name = "activity";
const usage = "activity <user>";
const description = "Searches for an user and shows you their most recent activity.";

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("user").setDescription("The user to search for").setRequired(false)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    getOptions;
    const { user: username } = getOptions<{ user: string | undefined }>(interaction.options, ["user"]);

    const vars: UserQueryVariables = {
      username,
      userid: interaction.alID,
    };

    if (!interaction.options.get("user") && !vars.userid) return void interaction.editReply({ embeds: [embedError(`You have yet to set an AniList token. You can see the instructions with /auth help`)] });

    if (vars.username) {
      try {
        const uData = (
          await graphQLRequest("User", {
            username: vars.username,
          }, interaction.ALtoken)
        ).data.User;
        vars.userid = uData?.id;
        if (!vars.userid) throw new Error("Couldn't find user id.");
      } catch (error: any) {
        console.error(error);
        interaction.editReply({ embeds: [embedError(error, vars)] });
      }
    }

    try {
      const {
        data: { Activity: data },
      } = await graphQLRequest("Activity", vars, interaction.ALtoken);

      if (!data) {
        return void interaction.editReply({ embeds: [embedError(`Couldn't find any data.`, vars)] });
      }

      const embed = new EmbedBuilder().setTimestamp(data?.createdAt * 1000);
      const pageList = [];

      switch (data?.__typename) {
        case "ListActivity":
          embed.setURL(data?.siteUrl!);
          embed.setTitle(`Here's ${data?.user?.name?.toString() || "Unknown Name"}'s most recent activity!`);
          embed.setDescription(
            `${capitalizeString(data?.status!)} ${data?.progress?.toLowerCase() || ""} ${data?.status!.startsWith("read") || data?.status!.startsWith("watched") ? "of" : ""} **[${SeriesTitle(data.media?.title || undefined)}](${data?.media
              ?.siteUrl})**`,
          );
          embed.setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` });
          if (data.media?.bannerImage) {
            embed.setImage(data.media.bannerImage);
          } else {
            const thumbnail = data?.media?.coverImage?.large || data?.media?.coverImage?.medium;
            if (thumbnail) embed.setThumbnail(thumbnail);
          }

          pageList.push(embed);

          // I couldn't find a good way to handle the type, so I couldn't extract it to a function
          if (data.replies) {
            const replyPages = Math.ceil(data.replyCount / 25);
            for (let i = 0; i < replyPages; i++) {
              const replyEmbed = new EmbedBuilder().setTitle(`Replies to ${data?.user?.name?.toString() || "Unknown Name"}'s activity!`);

              const replies = data.replies.slice(i * 25, i * 25 + 25).map((reply) => {
                if (!reply || !reply.user || !reply.text) return;
                const replyText = anilistToMarkdown(reply.text, 1024);
                const replyName = reply.user.name

                return { name: replyName, value: replyText };
              }).filter((reply) => reply !== undefined);

              replyEmbed.addFields(replies);
              pageList.push(replyEmbed);
            }
          }

          break;

        case "TextActivity":
          embed
            .setTitle(`Here's ${data?.user?.name?.toString() || "Unknown Name"}'s most recent activity!`)
            .setDescription(anilistToMarkdown(data.text, 4096))
            .setThumbnail(data?.user?.avatar?.large!)
            .setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` });

          pageList.push(embed);

          // I couldn't find a good way to handle the type, so I couldn't extract it to a function
          if (data.replies) {
            const replyPages = Math.ceil(data.replyCount / 25);
            for (let i = 0; i < replyPages; i++) {
              const replyEmbed = new EmbedBuilder().setTitle(`Replies to ${data?.user?.name?.toString() || "Unknown Name"}'s activity!`);

              const replies = data.replies.slice(i * 25, i * 25 + 25).map((reply) => {
                if (!reply || !reply.user || !reply.text) return;
                const replyText = anilistToMarkdown(reply.text, 1024);
                const replyName = reply.user.name

                return { name: replyName, value: replyText };
              }).filter((reply) => reply !== undefined);

              replyEmbed.addFields(replies);
              pageList.push(replyEmbed);
            }
          }

          break;

        case "MessageActivity":
          break;
      }
      return void buildPagination(interaction, pageList).paginate();
    } catch (e: any) {
      console.error(e);
      interaction.editReply({ embeds: [embedError(e, vars)] });
    }
  },
} satisfies Command;

function capitalizeString(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function anilistToMarkdown(string: string | undefined | null, filterLength: number) {
  let text = string?.replace(`!~`, `||`)
    .replace(`~!`, `||`)
    .replace(/<br><br>/g, "\n")
    .replace(/<br>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n\n/g, "\n")
    .replaceAll("~", ``) || "No text found.";

  if (filterLength && text.length > filterLength) text = text.slice(0, filterLength - 3) + "...";

  return replaceUrls(text);
}

function replaceUrls(input: string): string {
  const regex = /img\d+\((.*?)\)/gi;
  const matches = input.matchAll(regex);
  let newString = input;

  for (const match of matches) {
    if (match[1]) {
      newString = newString.replace(match[0], `[<Link to image>](${match[1]})`);
    }
  }

  return newString;
}