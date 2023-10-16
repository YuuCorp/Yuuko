import type { Interaction } from 'discord.js'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { Pagination } from '@acegoal07/discordjs-pagination'

/**
 * Creates the default pagination object to avoid boilerplate.
 * @param {Array} pageList - An array of pages to be embedded.
 * @param {object} interaction - The Discord interaction object.
 * @returns {object} The pagination object.
 */
export function BuildPagination(interaction: Interaction, pageList: any[]) {
  const buttonList = [
    new ButtonBuilder().setCustomId('firstbtn').setLabel('First page').setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId('previousbtn').setLabel('Previous').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('nextbtn').setLabel('Next').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('lastbtn').setLabel('Last Page').setStyle(ButtonStyle.Danger),
  ]

  return new Pagination().setPortal(interaction).setPageList(pageList).setButtonList(buttonList).enableAutoButton(true).setTimeout(20000)
}
