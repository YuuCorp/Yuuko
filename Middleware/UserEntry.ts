import { db } from "../Database";
import { Middleware } from "../Structures/Middleware";
import { getAnilistUser } from "../Utils/getAnilistUser";

export const mwGetUserEntry = new Middleware({
  name: "Require AniList Token",
  description: "This middleware gets you the user's AniList ID and add's it to the interaction object.",
  run: async (interaction) => {
    const id = interaction.user.id;
    const alUser = await getAnilistUser(id)
    if (alUser && alUser.anilistId) {
      interaction.alID = alUser.anilistId;
    }
  },
});
