import { AnnouncementModel } from "#Models/Announcement.ts";
import type { YuukoComponent } from "../Utils/types";

export default {
  name: "annModal",
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const annInput = interaction.fields.getTextInputValue("annInput");
    await AnnouncementModel.create({ date: new Date(), announcement: annInput });
    return interaction.reply({ content: "Announcement created!", ephemeral: true });
  },
} satisfies YuukoComponent;
