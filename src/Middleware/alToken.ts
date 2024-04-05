import { rsaEncryption, getAnilistUser } from "../utils";
import { Middleware } from "../structures/middleware";
import type { UsableInteraction } from "../structures";

async function requireALToken(interaction: UsableInteraction) {
  if(!interaction.isCommand()) return;
  const id = interaction.user.id;
  const alUser = await getAnilistUser(id);
  if (!alUser || !alUser.anilistToken) throw new Error("You must link your AniList account to use this command!");
  interaction.alID = alUser.anilistId;
  interaction.ALtoken = await rsaEncryption(alUser.anilistToken);
}

export const mwRequireALToken = new Middleware({
  name: "Require AniList Token",
  description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
  run: requireALToken,
  defer: true,
});
