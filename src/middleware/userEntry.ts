import { Middleware } from "#structures/middleware";
import { getAniListUser } from "#utils/index";

export const mwGetUserEntry = new Middleware({
  name: "Get User Entry",
  description: "This middleware gets you the user's data and add's it to the interaction object if it exists. (ID and Token)",
  run: async (interaction, client) => {
    const id = interaction.user.id;
    const aniListUser = await getAniListUser(id)
    if (aniListUser && aniListUser.aniListId) {
      interaction.aniListId = aniListUser.aniListId;
      interaction.aniListToken = await client.rsa.decrypt(aniListUser.aniListToken);
    }
  },
});

export const mwGetUserID = new Middleware({
  name: "Get User ID",
  description: "This middleware gets you the user's AniList ID and add's it to the interaction object if it exists.",
  run: async (interaction) => {
    const id = interaction.user.id;
    const aniListUser = await getAniListUser(id)
    if (aniListUser) {
      interaction.aniListId = aniListUser.aniListId;
    }
  },
});