// use esm

import axios from "axios";
import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../Structures";
import { EmbedError } from "../Utils/EmbedError";
import AnimeCmd from "./anime";

const humanizeDuration = require("humanize-duration");

const name = "trace";
const usage = "trace <image attachment>";
const description = "Gets an anime from an image.";

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
    if (!interaction.isCommand()) return;
    const image = interaction.options.getAttachment("image");

    if (!image) return void interaction.reply({ embeds: [EmbedError("No image attached.")] });

    // Send and axios request to trace.moe with an image the user attached
    try {
      const response = (await axios.get<{result: TraceMoeReturnType[]}>(`https://api.trace.moe/search?cutBorders&url=${image.url}`)).data.result[0]
      console.log(response)
        // If the request was successful
        if (!response) return void interaction.reply({ embeds: [EmbedError("No results found.", { url: image.url })] });
        const match = response;
        const hookdata = {
          id: match.anilist,
          image: image.url,
          fields: [
            { name: "\u200B", value: "\u200B" },
            { name: "In Episode", value: `${match.episode || "Full"} (${humanizeDuration(match.from * 1000, { round: true }).toString()} in)`, inline: true },
            { name: "Similarity", value: match.similarity.toFixed(2).toString(), inline: true },
            { name: "Video", value: `[Link](${match.video})`, inline: true },
          ],
        };
        AnimeCmd.run({ interaction, client, hook: true, hookdata });
    } catch (e: any) {
      // ^ log axios request status code and error
      if (e.response) console.error(e.response.data.errors);
      else console.error(e);

      interaction.reply({ embeds: [EmbedError(e, { url: image.url })] });
    }
  },
} satisfies Command;
