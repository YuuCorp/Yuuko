import type { Interaction } from 'discord.js'
import { Middleware } from '../Structures/Middleware'
import { AnilistUser } from '../Database/Models/AnilistUser'

async function getUserEntry(interaction: Interaction) {
  const id = interaction.user.id
  const alUser = await AnilistUser.findOne({ where: { discord_id: id } })
  if (alUser && alUser.getDataValue('anilist_id')) {
    // @ts-expect-error | This is a valid property
    interaction.alID = alUser.getDataValue('anilist_id');
  }
}

export const mwGetUserEntry = new Middleware({
  name: 'Require AniList Token',
  description: 'This middleware gets you the user\'s AniList ID and add\'s it to the interaction object.',
  run: getUserEntry,
})
