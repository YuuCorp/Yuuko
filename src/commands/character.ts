import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import { buildPagination, footer, graphQLRequest, SeriesTitle, getOptions, YuukoError } from "#utils/index";

const name = "character";
const usage = "character <name>";
const description = "Gets a character from anilist's DB based on a search result.";

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

    const { query: charName } = getOptions<{ query: string }>(interaction.options, ["query"]);

    const {
      data: { Character: data },
      headers,
    } = await graphQLRequest("Character", { charName });

    if (!data) throw new YuukoError("Couldn't find this character.", { charName });

    const embeds = [];
    const description =
      data.description
        ?.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/~!|!~/g, "||") /* .replace(/\n\n/g, "\n") */ || "No description available.";

    const embedDate = new Date();
    for (let i = 0; i < Math.ceil(description.length / 4093); i++) {
      // ^ Fix the description by replacing and converting HTML tags
      const charEmbed = new EmbedBuilder()
        .setDescription(`${description.substring(i * 4093, (i + 1) * 4093)}...` || "No description available.")
        .addFields({
          name: "Character Info: \n",
          value: `**Age**: ${data.age || "No age specified"}\n **Gender**: ${data.gender || "No gender specified."}`,
        })
        .setURL(data.siteUrl || "https://anilist.co")
        .setColor("Green")
        .setFooter({ text: `${data.favourites} ♥ ${footer(headers).text}` })
        .setTimestamp(embedDate);

      if (data.image?.large) charEmbed.setThumbnail(data.image.large);
      if (data.name?.full) charEmbed.setTitle(data.name.full);
      // data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
      // interaction.reply({ embeds: [charEmbed] });
      embeds.push(charEmbed);
      if (data.media?.nodes && data.media.nodes.length > 0) {
        const medias = [];
        for (const media of data.media.nodes) medias.push(`[${SeriesTitle(media?.title || undefined)}](${media?.siteUrl})`);

        const charMediaEmbed = new EmbedBuilder()
          .setTitle("Series character has appeared in")
          .setDescription(medias.join("\n"))
          .setTimestamp(embedDate)
          .setFooter({ text: `${data.media.nodes.length} series ${footer(headers).text}` });

        embeds.push(charMediaEmbed);
      }
    }
    const pagination = buildPagination(interaction, embeds);
    pagination.paginate();
  },
} satisfies Command;
