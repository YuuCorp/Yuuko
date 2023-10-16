import { EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions } from "../Utils";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { mwRequireALToken } from "../Middleware/ALToken";
import { AnilistUser } from "#Models/AnilistUser.ts";
import type { Command } from "../Structures";

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
      const alUser = await AnilistUser.findOne({ where: { discord_id: interaction.user.id } });
      if (!alUser) return interaction.respond([{ name: "No Anilist account linked", value: "No Anilist account linked" }]);

      const vars = { userId: +alUser.anilist_id };
      const response = (await GraphQLRequest("ListQuery", vars)).data;
      if (!response.User || !response.User.mediaListOptions) return interaction.respond([{ name: "No Anilist account linked", value: "No Anilist account linked" }]);
      let animeLists: {
        name: string;
        value: string; 
      }[] = [];
      let mangaLists: {
        name: string;
        value: string;
      }[]  = [];
      if (response.User.mediaListOptions) {
        if(response.User.mediaListOptions.animeList?.customLists)
          animeLists = response?.User.mediaListOptions.animeList.customLists.map((list) => {
            return { name: `${list} (Anime)`, value: list! };
          });
        if(response.User.mediaListOptions.mangaList?.customLists)
          mangaLists = response?.User.mediaListOptions!.mangaList.customLists.map((list) => {
            return { name: `${list} (Manga)`, value: list! }
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
    const type = interaction.options.getSubcommand();
    if (!type || (type != "status" && type != "list")) return void interaction.reply({ embeds: [EmbedError(`Please use either the status or list subcommand. (Yours was "${type}")`, null, false)], ephemeral: true });

    if (type === "status") {
      const vars = { text: getOptions<{ text: string }>(interaction.options, ["text"]) };
      GraphQLRequest("TextActivity", { asHtml: true} )
        .then((response) => {
          const data = response?.data;
          const statusActivity = new EmbedBuilder()
            .setURL(data?.siteUrl || "Unknown")
            .setTitle(`${data.user?.name || "Unknown"} made a new activity!`)
            .setDescription(data?.text || "Unknown")
            .setFooter(Footer(response.headers));

          return interaction.reply({ embeds: [statusActivity] });
        })
        .catch((error) => {
          console.error(error);
          interaction.reply({ embeds: [EmbedError(error, vars)] });
        });
    }

    if (type === "list") {
      const vars = {}; 
      const listOptions = ["hide", "private", "lists", "score", "progress"]
      /* // should it be something like this instead for dynamic fetching?
        {
          name: "hide",
          type: boolean,
        }
      */
      listOptions.filter((x) => interaction.options.get(x));
      for (const option of listOptions) {
        /*
          vars[option.name] = option.value;
          if (option.name === "lists") vars[option.name] = [option.value];
        */
       vars[option] = 
      }

      GraphQLRequest('MediaList', vars, interaction.ALtoken)
        .then((response, headers) => {
          const data = response?.SaveMediaListEntry;
          const mediaListActivity = new EmbedBuilder()
            .setURL(`https://anilist.co/${data?.media?.type || ""}/${data?.mediaId || ""}`)
            .setTitle(`${data?.user.name || "Unknown"} added ${data?.media?.title?.userPreferred || "Unknown"} to ${data?.status || "Unknown"}!`)
            .setImage(data?.media?.bannerImage)
            .setFooter(Footer(headers));

          return interaction.reply({ embeds: [mediaListActivity] });
        })
        .catch((error) => {
          console.error(error);
          interaction.reply({ embeds: [EmbedError(error, vars)] });
        });
    }
  },
} satisfies Command;

function getEmojis(messageString: string) {
  const matchedResults = Array.from(messageString.matchAll(/<\w*:.*?:(\d+)>/gm), (x) => x[1]);
  const filteredResults = matchedResults.map((x) => `img22(https://cdn.discordapp.com/emojis/${x})`);
  for (let i = 0; i < matchedResults.length; i++)
    messageString = messageString.replace(/<\w*:.*?:(\d+)>/, filteredResults[i]);

  return messageString;
}
