import { Middleware } from "../structures/middleware";
import { rsaEncryption, getAnilistUser } from "../utils";

export const mwGetUserEntry = new Middleware({
  name: "Require AniList Token",
  description: "This middleware gets you the user's data and add's it to the interaction object if it exists. (ID and Token)",
  defer: true,
  run: async (interaction) => {
    const id = interaction.user.id;
    const alUser = await getAnilistUser(id)
    if (alUser && alUser.anilistId) {
      interaction.alID = alUser.anilistId;
      interaction.ALtoken = await rsaEncryption(alUser.anilistToken);
    }
  },
});
