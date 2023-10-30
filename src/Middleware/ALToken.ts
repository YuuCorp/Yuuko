import { RSACryption, getAnilistUser } from "../Utils";
import { Middleware } from "../Structures/Middleware";
import type { UsableInteraction } from "../Structures";

async function requireALToken(interaction: UsableInteraction) {
  if(!interaction.isCommand()) return;
  const id = interaction.user.id;
  const alUser = await getAnilistUser(id);
  if (!alUser || !alUser.anilistToken) throw new Error("You must link your AniList account to use this command!");
  interaction.alID = alUser.anilistId;
  interaction.ALtoken = RSACryption(alUser.anilistToken);
}

async function optionalALToken(interaction: UsableInteraction) {
  const id = interaction.user.id;
  const alUser = await getAnilistUser(id);
  if (alUser && alUser.anilistToken) {
    interaction.alID = alUser.anilistId;
    interaction.ALtoken = RSACryption(alUser.anilistToken);
  }
}

export const mwRequireALToken = new Middleware({
  name: "Require AniList Token",
  description: "This middleware enforces the presence of an AniList Token for a given Discord user ID and makes it available for the interaction object",
  run: requireALToken,
  defer: true,
});

export const mwOptionalALToken = new Middleware({
  name: "Optional AniList Token",
  description: "This middleware makes an AniList token available on the interaction object if present",
  run: optionalALToken,
  defer: true,
});
