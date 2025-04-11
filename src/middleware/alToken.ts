import { getAnilistUser, YuukoError } from "#utils/index";
import { Middleware } from "#structures/index";

export const mwRequireALToken = new Middleware({
  name: "Require AniList Token",
  description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
  run: async (interaction, client) => {
    if (!interaction.isCommand()) return;
    const id = interaction.user.id;
    const alUser = await getAnilistUser(id);
    if (!alUser || !alUser.anilistToken) throw new YuukoError("You must link your AniList account to use this command!");

    interaction.alID = alUser.anilistId;
    interaction.ALtoken = await client.rsa.decrypt(alUser.anilistToken);
  },
  defer: true,
});
