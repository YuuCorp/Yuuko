import type { Interaction } from 'discord.js'
import { db, tables } from '../Database'
import { RSACryption, getAnilistUser } from '../Utils'

import { Middleware } from '../Structures/Middleware'

async function requireALToken(interaction: Interaction) {
  // We can be sure we are passing a valid one;
  const id = interaction.user.id
  const alUser = await getAnilistUser(id);
  if (!alUser || !alUser.anilistToken)
    throw new Error('You must have an AniList token set to use this action.')

  // @ts-expect-error
  interaction.ALtoken = RSACryption(alUser.anilistToken)
}

async function optionalALToken(interaction: Interaction) {
  const id = interaction.user.id
  const alUser = await getAnilistUser(id);
  if (alUser && alUser.anilistToken) {
    // @ts-expect-error
    interaction.ALtoken = RSACryption(alUser.anilistToken)
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
