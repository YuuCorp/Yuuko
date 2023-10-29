import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { mwGetUserEntry } from '../Middleware/UserEntry'
import type { Command } from '../Structures'
import { EmbedError, GraphQLRequest, SeriesTitle, getOptions } from '../Utils'

const name = 'activity'
const usage = 'activity <user>'
const description = 'Searches for an user and shows you their most recent activity.'

export default {
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  commandType: 'Anilist',
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption(option => option.setName('user').setDescription('The user to search for').setRequired(false)),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return
    getOptions
    const { user: username } = getOptions<{ user: string | undefined }>(interaction.options, ['user'])

    const vars: Partial<{
      username: string
      userid: number
    }> = {
      username,
      userid: interaction.alID,
    }

    if (!interaction.options.get('user') && !vars.userid)
      return void interaction.editReply({ embeds: [EmbedError(`You have yet to set an AniList token. You can see the instructions with /auth help`)] })
    
    if(vars.username) {
      try {
        const uData = (
          await GraphQLRequest('User', {
            username: vars.username,
          })
        ).data.User
        vars.userid = uData?.id
        if (!vars.userid)
          throw new Error('Couldn\'t find user id.')
      }
      catch (error: any) {
        console.error(error)
        interaction.editReply({ embeds: [EmbedError(error, vars)] })
      }
    }

    GraphQLRequest('Activity', vars)
      .then((response) => {
        const data = response.data.Activity!
        if (data) {
          const embed = new EmbedBuilder().setTimestamp(data?.createdAt * 1000)
          switch (data?.__typename) {
            // i think i might know why, you see the 
            // yeah uh this is gonna be sad
            case 'ListActivity':
              embed.setURL(data?.siteUrl!)
              embed.setTitle(`Here's ${data?.user?.name?.toString() || "Unknown Name"}'s most recent activity!`)
              embed.setDescription( 
                `${data?.status!.charAt(0).toUpperCase() + data?.status!.slice(1)} ${data?.progress?.toLowerCase() || ""} ${data?.status!.startsWith("read" || "watched") ? 'of' : ''} **[${SeriesTitle(data.media?.title || undefined)}](${
                  data?.media?.siteUrl
              })**`);
              embed.setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` });
              if (data.media?.bannerImage) {
                embed.setImage(data.media.bannerImage)
              }
              else {
                const thumbnail = data?.media?.coverImage?.large || data?.media?.coverImage?.medium
                if (thumbnail)
                  embed.setThumbnail(thumbnail)
              }
              
            
              break;
            
            case 'TextActivity':
              embed
                .setTitle(`Here's ${data?.user?.name?.toString() || 'Unknown Name'}'s most recent activity!`)
                .setDescription(data?.text?.replace(`!~`, `||`).replace(`~!`, `||`).replaceAll('~', ``) || 'No text found.')
                .setThumbnail(data?.user?.avatar?.large!)
                .setFooter({ text: `${data?.likeCount | 0} ♥  ${data?.replyCount | 0} 💬` })

              return void interaction.editReply({ embeds: [embed] })

            case 'MessageActivity':
              break
          }
          return interaction.editReply({ embeds: [embed] })
        }
        else {
          return interaction.editReply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] })
        }
      })
      .catch((error) => {
        console.error(error)
        interaction.editReply({ embeds: [EmbedError(error, vars)] })
      })
  },
} satisfies Command
