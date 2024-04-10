import { ButtonBuilder, ButtonStyle, type EmbedBuilder, type Interaction } from 'discord.js'
import { Pagination } from '@acegoal07/discordjs-pagination'

export function buildPagination(interaction: Interaction, pageList: EmbedBuilder[]) {
  const buttonList = [
    new ButtonBuilder().setCustomId('firstbtn').setLabel('First page').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('previousbtn').setLabel('Previous').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('nextbtn').setLabel('Next').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('lastbtn').setLabel('Last Page').setStyle(ButtonStyle.Danger),
  ]

  return new Pagination().setPortal(interaction).setPageList(pageList).setButtonList(buttonList).enableAuthorIndependent().enableAutoButton(true).setTimeout(20000)
}
