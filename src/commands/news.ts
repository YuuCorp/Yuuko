import { embedError, footer } from '#utils/index'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import type { Command } from '#structures/index'

const name = 'aninews'
const usage = '/aninews'
const description = 'Gets the latest anime news from RSS.'

type RSSFeed = {
  status: string,
  feed: {
    url: string
    title: string
    link: string
    author: string
    description: string
    image: string
  },
  items: {
    title: string
    link: string
    pubDate: string
    author: string
    thumbnail: string
    description: string;
    content: string
  }[],
}

export default {
  name,
  usage,
  description,
  commandType: 'Misc',
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction }): Promise<void> => {
    if (!interaction.isCommand())
      return

    const rss_feed = 'https://api.rss2json.com/v1/api.json?rss_url=https://cr-news-api-service.prd.crunchyrollsvc.com/v1/en-US/rss'
    try {
      const res = await fetch(rss_feed, {
        method: 'GET'
      })

      if(!res.ok) {
        interaction.reply({ embeds: [embedError(res.statusText)] })
        return
      }

      const rss = await res.json() as RSSFeed

      const embed = new EmbedBuilder().setTitle(rss.feed.title).setColor(0x00AE86)

      const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)
      for (let i = 0; i < clamp(process.env.RSS_LIMIT || 5, 0, rss.items.length); i++) {
        if(rss.items[i] === undefined) continue
        console.log(`Processing ${i}...`)
        let content: string = rss.items[i]!.content
        /*
          .replace(/<img .*?>/g, "") // Remove image tjags
          .replace(/(<br\ ?\/?>)+/g, "\n"); // Replace line breaks with newlines
          */ // New RSS feed doesn't include HTML tags

        if (content.length > 1024)
          content = `${content.substring(0, 1015)}...`

        if (i != (process.env.RSS_LIMIT || 5) - 1)
          embed.addFields({ name: `:newspaper:  ${rss.items[i]!.title}`, value: content })
      }

      interaction.reply({ embeds: [embed] })
    } catch (e: any) {
      console.error(e)
      interaction.reply({ embeds: [embedError(e)] })
    }
  },
} satisfies Command
