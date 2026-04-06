import { footer, getSubcommandOption, updateBotStats, YuukoError } from "#utils/index";
import { anilistUser } from "#database/models/anilistUser";
import type { Command } from "#structures/index";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from "discord.js";
import { db } from "#database/db";
import { eq } from "drizzle-orm";

const name = "auth";
const usage = "auth <help | wipe>";
const description = "Binds an existing AniList user to your Discord account in the bot database.";

export default {
    name,
    usage,
    description,
    commandType: "Anilist",
    withBuilder: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addSubcommand((subcommand) => subcommand.setName("help").setDescription("Shows you info on how to get your AniList token."))
        .addSubcommand((subcommand) => subcommand.setName("wipe").setDescription("Unlink your AniList token from the bot.")),

    run: async ({ interaction, client }, hookData): Promise<void> => {
        const subcommandType = getSubcommandOption(interaction, hookData, "subcommandType", true) as "help" | "wipe";

        db.query.anilistUser.findFirst({ where: (user, { eq }) => eq(user.discordId, interaction.user.id) });

        if (subcommandType === "help") {
            return void (await interaction.reply({
                embeds: [
                    {
                        title: `Steps to get your AniList Token.`,
                        description: `To add you as an user you have to [link your Discord account with Anilist](https://auth.yuuko.dev).\nBeware! Tokens last one year, so if you start experiencing an error of invalid token, it means you have to run \`/auth wipe\` and reconnect your account.`,
                        footer: footer(),
                    },
                ],
                components: [new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setLabel('Visit auth page').setStyle(ButtonStyle.Link).setURL("https://auth.yuuko.dev"))],
                flags: MessageFlags.Ephemeral,
            }));
        }

        const user = (await db.select().from(anilistUser).where(eq(anilistUser.discordId, interaction.user.id)).limit(1))[0];

        if (subcommandType === "wipe") {
            if (!user) throw new YuukoError("You don't have an AniList account bound to your Discord account.", null, true)
            await db.delete(anilistUser).where(eq(anilistUser.discordId, interaction.user.id));

            await updateBotStats(client);
            return void interaction.reply({
                embeds: [
                    {
                        title: `Successfully wiped your AniList account binding.`,
                        description: `Your Discord-bound AniList account has been wiped from our database.`,
                        color: 0x00ff00,
                        footer: footer(),
                    },
                ],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
} satisfies Command<{ subcommandType: "help" | "wipe" }>;
