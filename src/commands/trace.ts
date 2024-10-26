// use esm

import { SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
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
    interaction.deferReply();
    const image = interaction.options.getAttachment("image");

    if (!image) throw new Error("No image attached.");

    const imageData = await (await fetch(image.url)).arrayBuffer();
    const res = await fetch(baseUrl, {
      method: "POST",
      body: imageData,
      headers: { "Content-type": "image/jpeg" },
    })
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

    const data = await res.json() as { result: TraceMoeReturnType[] }
    const response = data.result[0];
    if (!response) throw new Error("No results found.");
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
  },
} satisfies Command;
