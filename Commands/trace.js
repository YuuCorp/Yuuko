const Discord = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const HumanizeDuration = require('humanize-duration')
const Command = require('#Structures/Command.js')
const EmbedError = require('#Utils/EmbedError.js')
const Footer = require('#Utils/Footer.js')
const CommandCategories = require('#Utils/CommandCategories.js')
const AnimeCmd = require('#Commands/anime.js')

const name = 'trace'
const usage = 'trace <image attachment>'
const description = 'Gets an anime from an image.'

module.exports = new Command({
  name,
  usage,
  description,
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addAttachmentOption(option => option.setName('image').setDescription('Attach the image of the anime.').setRequired(true)),

  async run(interaction, args, run) {
    const image = interaction.options.getAttachment('image')

    // Send and axios request to trace.moe with an image the user attached
    axios
      .get(`https://api.trace.moe/search?cutBorders&url=${image.url}`)
      .then(async (res) => {
        // If the request was successful
        const match = res.data.result[0]
        AnimeCmd.run(interaction, args, run, true, {
          id: match.anilist,
          image: image.url,
          fields: [
            { name: '\u200B', value: '\u200B' },
            { name: 'In Episode', value: `${match.episode || 'Full'} (${HumanizeDuration(match.from * 1000, { round: true }).toString()} in)`, inline: true },
            { name: 'Similarity', value: match.similarity.toFixed(2).toString(), inline: true },
            { name: 'Video', value: `[Link](${match.video})`, inline: true },
          ],
        })
      })
      .catch((error) => {
        // ^ log axios request status code and error
        if (error.response)
          console.log(error.response.data.errors)
        else
          console.error(error)

        interaction.reply({ embeds: [EmbedError(error, { url: image.url })] })
      })
  },
})
