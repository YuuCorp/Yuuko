import { embedError, footer, graphQLRequest, rsaEncryption, getOptions, updateBotStats, getSubcommand } from "#utils/index";
import anilistUser from "#database/models/anilistUser";
import type { Command } from "#structures/command";
import { SlashCommandBuilder } from "discord.js";
import { db } from "#database/db";
import { eq } from "drizzle-orm";

const name = "auth";
const usage = "auth <help | anilistToken | wipe>";
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
        .addSubcommand((subcommand) => subcommand.setName("wipe").setDescription("Unlink your AniList token from the bot."))
        .addSubcommand((subcommand) =>
            subcommand
                .setName("token")
                .setDescription("Use the AniList token here.")
                .addStringOption((option) => option.setName("token").setDescription("Add the AniList token here.").setMinLength(750).setRequired(true)),
        ),

    run: async ({ interaction, client }): Promise<void> => {
        if (!interaction.isCommand()) return;

        // const type = (interaction.options as CommandInteractionOptionResolver).getSubcommand();
        const type = getSubcommand<["token", "help", "wipe"]>(interaction.options);
        const { token } = getOptions<{ token: string | undefined }>(interaction.options, ["token"]);

        db.query.anilistUser.findFirst({ where: (user, { eq }) => eq(user.discordId, interaction.user.id) });

        if (type === "token" && !token) return void interaction.reply({ embeds: [embedError(`Please provide a token with this option.`)], ephemeral: true });

        if (type === "help") {
            return void (await interaction.reply({
                embeds: [
                    {
                        title: `Steps to get your AniList Token.`,
                        description:
                            `To add you as an user you have to [login with AniList](https://anilist.co/api/v2/oauth/authorize?client_id=9020&response_type=token). \n Once you've done that, all you have to do is run the command again with the subcommand ` +
                            "`" +
                            "token" +
                            "`" +
                            ` and paste the token you received on the site into the token option.`,
                        footer: footer(),
                    },
                ],
                ephemeral: true,
            }));
        }

        const user = (await db.select().from(anilistUser).where(eq(anilistUser.discordId, interaction.user.id)).limit(1))[0];

        if (type === "wipe") {
            if (!user) return void interaction.reply({ embeds: [embedError(`You don't have an AniList account bound to your Discord account.`, null)], ephemeral: true });
            try {
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
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return void interaction.reply({
                    embeds: [
                        embedError(
                            `An error occurred while updating your AniList account binding:
                                                                   \n\n${error}`,
                            null,
                        ),
                    ],
                    ephemeral: true,
                });
            }
        }

        // Update existing user
        if (user) {
            try {
                if (!token) return void interaction.reply({ embeds: [embedError(`Please provide a token with this option.`)], ephemeral: true });

                const { Viewer: data } = (await graphQLRequest("Viewer", {}, token)).data;

                if (!data) return void interaction.reply({ embeds: [embedError(`Invalid token provided.`)], ephemeral: true });

                await db
                    .update(anilistUser)
                    .set({ anilistToken: await rsaEncryption(token, true), anilistId: data.id })
                    .where(eq(anilistUser.discordId, interaction.user.id));
                return void interaction.reply({
                    embeds: [
                        {
                            title: `Successfully updated your AniList account binding.`,
                            description: `Your Discord-bound AniList account has been changed to \`${data.name}\`.`,
                            color: 0x00ff00,
                            footer: footer(),
                        },
                    ],
                    ephemeral: true,
                });
            } catch (error) {
                console.error(error);
                return void interaction.reply({
                    embeds: [
                        embedError(
                            `An error occurred while updating your AniList account binding:
                                                                   \n\n${error}`,
                            null,
                        ),
                    ],
                    ephemeral: true,
                });
            }
        }

        // Create new user
        try {
            if (!token) return void interaction.reply({ embeds: [embedError(`Please provide a token with this option.`)], ephemeral: true });

            const { Viewer: data } = (await graphQLRequest("Viewer", {}, token)).data;

            if (!data) return void interaction.reply({ embeds: [embedError(`Invalid token provided.`)], ephemeral: true });

            await db.insert(anilistUser).values({ discordId: interaction.user.id, anilistToken: await rsaEncryption(token, true), anilistId: data.id });
            await updateBotStats(client);
            return void interaction.reply({
                embeds: [
                    {
                        title: `Successfully bound your AniList account to your Discord account.`,
                        description: `Your AniList account is now \`${data.name}\`.`,
                        color: 0x00ff00,
                        footer: footer(),
                    },
                ],
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return void (await interaction.reply({
                embeds: [
                    embedError(
                        `Something went wrong while trying to create your AniList account binding:
                                                               \n\n${error}`,
                        null,
                    ),
                ],
                ephemeral: true,
            }));
        }
    },
} satisfies Command;
