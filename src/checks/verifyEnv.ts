import { Check } from '#structures/check'

const tokenCheck = new Check({
  name: 'Token Check',
  description: 'Ensure that process.env.TOKEN is present and valid. This is required to operate a Discord bot.',
  optional: false,
  run: () => {
    if (!process.env.TOKEN || process.env.TOKEN === 'YOUR_TOKEN_GOES_HERE')
      throw new Error('TOKEN is not set properly.')
  },
})

const clientIDCheck = new Check({
  name: 'Client ID Check',
  description: 'Ensure that process.env.CLIENT_ID is present and valid. This is required to register slash commands.',
  optional: false,
  run: () => {
    if (!process.env.CLIENT_ID)
      throw new Error('CLIENT_ID is not set properly.')
  },
})

const guildIDCheck = new Check({
  name: 'Guild ID Check',
  description: `Check if process.env.GUILD_ID is present and valid.
    This is required for slash commands to be instantly visible in a guild when developing.`,
  optional: true,
  run: () => {
    if (!process.env.GUILD_ID)
      throw new Error('GUILD_ID is not set properly.')
  },
})

export default [tokenCheck, clientIDCheck, guildIDCheck]
