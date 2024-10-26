import { EmbedBuilder } from 'discord.js'
import type { YuukoError } from './types'

export function embedError(err: YuukoError): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Error')
    .addFields({ name: "Tracelog / Message", value: '```' + err.toString() + '```' })
    .setColor('Red')

  if (err.vars)
    embed.addFields({ name: "Params", value: '```json\n' + JSON.stringify(err.vars) + '```' })

  if (err.cause)
    embed.addFields({ name: "Cause", value: err.cause })


  return embed
}
