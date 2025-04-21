import { Middleware } from "#structures/middleware";
import { getAnilistUser } from "#utils/index";

export const mwGetUserEntry = new Middleware({
  name: "Get User Entry",
  description: "This middleware gets you the user's data and add's it to the interaction object if it exists. (ID and Token)",
  run: async (interaction, client) => {
    const id = interaction.user.id;
    const alUser = await getAnilistUser(id)
    if (alUser && alUser.anilistId) {
      interaction.alID = alUser.anilistId;
      interaction.ALtoken = await client.rsa.decrypt(alUser.anilistToken);
    }
  },
});

export const mwGetUserID = new Middleware({
  name: "Get User ID",
  description: "This middleware gets you the user's AniList ID and add's it to the interaction object if it exists.",
  run: async (interaction) => {
    const id = interaction.user.id;
    const alUser = await getAnilistUser(id)
    if (alUser) {
      interaction.alID = alUser.anilistId;
    }
  },
});