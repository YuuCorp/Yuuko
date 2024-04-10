import Discord, { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fs from "fs";
import path from "path";
import { db, tables } from "#database/db";
import type { Command, CommandType } from "#structures/index";
import { buildPagination, CommandCategories } from "#utils/index";
import { desc } from "drizzle-orm";

function generateHelpEmbeds(cmdsArr: string[], category: keyof typeof CommandCategories) {
  const embeds: EmbedBuilder[] = [];
  const iterations = Math.ceil(cmdsArr.join("").length / 1024);

  let rowIndex = 0;
  for (let i = 0; i < iterations; i++) {
    let cmdStr = "";
    let charCount = 0;
    while (true) {
      const cmdLength = cmdsArr[rowIndex]?.length;
      if (!cmdLength) break;
      // For some reason if this is left at 1024, it overflows to 1030+
      // in some rare cases.
      if (charCount + cmdLength < 1000) {
        cmdStr += `${cmdsArr[rowIndex]}\n`;
        charCount = charCount + cmdLength;
        rowIndex++;
      } else {
        break;
      }
    }

    const name = `**:ledger: ${category}**${iterations > 1 ? ` (${i + 1} / ${iterations})` : ""}`;
    // console.log(name, cmdStr)

    const embed = new EmbedBuilder();
    embed.setColor("#1873bf");
    try {
      embed.addFields({ name, value: cmdStr });
    } catch (err) {
      console.error(err);
    }
    embeds.push(embed);
  }
  return embeds;
}

const name = "help";
const description = "Gives you the description of every command and how to use it.";

export default {
  name,
  description,
  withBuilder: new SlashCommandBuilder().setName(name).setDescription(description),

  run: async ({ interaction, client }): Promise<void> => {
    // Require all files from the commands folder and fetch description
    const cmds = fs.readdirSync(import.meta.dir).filter((x) => x.endsWith(".ts") && x != "help.ts");
    console.log(cmds);
    const cmdsDesc = [];
    const cmdGroups: Record<CommandType, Partial<Command>[]> = {
      "User": [],
      "Anilist": [],
      "Utils": [],
      "Internal": [],
      "Misc": [],
    };
    for (const cmd of cmds) {
      const cmdEntry = (await import(path.join(import.meta.dir, cmd))).default as Command;
      if (cmdEntry.commandType === "Internal") continue;
      if (!cmdGroups[cmdEntry.commandType]) cmdGroups[cmdEntry.commandType] = [];
      cmdGroups[cmdEntry.commandType].push({ usage: cmdEntry.usage, name: cmdEntry.name, description: cmdEntry.description });
    }
    // Send the description to the user
    const announcements = await db.query.announcementModel.findMany({ orderBy: desc(tables.announcementModel.date), limit: 5 });

    const helpInfoEmbed = new EmbedBuilder();
    helpInfoEmbed.setTitle(":grey_question: Help");
    helpInfoEmbed.setDescription("Here is a list of every command and how to use it. Parameters starting with `?` are optional.");
    helpInfoEmbed.addFields(
      { name: "Usage", value: "Use the buttons below to navigate the help pages. Note that a category might have more than one page." },
      { name: "Tip", value: "Since the migration to slash commands, you can also view the list of commands in the slash menu, you can use that too." },
      { name: "Announcements", value: announcements.length > 0 ? announcements.map((x) => `${Discord.time(x.date)} - ${x.announcement}`).join("\n") : "No announcements yet!" },
      { name: "Voting", value: "[Vote for our bot on Top.GG!](https://top.gg/bot/867010131745177621) There are no added benefits yet, but they help us be seen by other users!" },
    );
    helpInfoEmbed.setColor("#1873bf");

    const pageList = [helpInfoEmbed];
    for (const category of Object.keys(cmdGroups)) {
      const _category = category as keyof typeof CommandCategories;
      const cmdHelpArr = cmdGroups[_category].map((x: any) => `\`$\` **${x.name}** - \`${x.usage || "No parameters required."}\` \n ${x.description} \n`);
      pageList.push(...generateHelpEmbeds(cmdHelpArr, _category));
    }

    buildPagination(interaction, pageList).paginate();
  },
} satisfies Omit<Command, "commandType">;
