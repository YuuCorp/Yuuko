import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/command";
import { embedError, footer, graphQLRequest, SeriesTitle, getOptions } from "#utils/index";

const name = "studio";
const usage = "studio <?>";
const description = "Searches for an studio and displays a list of their anime";

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    const { query: query } = getOptions<{ query: string }>(interaction.options, ["query"]);

    try {
      const {
        data: { Studio: data },
        headers,
      } = await graphQLRequest("Studio", { query });
      if (data) {
        let animes: string[] | string = [];
        if (!data.media?.nodes) return void interaction.reply({ embeds: [embedError(`Couldn't find any data.`, { query })] });
        for (const anime of data.media.nodes) animes = animes.concat(`[${SeriesTitle(anime?.title || undefined)}]` + `(https://anilist.co/anime/${anime!.id})`);

        animes = animes.toString().replaceAll(",", "\n");

        const studioEmbed = new EmbedBuilder()
          // .setThumbnail(data.image.large)
          .setTitle(`${data.name} | ${data.favourites} favourites`)
          .setDescription(`\n${animes}`)
          .setURL(data.siteUrl || "https://anilist.co")
          .setColor("Green")
          .setFooter(footer(headers));

        // data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
        interaction.reply({ embeds: [studioEmbed] });
      } else {
        return void interaction.reply({ embeds: [embedError(`Couldn't find any data.`, { query })] });
      }
    } catch (e: any) {
      console.error(e);
      interaction.reply({ embeds: [embedError(e, { query })] });
    }
  },
} satisfies Command;
