import type { YuukoComponent } from "../Utils/types";

const Announcement = require("#Models/Announcement.js");

export default {
  name: "annModal",
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const annInput = interaction.fields.getTextInputValue("annInput");
    await Announcement.create({ date: new Date(), announcement: annInput });
    return interaction.reply({ content: "Announcement created!", ephemeral: true });
  },
} satisfies YuukoComponent;
