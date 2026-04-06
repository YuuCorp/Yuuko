import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, EmbedBuilder, InteractionCallbackResponse, Message, type CollectedMessageInteraction, type InteractionReplyOptions, type MessageComponentCollectorOptions } from 'discord.js'
import type { UsableInteraction } from '#structures/command';

export async function buildPagination(interaction: UsableInteraction, pageList: EmbedBuilder[], followUpButton?: ButtonBuilder): Promise<ButtonInteraction | null> {
  const FOLLOW_UP_ID = 'followupbtn';

  const defaultButtons = [
    new ButtonBuilder().setCustomId('firstbtn').setLabel('First page').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('previousbtn').setLabel('Previous').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('nextbtn').setLabel('Next').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('lastbtn').setLabel('Last Page').setStyle(ButtonStyle.Danger),
  ];

  // always start at idx 0 (page 1)
  let pageNumber = 0;
  const totalPages = pageList.length;

  const buttonList = [
    ...(totalPages > 1 ? defaultButtons : []),
    ...(followUpButton ? [followUpButton] : []),
  ];

  const customIDs = new Set(['firstbtn', 'previousbtn', 'nextbtn', 'lastbtn']);

  if (followUpButton) {
    followUpButton.setCustomId(FOLLOW_UP_ID);
    customIDs.add(FOLLOW_UP_ID);
  }

  const paginationData = createPaginationData(pageList, pageNumber, totalPages, buttonList, followUpButton);

  const pagination = await (interaction.deferred
    ? interaction.editReply(paginationData)
    : interaction.reply(paginationData));

  // if there's not more than 1 page, no need for collectors
  if (totalPages === 1 && !followUpButton) return null;

  const collector = createButtonCollector(interaction, customIDs, pagination);

  return new Promise((resolve) => {
    collector?.on("collect", async (i) => {
      if (!i.isButton()) return;

      if (i.customId === FOLLOW_UP_ID) {
        // If we skip deferring the update and pass it to a command as an
        // interaction it replies as a new message.
        // await i.deferUpdate();

        buttonList.map((b) => {
          if (b === followUpButton) b.setDisabled(true)
        })

        interaction.editReply({
          components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList)],
        });

        collector.resetTimer();
        resolve(i);
        return;
      }

      switch (i.customId) {
        case "firstbtn": pageNumber = 0; break;
        case "previousbtn": pageNumber = pageNumber > 0 ? --pageNumber : totalPages - 1; break;
        case "nextbtn": pageNumber = pageNumber + 1 !== totalPages ? ++pageNumber : 0; break;
        case "lastbtn": pageNumber = totalPages - 1; break;
      }

      if (!i.deferred) await i.deferUpdate();
      await i.editReply(createPaginationData(pageList, pageNumber, totalPages, buttonList, followUpButton));
      collector.resetTimer();
    });

    collector?.on("end", (_, reason) => {
      const disabledButtons = buttonList.map((b) => b.setDisabled(true));
      interaction.editReply({
        components: [new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButtons)],
      });

      if (reason !== "followup") {
        resolve(null);
      }
    });
  });
}

export function createButtonCollector(interaction: UsableInteraction, customIDs: Set<string>, interactionAction: Message<boolean> | InteractionCallbackResponse, options?: Partial<MessageComponentCollectorOptions<CollectedMessageInteraction>>) {
  let collector;

  const collectorOptions = {
    filter: (i) => {
      if (i.isButton()) return customIDs.has(i.customId) && (i.user.id === interaction.user.id);
      return false;
    },
    time: 20000, // 20 second timeout
    ...options,
    componentType: ComponentType.Button,
  } satisfies MessageComponentCollectorOptions<CollectedMessageInteraction>;

  if (interactionAction instanceof Message) {
    collector = interactionAction.createMessageComponentCollector(collectorOptions);
  } else {
    collector = interactionAction.resource?.message?.createMessageComponentCollector(collectorOptions);
  }

  return collector;
}

function createPaginationData(pageList: EmbedBuilder[], pageNumber: number, totalPages: number, buttonList: ButtonBuilder[], followUpButton?: ButtonBuilder) {
  const currentPage = EmbedBuilder.from(pageList[pageNumber]!);
  const embedFooter = currentPage.data.footer?.text;
  let newFooter = `Page ${pageNumber + 1} / ${totalPages}`;
  if (embedFooter && !embedFooter.includes("Page ")) newFooter = `${embedFooter} • ${newFooter}`;

  return {
    embeds: [currentPage.setFooter({ text: newFooter })],
    components: totalPages > 1 || followUpButton
      ? [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList)]
      : undefined,
    withResponse: true,
  } satisfies InteractionReplyOptions;
}