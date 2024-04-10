import { Middleware } from "#structures/middleware";

export const mwTrustedUser = new Middleware({
  name: "Require trusted user",
  description: "This middleware checks if the user is trusted, and if not it will not run the command.",
  run: async (interaction) => {
    const isTrusted = process.env.TRUSTED_USERS.includes(interaction.user.id);
    if (!isTrusted) throw new Error("You do not have the permission to run this command.");
  },
});
