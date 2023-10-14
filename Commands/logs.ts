import type { Command } from "../Structures";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CommandCategories, Footer } from "../Utils";
import fs from "fs";
import path from "path";

// const path = require("node:path");
// const fs = require("node:fs");
// const Discord = require("discord.js");
// const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
// const Command = require("#Structures/Command.js");
// const CommandCategories = require("#Utils/CommandCategories.js");
// const Footer = require("#Utils/Footer.js");

const name = "logs";
const description = "Allows you to see the 25 most recent logs of the bot. (Trusted users only)";

export default {
  name,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    if (JSON.parse(process.env.TRUSTED_USERS).includes(interaction.user.id) /* && process.env.NODE_ENV === "production" */) {
      if (!fs.existsSync(path.join(__dirname, "../Logging", "logs.txt"))) return void interaction.reply(`\`There are no logs to view.\``);

      const logs = fs
        .readFileSync(path.join(__dirname, "../Logging", "logs.txt"), "utf8")
        .split("\n")
        .reverse()
        .slice(0, 25)
        .reverse()
        .join("\n");
      return void interaction.reply({
        embeds: [
          {
            title: `Here are the 25 most recent logs.`,
            /* example of formating
                        • 2021-08-01 12:00:00: akira#6505 ran command: logs
                        • 2021-08-01 12:00:00: akira#6505 ran command: user
                    */
            description: `\`\`\`\n${logs.replace(/\n/g, "\n")}\`\`\``,
            color: 0x00ff00,
            footer: Footer(),
          },
        ],
      });
    }
  },
} satisfies Command;
