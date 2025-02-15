import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, type CollectedMessageInteraction, type EmbedBuilder, type InteractionReplyOptions, type MessageComponentCollectorOptions } from 'discord.js'
import type { UsableInteraction } from '#structures/command';

export async function buildPagination(interaction: UsableInteraction, pageList: EmbedBuilder[]) {
  const buttonList = [
    new ButtonBuilder().setCustomId('firstbtn').setLabel('First page').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('previousbtn').setLabel('Previous').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('nextbtn').setLabel('Next').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('lastbtn').setLabel('Last Page').setStyle(ButtonStyle.Danger),
  ];
  const customIDs = new Set(['firstbtn', 'previousbtn', 'nextbtn', 'lastbtn']);

  // always start at idx 0 (page 1)
  let pageNumber = 0;
  const totalPages = pageList.length;

  const paginationData = createPaginationData(pageList, pageNumber, totalPages, buttonList);

  const pagination = await (interaction.deferred
    ? interaction.editReply(paginationData)
    : interaction.reply(paginationData));

  // if there's not more than 1 page, no need for collectors
  if (totalPages === 1) return;

  let collector;
  const collectorOptions = {
    filter: (i) => {
      if (i.isButton()) return customIDs.has(i.customId) && (i.user.id === interaction.user.id);
      return false;
    },
    time: 20_000 // 20 second timeout
  } satisfies MessageComponentCollectorOptions<CollectedMessageInteraction>;

  if (pagination instanceof Message) {
    collector = pagination.createMessageComponentCollector(collectorOptions);
  } else {
    collector = pagination.resource?.message?.createMessageComponentCollector(collectorOptions);
  }

  // When button is pressed
  collector?.on("collect", async (i) => {
    if (!i.isButton()) return;

    switch (i.customId) {
      case "firstbtn":
        pageNumber = 0;
        break;
      case "previousbtn":
        pageNumber = pageNumber > 0 ? --pageNumber : totalPages - 1;
        break;
      case "nextbtn":
        pageNumber = pageNumber + 1 !== totalPages ? ++pageNumber : 0;
        break;
      case "lastbtn":
        pageNumber = totalPages - 1;
        break;
    };

    if (!i.deferred) await i.deferUpdate();

    await i.editReply(createPaginationData(pageList, pageNumber, totalPages, buttonList))

    // Start the timeout again
    collector.resetTimer();
  });

  collector?.on("end", () => {
    const disabledButtons = buttonList.map((b) => b.setDisabled(true));
    return interaction.editReply({
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButtons)],
    })
  });

}

function createPaginationData(pageList: EmbedBuilder[], pageNumber: number, totalPages: number, buttonList: ButtonBuilder[]) {
  const currentPage = pageList[pageNumber]!;
  let newFooter = `Page ${pageNumber + 1} / ${totalPages}`;
  if (currentPage.data.footer?.text) newFooter = `${currentPage.data.footer.text} • ${newFooter}`;
  return {
    embeds: [
      currentPage.setFooter({ text: newFooter })
    ],
    components: totalPages > 1 ? [new ActionRowBuilder<ButtonBuilder>().addComponents(buttonList)] : undefined,
    withResponse: true,
  } satisfies InteractionReplyOptions;
}
