const Announcement = require("#Models/Announcement.js");
import { Interaction } from "discord.js";
import { YuukoComponent } from "../Utils/types";

export default {
  name: "annModal",
  run: async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    const annInput = interaction.fields.getTextInputValue("annInput");
    await Announcement.create({ date: new Date(), announcement: annInput });
    return interaction.reply({ content: "Announcement created!", ephemeral: true });
  },
} satisfies YuukoComponent;
