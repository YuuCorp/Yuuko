import { Middleware } from "../Structures/Middleware";
import db from "../Database/db";

export const mwGetUserEntry = new Middleware({
  name: "Require AniList Token",
  description: "This middleware gets you the user's AniList ID and add's it to the interaction object.",
  run: async (interaction) => {
    const id = interaction.user.id;
    const alUser = await db.query.anilistUser.findFirst({ where: (user, { eq }) => eq(user.discordId, id) });
    if (alUser && alUser.anilistId) {
      interaction.alID = alUser.anilistId;
    }
  },
});
