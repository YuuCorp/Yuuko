import { footer, graphQLRequest, YuukoError, getAniListUser } from "#utils/index";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwRequireAniListToken } from "#middleware/alToken";
import type { Command } from "#structures/index";

const name = "makeactivity";
const usage = "makeactivity <list | status>";
const description = "Allows you to make an Anilist activity from Discord. Requires an AniList token.";

export default {
  name,
  usage,
  description,
  middlewares: [mwRequireAniListToken],
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Make a list activity.")
        .addIntegerOption((option) => option.setName("mediaid").setRequired(true).setDescription("The Media ID of the anime/manga"))
        .addStringOption((option) =>
          option
            .setName("status")
            .setRequired(true)
            .setDescription("The status you want it added as.")
            .addChoices(
              { name: "Current", value: "CURRENT" },
              { name: "Planning", value: "PLANNING" },
              { name: "Completed", value: "COMPLETED" },
              { name: "Dropped", value: "DROPPED" },
              { name: "Paused", value: "PAUSED" },
              { name: "Repeating", value: "REPEATING" },
            ),
        )
        .addBooleanOption((option) => option.setName("hide").setDescription("Hide series from status list"))
        .addBooleanOption((option) => option.setName("private").setDescription("Make the list entry private"))
        .addStringOption((option) => option.setName("lists").setDescription("The custom list you want the series added to. (shows both manga and anime lists)").setAutocomplete(true))
        .addNumberOption((option) => option.setName("score").setDescription("The score you want to give the series."))
        .addIntegerOption((option) => option.setName("progress").setDescription("How far you've watched/read the series.")),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Make a text activity.")
        .addStringOption((option) => option.setName("text").setRequired(true).setDescription("The text to use when making the activity.")),
    ),

  async autocomplete(interaction) {
    if (!interaction.isAutocomplete()) return;
    try {
      // Get the users media lists
      const aniListUser = await getAniListUser(interaction.user.id);
      if (!aniListUser) return interaction.respond([{ name: "No Anilist account linked", value: "NaN" }]);

      const vars = { userId: +aniListUser.aniListId };
      const response = (await graphQLRequest("ListQuery", vars)).data;
      if (!response.User || !response.User.mediaListOptions) return interaction.respond([{ name: "No lists found for linked account", value: "NaN" }]);

      let animeLists: {
        name: string;
        value: string;
      }[] = [];
      let mangaLists: {
        name: string;
        value: string;
      }[] = [];

      if (response.User.mediaListOptions) {
        if (response.User.mediaListOptions.animeList?.customLists)
          animeLists = response?.User.mediaListOptions.animeList.customLists.map((list) => {
            return { name: `${list} (Anime)`, value: list! };
          });
        if (response.User.mediaListOptions.mangaList?.customLists)
          mangaLists = response?.User.mediaListOptions!.mangaList.customLists.map((list) => {
            return { name: `${list} (Manga)`, value: list! };
          });
      }
      const lists = animeLists.concat(mangaLists);
      await interaction.respond(lists);
    } catch (error) {
      console.error(error);
    }
  },

  run: async ({ interaction }, hookData): Promise<void> => {
    if (!interaction.isChatInputCommand()) return;
    const type = hookData?.subcommandType ?? interaction.options.getSubcommand() as "list" | "status";

    if (type === "status") {
      const statusData = hookData?.subcommandType === "status" ? hookData : undefined;
      const statusText = statusData?.text ?? interaction.options.getString("text", true);
      const vars = { text: getEmojis(statusText), asHtml: true };
      if (!interaction.aniListToken) throw new YuukoError("No Anilist token found.", { ephemeral: true });

      const {
        data: { SaveTextActivity: data },
        headers,
      } = await graphQLRequest("SaveTextActivity", vars, interaction.aniListToken);
      const userName = data?.user?.name || "Unknown";
      const userText = data?.text || "Unknown";
      if (!userName || !userText) return;

      const statusActivity = new EmbedBuilder()
        .setURL(data?.siteUrl || "https://anilist.co")
        .setTitle(`${userName} made a new activity!`)
        .setDescription(userText)
        .setFooter(footer(headers));

      return void interaction.reply({ embeds: [statusActivity] });
    }

    if (type === "list") {
      const listData = hookData?.subcommandType === "list" ? hookData : undefined;
      const optionKeys = ["mediaid", "status", "hide", "private", "lists", "score", "progress"] as const;

      const vars: { [key: string]: any } = {};
      for (const key of optionKeys) {
        if (listData && key in listData) {
          vars[key] = listData[key as keyof typeof listData];
        } else {
          const opt = interaction.options.get(key);
          if (opt) vars[key] = opt.value;
        }
      }

      if (!interaction.aniListToken) throw new YuukoError("No Anilist token found.", { ephemeral: true });

      const {
        data: { SaveMediaListEntry: data },
        headers,
      } = await graphQLRequest("SaveMediaList", vars, interaction.aniListToken);
      if (!data) throw new YuukoError("Something went wrong while making the activity.", { ephemeral: true });
      const mediaListActivity = new EmbedBuilder()
        .setURL(`https://anilist.co/${data?.media?.type || ""}/${data?.mediaId || ""}`)
        .setTitle(`${data.user?.name || "Unknown"} added ${data?.media?.title?.userPreferred || "Unknown"} to ${data?.status || "Unknown"}!`)
        .setFooter(footer(headers));
      if (data.media && data.media.bannerImage) mediaListActivity.setImage(data.media.bannerImage);

      return void interaction.reply({ embeds: [mediaListActivity] });

    }
  },
} satisfies Command<{
  subcommandType: "status",
  text: string
} |
{
  subcommandType: "list",
  mediaid: number,
  status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING",
  hide?: boolean,
  private?: boolean,
  lists?: string,
  score?: number,
  progress?: number,
}
>;

function getEmojis(messageString: string) {
  const matchedResults = Array.from(messageString.matchAll(/<\w*:.*?:(\d+)>/gm), (x) => x[1]);
  const filteredResults = matchedResults.map((x) => `img22(https://cdn.discordapp.com/emojis/${x})`);
  for (let i = 0; i < matchedResults.length; i++) {
    messageString = messageString.replace(/<\w*:.*?:(\d+)>/, filteredResults[i] || "");
  }
  return messageString;
}
