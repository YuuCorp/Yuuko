import { type Interaction, Collection, time } from "discord.js";

import { embedError, logging } from "#utils/index";
import type { Client, ClientCommand, UsableInteraction, YuukoEvent, Middleware } from "#structures/index";

/* discord doesn't have the commands property in their class for somea reason */
export const run: YuukoEvent<"interactionCreate"> = async (client, interaction) => {
  try {
    // If the interaction wasn't a chat command, we ignore it

    if (interaction.isChatInputCommand()) {
      // We run the command based on the interaction
      const command = client.commands.find((cmd) => cmd.name == interaction.commandName);
      if (!command) return;
      logging(command, interaction);
      client.log(`Interaction received in: ${Date.now() - interaction.createdTimestamp}ms`, "Debug");
      checkCooldown(client, command, interaction);
      const args = await runMiddlewares(command.middlewares, interaction);
      client.log(`Ran middleware in: ${Date.now() - interaction.createdTimestamp}ms`, "Debug");

      if (args.isCommand() && args.isChatInputCommand()) {
        await command.run({ interaction: args, client });
        client.log(`Ran command in: ${Date.now() - interaction.createdTimestamp}ms`, "Debug");
      }

      // Check for autocomplete
    } else if (interaction.isAutocomplete()) {
      const command = client.commands.find((cmd) => cmd.name == interaction.commandName);
      if (!command || !interaction) return;
      if (!command.autocomplete) return;

      command.autocomplete(await runMiddlewares(command.middlewares, interaction));

      // Check for modal
    } else if (interaction.isModalSubmit()) {
      const component = client.components.find((comp) => comp.name == interaction.customId);
      if (!component) return;
      component.run(await runMiddlewares(component.middlewares, interaction), null, client);
    }

  } catch (e: any) {
    if (!interaction.isCommand()) return;

    console.error(e);

    if (interaction.deferred)
      return void interaction.editReply({ embeds: [embedError(e, e.cause)] });
    else
      return void interaction.reply({ embeds: [embedError(e, e.cause)] });
  };

  async function runMiddlewares(middlewares: Middleware[] | undefined, interaction: Interaction): Promise<Interaction> {
    if (!interaction.isChatInputCommand()) return interaction;
    if (!middlewares) return interaction;
    if (middlewares.some((mw) => mw.defer)) await interaction.deferReply();
    await Promise.all(middlewares.map((mw) => mw.run(interaction))).catch((e: any) => {
      throw e;
    });
    return interaction;
  }


  function checkCooldown(client: Client, command: ClientCommand, interaction: UsableInteraction): UsableInteraction {
    if (!interaction.isChatInputCommand()) return interaction;
    const commandCooldown = client.cooldowns.get(command.name);
    if (!commandCooldown) {
      client.cooldowns.set(command.name, new Collection());
      return interaction;
    }
    if (commandCooldown.has(interaction.user.id)) {
      const cooldownExpires = commandCooldown.get(interaction.user.id);
      console.log(cooldownExpires);
      if (!cooldownExpires) return interaction;
      if (cooldownExpires > Date.now()) {
        throw new Error(`User ${interaction.user.tag} is on cooldown for command ${command.name}`, { cause: `Cooldown expires on ${time(Math.ceil(cooldownExpires / 1000), "f")} (${time(Math.ceil(cooldownExpires / 1000), "R")})` });
      }
    }
    return interaction;
  }
}