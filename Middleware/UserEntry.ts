import { Middleware } from "../Structures/Middleware";
import { AnilistUser } from "../Database/Models/AnilistUser";
import { Interaction } from "discord.js";

async function getUserEntry(interaction: Interaction) {
  let id = interaction.user.id;
  let alUser = await AnilistUser.findOne({ where: { discord_id: id } });
  if (alUser && alUser.anilist_id) {
    // @ts-ignore | This is a valid property
    interaction.alID = alUser.anilist_id;
  }
}

export const mwGetUserEntry = new Middleware({
  name: "Require AniList Token",
  description: "This middleware gets you the user's AniList ID and add's it to the interaction object.",
  run: getUserEntry,
});
