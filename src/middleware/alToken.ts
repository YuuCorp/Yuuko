import { getAniListUser, YuukoError } from "#utils/index";
import { Middleware } from "#structures/index";

export const mwRequireAniListToken = new Middleware({
  name: "Require AniList Token",
  description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
  run: async (interaction, client) => {
    if (!interaction.isCommand()) return;
    const id = interaction.user.id;
    const aniListUser = await getAniListUser(id);
    if (!aniListUser || !aniListUser.aniListToken) throw new YuukoError("You must link your AniList account to use this command!");

    interaction.aniListId = aniListUser.aniListId;
    interaction.aniListToken = await client.rsa.decrypt(aniListUser.aniListToken);
  },
});
