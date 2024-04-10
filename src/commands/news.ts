import { embedError, footer } from '#utils/index'
import axios from 'axios'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import type { Command } from '#structures/command'

const name = 'aninews'
const usage = '/aninews'
const description = 'Gets the latest anime news from RSS.'

export default {
  name,
  usage,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand())
      return

    const rss_feed = 'https://api.rss2json.com/v1/api.json?rss_url=https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss'
    axios
      .get(rss_feed)
      .then((res) => {
        const rss = res.data
        const embed = new EmbedBuilder().setTitle(rss.feed.title).setColor(0x00AE86).setFooter(footer(res.headers))

        // console.log(rss.items);
        const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
        for (let i = 0; i < clamp(process.env.RSS_LIMIT || 5, 0, rss.items.length); i++) {
          console.log(`Processing ${i}...`)
          let content: string = rss.items[i].content
          /*
            .replace(/<img .*?>/g, "") // Remove image tjags
            .replace(/(<br\ ?\/?>)+/g, "\n"); // Replace line breaks with newlines
            */ // New RSS feed doesn't include HTML tags

          if (content.length > 1024)
            content = `${content.substring(0, 1015)}...`

          if (i != (process.env.RSS_LIMIT || 5) - 1)
            embed.addFields({ name: `:newspaper:  ${rss.items[i].title}`, value: content })
        }

        interaction.reply({ embeds: [embed] })
      })
      .catch((error) => {
        // ^ Log Axios request status code and error
        if (error.response)
          console.log(error.response.data.errors)
        else console.error(error)

        interaction.reply({ embeds: [embedError(error)] })
      })
  },
} satisfies Command
