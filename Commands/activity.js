const Discord = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { mwGetUserEntry } = require('#Middleware/UserEntry.js')
const Command = require('#Structures/Command.js')
const EmbedError = require('#Utils/EmbedError.js')
const SeriesTitle = require('#Utils/SeriesTitle.js')
const CommandCategories = require('#Utils/CommandCategories.js')
const GraphQLRequest = require('#Utils/GraphQLRequest.js')
const GraphQLQueries = require('#Utils/GraphQLQueries.js')

const name = 'activity'
const usage = 'activity <user>'
const description = 'Searches for an user and shows you their most recent activity.'

module.exports = new Command({
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option => option.setName('user').setDescription('The user to search for').setRequired(false)),

  async run(interaction, args, run) {
    const userName = interaction.options.getString('user')

    let vars = {
      username: userName,
    }

    if (!interaction.options.getString('user')) {
      // We try to use the one the user set
      try {
        vars = { userid: interaction.alID }
      }
      catch (error) {
        console.error(error)
        return interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token. You can see the instructions with /auth help`)] })
      }
    }
    else {
      try {
        const uData = (await GraphQLRequest(GraphQLQueries.User, vars))?.User
        vars = {
          userid: uData?.id || 'Unable to find ID',
        }
      }
      catch (error) {
        console.error(error)
        interaction.reply({ embeds: [EmbedError(error, vars)] })
      }
    }

    GraphQLRequest(GraphQLQueries.Activity, vars)
      .then((response, headers) => {
        const data = response.Activity
        if (data) {
          const embed = new EmbedBuilder().setURL(data?.siteUrl).setTimestamp(data?.createdAt * 1000)

          if (data?.__typename.includes('TextActivity')) {
            embed
              .setTitle(`Here's ${data?.user?.name?.toString() || 'Unknown Name'}'s most recent activity!`)
              .setDescription(data?.text?.replace(`!~`, `||`).replace(`~!`, `||`).replaceAll('~', ``))
              .setThumbnail(data?.user?.avatar?.large)
              .setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` })

            return interaction.reply({ embeds: [embed] })
          }
          else if (data.media?.bannerImage) { embed.setImage(data?.media?.bannerImage) }
          else { embed.setThumbnail(data?.media?.coverImage?.large || data?.media?.coverImage?.medium) }
          embed
            .setTitle(`Here's ${data?.user?.name?.toString() || 'Unknown Name'}'s most recent activity!`)
            .setDescription(`${data?.status.charAt(0).toUpperCase() + data?.status.slice(1)} ${data?.progress?.toLowerCase() || ''} ${data?.status.startsWith('read' || 'watched') ? 'of' : ''} **[${SeriesTitle(data.media)}](${data?.media?.siteUrl})**`)
            .setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` })

          return interaction.reply({ embeds: [embed] })
        }
        else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] })
        }
      })
      .catch((error) => {
        console.error(error)
        interaction.reply({ embeds: [EmbedError(error, vars)] })
      })
  },
})
