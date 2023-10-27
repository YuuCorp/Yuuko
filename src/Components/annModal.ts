import type { YuukoComponent } from '../Utils/types'

import announcementModel from '../Database/Models/Announcement'

import db from '../Database/db'

export default {
  name: 'annModal',
  run: async (interaction) => {
    if (!interaction.isModalSubmit())
      return
    const annInput = interaction.fields.getTextInputValue('annInput')
    // await announcementModel.create({ date: new Date(), announcement: annInput })
    await db.insert(announcementModel).values({ announcement: annInput, date: new Date(), createdAt: new Date(), updatedAt: new Date() })

    return interaction.reply({ content: 'Announcement created!', ephemeral: true })
  },
} satisfies YuukoComponent
