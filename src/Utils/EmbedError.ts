import { EmbedBuilder } from 'discord.js'

export function EmbedError(err: Error | string, params: any = null, cause?: string, showparams = true): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Error')
    .addFields({ name: `Tracelog / Message `, value: '```' + `${err.toString()}` + '```' })
    .setColor('Red')
  if (showparams)
    embed.addFields({ name: `Params `, value: params ? `\`\`\`json\n${JSON.stringify(params)}\`\`\`` : 'No parameters provided' })
    // let's just add another shit for this
    embed.addFields({ name: 'Reason', value: cause ? cause : 'No reason provided'})

  return embed
}
