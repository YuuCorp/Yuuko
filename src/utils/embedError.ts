import { EmbedBuilder } from 'discord.js'

export function embedError(err: Error | string, params: any = null): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Error')
    .addFields({ name: "Tracelog / Message", value: '```' + err.toString() + '```' })
    .setColor('Red')
  if (params)
    embed.addFields({ name: "Params", value: '```json\n' + JSON.stringify(params) + '```' })

  return embed
}
