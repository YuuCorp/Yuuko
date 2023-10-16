// use esm

import type Discord from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import type { Command } from '../Structures'
import { getOptions } from '../Utils'
import { EmbedError } from '../Utils/EmbedError'
import AnimeCmd from './anime'

const humanizeDuration = require('humanize-duration')

const name = 'trace'
const usage = 'trace <image attachment>'
const description = 'Gets an anime from an image.'

interface TraceMoeReturnType {
  anilist: number
  filename: string
  from: number
  to: number
  episode: number
  similarity: number
  video: string
  image: string
}

export default {
  name,
  usage,
  description,
  type: 'Anilist',
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addAttachmentOption(option => option.setName('image').setDescription('Attach the image of the anime.').setRequired(true)),

  run: ({ interaction, client }) => {
    if (!interaction.isCommand())
      return
    const { image } = getOptions<{ image: Discord.Attachment }>(interaction.options, ['image'])

    // Send and axios request to trace.moe with an image the user attached
    axios
      .get(`https://api.trace.moe/search?cutBorders&url=${image.url}`)
      .then(async (res: { data: { result: TraceMoeReturnType[] } }) => {
        // If the request was successful
        const match = res.data.result[0]
        if (!match)
          return interaction.reply({ embeds: [EmbedError('No results found.', { url: image.url })] })
        const hookdata = {
          title: match.filename,
          id: match.anilist,
          image: image.url,
          fields: [
            { name: '\u200B', value: '\u200B' },
            { name: 'In Episode', value: `${match.episode || 'Full'} (${humanizeDuration(match.from * 1000, { round: true }).toString()} in)`, inline: true },
            { name: 'Similarity', value: match.similarity.toFixed(2).toString(), inline: true },
            { name: 'Video', value: `[Link](${match.video})`, inline: true },
          ],
        }
        AnimeCmd.run<any>({ interaction, client, args: {}, hook: true, hookdata })
      })
      .catch((error: any) => {
        // ^ log axios request status code and error
        if (error.response)
          console.log(error.response.data.errors)
        else console.error(error)

        interaction.reply({ embeds: [EmbedError(error, { url: image.url })] })
      })
  },
} satisfies Command
