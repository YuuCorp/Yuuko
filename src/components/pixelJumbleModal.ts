import { mwRequireALToken } from "#middleware/alToken";
import { YuukoError, type YuukoComponent } from "#utils/types";
import { MessageFlags } from "discord.js";

export default {
    name: "pixel_jumble_modal",
    middlewares: [mwRequireALToken],
    run: async (interaction, args, client) => {
        if (!interaction.isModalSubmit()) return;

        const gameData = client.modalData.get("pixelJumbleGames");
        const game = gameData?.get(interaction.user.id);
        if (!game) throw new YuukoError("Could not retrieve user's data from pixel jumble games in modal");

        const guess = interaction.fields.getTextInputValue("guess_input");

        if (normalizeForComparison(guess) === normalizeForComparison(game.answer)) {
            gameData?.set(interaction.user.id, { ...game, won: true });
            game.collector?.stop();
            await interaction.deferUpdate()
        } else {
            await interaction.reply({ content: `Incorrectly guessed: *${guess}*, try again!` });
        }
    },
} satisfies YuukoComponent;

function normalizeForComparison(input: string) {
    // could mess up with thai letters, but we shouldn't ever run into that case
    // and couldn't figure out a way to avoid that.
    return input.trim().toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");
}