import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import { footer, graphQLRequest, SeriesTitle, getOptions } from "#utils/index";

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
    const { query: query } = getOptions<{ query: string }>(interaction.options, ["query"]);

    const {
      data: { Studio: data },
      headers,
    } = await graphQLRequest("Studio", { query });

    if (!data || !data.media?.nodes) throw new Error("Couldn't find any data.", { cause: { query } });

    let animes: string[] | string = [];
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

  },
} satisfies Command;
