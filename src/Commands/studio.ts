import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../Structures";
import { EmbedError, Footer, GraphQLRequest, SeriesTitle, getOptions } from "../Utils";

const name = 'studio'
const usage = 'studio <?>'
const description = 'Searches for an studio and displays a list of their anime'

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option => option.setName('query').setDescription('The query to search for').setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    const { query: query } = getOptions<{ query: string }>(interaction.options, ["query"])


    GraphQLRequest("Studio", { query })
      .then((response) => {
        const data = response.data.Studio;
        if (data) {
          let animes: string[] | string = []
          if(!data.media?.nodes) return void interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, { query })] });
          for (const anime of data.media.nodes) animes = animes.concat(`[${SeriesTitle(anime?.title || undefined)}]` + `(https://anilist.co/anime/${anime!.id})`)

          animes = animes.toString().replaceAll(',', '\n')

          const studioEmbed = new EmbedBuilder()
            // .setThumbnail(data.image.large)
            .setTitle(`${data.name} | ${data.favourites} favourites`)
            .setDescription(`\n${animes}`)
            .setURL(data.siteUrl || 'https://anilist.co')
            .setColor('Green')
            .setFooter(Footer(response.headers))

          // data.description.split("<br>").forEach(line => titleEmbed.addField(line, "", true))
          interaction.reply({ embeds: [studioEmbed] })
        }
        else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, { query })] })
        }
      })
      .catch((error) => {
        console.error(error)
        interaction.reply({ embeds: [EmbedError(error, { query })] })
      })
  },
} satisfies Command
