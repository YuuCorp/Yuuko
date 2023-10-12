import type { Interaction } from 'discord.js'

import { EmbedError } from '../Utils/EmbedError'
import { YuukoEvent } from '../Structures/Event'
import { Logging } from '../Utils/Logging'
import type { Middleware } from '../Structures/Middleware'

/* discord doesn't have the commands property in their class for somea reason */
export const interactionCreate = new YuukoEvent('interactionCreate', async (client, interaction) => {
  // If the interaction wasn't a chat command, we ignore it

  if (interaction.isChatInputCommand()) {
    // We run the command based on the interaction
    const command = client.commands.find(cmd => cmd.name == interaction.commandName)
    if (!command)
      return
    Logging(command, interaction)
    command.run(await runMiddlewares(command.middlewares, interaction), null, client)

    // Check for autocomplete
  }
  else if (interaction.isAutocomplete()) {
    const command = client.commands.find(cmd => cmd.name == interaction.commandName)
    if (!command || !interaction)
      return
    if (!command.autocomplete)
      return

    await command.autocomplete(await runMiddlewares(command.middlewares, interaction))

    // Check for modal
  }
  else if (interaction.isModalSubmit()) {
    const component = client.components.find(comp => comp.name == interaction.customId)
    if (!component)
      return
    component.run(await runMiddlewares(component.middlewares, interaction), null, client)
  }
})

async function runMiddlewares(middlewares: Middleware[] | undefined, interaction: Interaction): Promise<Interaction> {
  if (!interaction.isChatInputCommand())
    return interaction
  if (!middlewares)
    return interaction
  await Promise.all(middlewares.map(mw => mw.run(interaction))).catch((e) => {
    interaction.reply({ embeds: [EmbedError(e as any)] })
  })
  return interaction
}
