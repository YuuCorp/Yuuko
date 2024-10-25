// use esm

import { SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import { embedError } from "#utils/embedError";
import AnimeCmd from "#commands/anime";

import humanizeDuration from "humanize-duration";
// const humanizeDuration = require("humanize-duration");

const name = "trace";
const usage = "trace <image attachment>";
const description = "Gets an anime from an image.";

const baseUrl = 'https://api.trace.moe/search?cutBorders&url='

interface TraceMoeReturnType {
  anilist: number;
  filename: string;
  from: number;
  to: number;
  episode: number;
  similarity: number;
  video: string;
  image: string;
}

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addAttachmentOption((option) => option.setName("image").setDescription("Attach the image of the anime.").setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {
    const image = interaction.options.getAttachment("image");

    if (!image) return void interaction.reply({ embeds: [embedError("No image attached.")] });

    try {
      const res = await fetch(`${baseUrl}${image.url}`)
      if (!res.ok) return void interaction.reply({ embeds: [embedError(res.statusText)] });

      const data = await res.json() as { result: TraceMoeReturnType[] }
      const response = data.result[0];
      if (!response) return void interaction.reply({ embeds: [embedError("No results found.", { url: image.url })] });
      const hookdata = {
        id: response.anilist,
        image: image.url,
        fields: [
          { name: "\u200B", value: "\u200B" },
          { name: "In Episode", value: `${response.episode || "Full"} (${humanizeDuration(response.from * 1000, { round: true }).toString()} in)`, inline: true },
          { name: "Similarity", value: response.similarity.toFixed(2).toString(), inline: true },
          { name: "Video", value: `[Link](${response.video})`, inline: true },
        ],
      };
      AnimeCmd.run({ interaction, client, hook: true, hookdata });
    } catch (e: any) {
      if (e.response) console.error(e.response.data.errors);
      else console.error(e);

      interaction.reply({ embeds: [embedError(e, { url: image.url })] });
    }
  },
} satisfies Command;
