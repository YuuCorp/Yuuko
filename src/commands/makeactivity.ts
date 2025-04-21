import { footer, graphQLRequest, getSubcommand, YuukoError } from "#utils/index";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwRequireALToken } from "#middleware/alToken";
import type { Command } from "#structures/index";
import { db } from "#database/db";

const name = "makeactivity";
const usage = "makeactivity <list | status>";
const description = "Allows you to make an Anilist activity from Discord. Requires an AniList token.";

export default {
  name,
  usage,
  description,
  middlewares: [mwRequireALToken],
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
      const alUser = await db.query.anilistUser.findFirst({ where: (user, { eq }) => eq(user.anilistId, Number(interaction.user.id)) });
      if (!alUser) return interaction.respond([{ name: "No Anilist account linked", value: "No Anilist account linked" }]);

      const vars = { userId: +alUser.anilistId };
      const response = (await graphQLRequest("ListQuery", vars)).data;
      if (!response.User || !response.User.mediaListOptions) return interaction.respond([{ name: "No Anilist account linked", value: "No Anilist account linked" }]);
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

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isChatInputCommand()) return;
    // const type = (interaction.options as CommandInteractionOptionResolver).getSubcommand() <- from auth command
    const type = getSubcommand<["list", "status"]>(interaction.options);
    if (!type || (type != "status" && type != "list")) throw new YuukoError(`Please use either the status or list subcommand. (Yours was "${type}")`);

    if (type === "status") {
      const vars = { text: getEmojis(interaction.options.getString("text", true)), asHtml: true };
      if (!interaction.ALtoken) throw new YuukoError("No Anilist token found.", null, true);

      const {
        data: { SaveTextActivity: data },
        headers,
      } = await graphQLRequest("SaveTextActivity", vars, interaction.ALtoken);
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
      const listOptions = ["mediaid", "status", "hide", "private", "lists", "score", "progress"].filter((x) => interaction.options.get(x));

      const vars: { [key: string]: any } = {};
      for (const option of listOptions) vars[option] = interaction.options.get(option)?.value;

      if (!interaction.ALtoken) throw new YuukoError("No Anilist token found.", null, true);

      const {
        data: { SaveMediaListEntry: data },
        headers,
      } = await graphQLRequest("SaveMediaList", vars, interaction.ALtoken);
      if (!data) throw new YuukoError("Something went wrong while making the activity.", null, true);
      const mediaListActivity = new EmbedBuilder()
        .setURL(`https://anilist.co/${data?.media?.type || ""}/${data?.mediaId || ""}`)
        .setTitle(`${data.user?.name || "Unknown"} added ${data?.media?.title?.userPreferred || "Unknown"} to ${data?.status || "Unknown"}!`)
        .setFooter(footer(headers));
      if (data.media && data.media.bannerImage) mediaListActivity.setImage(data.media.bannerImage);

      return void interaction.reply({ embeds: [mediaListActivity] });

    }
  },
} satisfies Command;

function getEmojis(messageString: string) {
  const matchedResults = Array.from(messageString.matchAll(/<\w*:.*?:(\d+)>/gm), (x) => x[1]);
  const filteredResults = matchedResults.map((x) => `img22(https://cdn.discordapp.com/emojis/${x})`);
  for (let i = 0; i < matchedResults.length; i++) {
    messageString = messageString.replace(/<\w*:.*?:(\d+)>/, filteredResults[i] || "");
  }
  return messageString;
}
