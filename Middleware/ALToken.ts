import type { Interaction } from 'discord.js'
import { AnilistUser } from '../Database/Models/AnilistUser'
import { RSACryption } from '../Utils/RSACryption'

import { Middleware } from '../Structures/Middleware'

async function requireALToken(interaction: Interaction) {
  // We can be sure we are passing a valid one;
  const id = interaction.user.id
  const alUser = await AnilistUser.findOne({ where: { discord_id: id } })
  if (!alUser || !alUser.anilist_token)
    throw new Error('You must have an AniList token set to use this action.')

  // @ts-expect-error
  interaction.ALtoken = RSACryption(alUser.anilist_token)
}

async function optionalALToken(interaction: Interaction) {
  const id = interaction.user.id
  const alUser = await AnilistUser.findOne({ where: { discord_id: id } })
  if (alUser && alUser.anilist_token) {
    // @ts-expect-error
    interaction.ALtoken = RSACryption(alUser.anilist_token)
  }
}

export const mwRequireALToken = new Middleware({
  name: 'Require AniList Token',
  description: 'This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object',
  run: requireALToken,
})

export const mwOptionalALToken = new Middleware({
  name: 'Optional AniList Token',
  description: 'This middleware makes an AniList token available on the interaction object if present',
  run: optionalALToken,
})
