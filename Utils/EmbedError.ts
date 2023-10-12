import { EmbedBuilder } from 'discord.js'

export function EmbedError(err: Error, params = null, showparams = true): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Error')
    .addFields({ name: `Tracelog / Message `, value: '```' + `${err.toString()}` + '```' })
    .setColor('Red')
  if (showparams)
    embed.addFields({ name: `Params `, value: params ? `\`\`\`json\n${JSON.stringify(params)}\`\`\`` : 'No parameters provided' })

  return embed
}
