import { type Interaction, Collection, MessageFlags, time } from "discord.js";

import { embedError, logging, YuukoError } from "#utils/index";
import { type Client, type ClientCommand, type UsableInteraction, YuukoEvent, type Middleware } from "#structures/index";

/* discord doesn't have the commands property in their class for somea reason */
const interactionCreate = new YuukoEvent({
  event: "interactionCreate",
  run: async (client, interaction) => {
    try {
      // If the interaction wasn't a chat command, we ignore it

      if (interaction.isChatInputCommand()) {
        // We run the command based on the interaction
        const command = client.commands.find((cmd) => cmd.name == interaction.commandName);
        if (!command) return;
        logging(command, interaction);
        client.log(`Interaction received in: ${Date.now() - interaction.createdTimestamp}ms`, "Debug");
        checkCooldown(client, command, interaction);
        const args = await runMiddlewares(command.middlewares, interaction, client);
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

        command.autocomplete(await runMiddlewares(command.middlewares, interaction, client));

        // Check for modal
      } else if (interaction.isModalSubmit()) {
        const component = client.components.find((comp) => comp.name == interaction.customId);
        if (!component) return;
        component.run(await runMiddlewares(component.middlewares, interaction, client), null, client);
      }

    } catch (e: any) {
      console.error(e);

      if (e instanceof YuukoError) {
        if (!interaction.isCommand()) return;

        if (interaction.deferred)
          return void interaction.editReply({ embeds: [embedError(e)] });
        else
          return void interaction.reply({
            embeds: [embedError(e)],
            flags: e.ephemeral ? MessageFlags.Ephemeral : undefined,
          });
      }
    };

    async function runMiddlewares(middlewares: Middleware[] | undefined, interaction: Interaction, client: Client): Promise<Interaction> {
      if (!middlewares) return interaction;
      if (!interaction.isChatInputCommand()) return interaction;

      if (middlewares.some((mw) => mw.defer)) await interaction.deferReply();

      await Promise.all(middlewares.map((mw) => mw.run(interaction, client))).catch((e: any) => {
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
          throw new YuukoError(`User ${interaction.user.tag} is on cooldown for command ${command.name}`, null, false, `Cooldown expires on ${time(Math.ceil(cooldownExpires / 1000), "f")} (${time(Math.ceil(cooldownExpires / 1000), "R")})`);
        }
      }
      return interaction;
    }
  }
});

export default [interactionCreate];