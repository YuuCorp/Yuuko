const Discord = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const ms = require('ms')
const Command = require('#Structures/Command.js')
const EmbedError = require('#Utils/EmbedError.js')
const GraphQLRequest = require('#Utils/GraphQLRequest.js')
const GraphQLQueries = require('#Utils/GraphQLQueries.js')
const Footer = require('#Utils/Footer.js')
const SeriesTitle = require('#Utils/SeriesTitle.js')
const CommandCategories = require('#Utils/CommandCategories.js')
const BuildPagination = require('#Utils/BuildPagination.js')

const name = 'airing'
const usage = 'airing <?in>'
const description = 'Gets the airing schedule for today or `period`. (e.g. `1 week` means today the next week.)'

module.exports = new Command({
  name,
  usage,
  description,
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option => option.setName('user').setDescription('The users whose list you want to use for airing anime.'))
    .addStringOption(option => option.setName('in').setDescription('Airing *in* (e.g. "1 week")')),

  async run(interaction, args, run) {
    const vars = {}
    // ^ Check if the user wants to search for a specific day
    let airingIn = 0

    const period = interaction.options.getString('in')
    const user = interaction.options.getString('user')
    const mediaIDs = []

    if (period) {
      try {
        airingIn = ms(period)
        if (!airingIn)
          throw new Error('Invalid time format.')
      }
      catch (r) {
        return interaction.reply({
          embeds: [EmbedError(`Invalid time format. See \`/help\` for more information.`, { period })],
        })
      }
    }

    if (user) {
      const tempVars = { userName: user, type: 'ANIME' }
      const response = await GraphQLRequest(GraphQLQueries.GetMediaCollection, tempVars)
      const data = response.MediaListCollection
      if (data)
        for (let i = 0; i < data.lists.length; i++) mediaIDs.push(...data.lists[i].entries.map(entry => entry.media.id))

      vars.getID = mediaIDs
    }
    // ^ Get current day and time in UTC
    const _day = new Date(Date.now() + airingIn)
    const day = new Date(Date.UTC(_day.getFullYear(), _day.getMonth(), _day.getDate()))
    const nextWeek = new Date(day.getTime())
    nextWeek.setHours(23, 59, 59, 999)
    nextWeek.setDate(day.getDate() + 7)
    vars.dateStart = Math.floor(day.getTime() / 1000)
    vars.nextDay = Math.floor(nextWeek.getTime() / 1000)
    // ^ Make the HTTP Api request
    console.log(vars, 'vars')
    GraphQLRequest(GraphQLQueries.Airing, vars)
      .then((response, headers) => {
        const data = response.Page
        const { airingSchedules } = data

        if (data) {
          const chunkSize = 5
          const fields = []
          // Sort the airing anime alphabetically by title
          airingSchedules.sort((a, b) => {
            a = a.media.title
            b = b.media.title
            const aTitle = (a.english || a.romaji || a.native).toLowerCase()
            const bTitle = (b.english || b.romaji || b.native).toLowerCase()
            if (aTitle < bTitle)
              return -1

            if (aTitle > bTitle)
              return 1

            return 0
          })

          for (let i = 0; i < airingSchedules.length; i += chunkSize)
            fields.push(airingSchedules.slice(i, i + chunkSize))

          // ^ Create pages with 5 airing anime per page and then make them into embeds
          const pageList = []
          fields.forEach((fieldSet, index) => {
            const embed = new EmbedBuilder()
            embed.setTitle(`Airing between ${day.toDateString()} to ${nextWeek.toDateString()}`)
            embed.setColor('Green')
            embed.setFooter(Footer(headers))

            fieldSet.forEach((field) => {
              const { media, episode, airingAt } = field

              embed.addFields({
                name: `${SeriesTitle(media)}`,
                value: `> **[EP - ${episode}]** :airplane: ${new Date(airingAt * 1000) > new Date() ? `Going to air <t:${airingAt}:R>` : `Aired <t:${airingAt}:R>`}`,
                inline: false,
              })
            })
            pageList.push(embed)
          })

          BuildPagination(interaction, pageList).paginate()
        }
        else {
          interaction.reply({
            embeds: [EmbedError('No airing anime found.')],
          })
        }
      })
      .catch((error) => {
        console.error(error)
        interaction.reply({ embeds: [EmbedError(error, vars)] })
      })
  },
})
