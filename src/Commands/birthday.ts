import db from "../Database/db";
import { tables } from "../Database";
import { BuildPagination } from "../Utils/BuildPagination";
import { getOptions } from "../Utils/getOptions";
import type { CommandInteractionOptionResolver } from "discord.js";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "../Structures";
import { eq, sql } from "drizzle-orm";

const name = "birthday";
const usage = "birthday <user | list | set>";
const description = "Shows general list of birthdays for BBH server, or shows birthday for specific person.";

export default {
  name,
  usage,
  description,
  commandType: "Misc",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("The user to get the birthday of.")
        .addUserOption((option) => option.setName("user").setDescription("The user to get the birthday of.").setRequired(true)),
    )
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("List the birthdays of all registered users in this guild."))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your birthday.")
        .addStringOption((option) => option.setName("date").setDescription("The date of your birthday. Format: YYYY-MM-DD").setMinLength(10).setMaxLength(10).setRequired(true)),
    ),

  run: async ({ interaction, client }): Promise<void> => {
    if (!interaction.isCommand()) return;
    if (!interaction.guild) return void interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
    const subcommand = (interaction.options as CommandInteractionOptionResolver).getSubcommand();

    if (subcommand === "set") {
      const { date } = getOptions<{ date: string }>(interaction.options, ["date"]);
      const birthday = new Date(date);
      if (birthday.toString() === "Invalid Date") return void interaction.reply({ content: "Invalid date format. Please use YYYY-MM-DD.", ephemeral: true });
      const userBirthday = await db.query.userBirthday.findFirst({ where: (birthday, { eq }) => eq(birthday.userId, interaction.user.id) });
      if (userBirthday) {
        console.log('[/birthday set] userBirthday exists, updating...')
        await db.update(tables.userBirthday).set({ birthday, updatedAt: sql`CURRENT_TIMESTAMP` }).where(eq(tables.userBirthday.userId, interaction.user.id));
      } else {
        console.log('[/birthday set] userBirthday does not exist, inserting...')
        const data = {userId: interaction.user.id, birthday, guildId: interaction.guild.id}
        console.log(data)
        const bOpt = {
          birthday,
          userId: interaction.user.id,
          guildId: interaction.guild.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await db.insert(tables.userBirthday).values(bOpt);
      }
      return void interaction.reply({ content: `Your birthday has been set to ${getReadableDate(birthday)}.`, ephemeral: true });
    }

    if (subcommand === "user") {
      const user = interaction.options.getUser("user");
      if (!user) return void interaction.reply({ content: "Please provide a user.", ephemeral: true });
      const birthday = await db.query.userBirthday.findFirst({ where: (birthday, { eq }) => eq(birthday.userId, user.id) });
      if (!birthday) return void interaction.reply({ content: `${user.tag} has not set their birthday.`, ephemeral: true });
      const userBirthday = new Date(birthday.birthday);
      const daysLeft = daysLeftUntilBirthday(userBirthday);
      const age = calculateAge(userBirthday);

      const embed = new EmbedBuilder().setTitle(`${user.tag}'s Birthday`).addFields(
        {
          name: "Birthday",
          value: getReadableDate(userBirthday),
        },
        {
          name: "Age",
          value: age.toString(),
        },
        {
          name: "Days Left",
          value: daysLeft.toString(),
        },
      );
      return void interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "list") {
      const birthdays = await db.query.userBirthday.findMany({ where: (birthday, { eq }) => eq(birthday.guildId, interaction.guild!.id) });
      console.log(birthdays)
      if (birthdays.length === 0) return void interaction.reply({ content: "There are no birthdays registered for this server.", ephemeral: true });
      const embeds = [];
      let currentEmbed = new EmbedBuilder().setTitle("Birthdays");
      let currentEmbedIndex = 0;
      let currentEmbedField = 0;
      let embedDescription = "";

      const sortedBirthdays = birthdays.sort((a, b) => {
        const aDate = new Date(a.birthday);
        const bDate = new Date(b.birthday);
        if (aDate.getMonth() === bDate.getMonth()) return aDate.getDate() - bDate.getDate();
        return aDate.getMonth() - bDate.getMonth();
      });

      for (const birthday of sortedBirthdays) {
        const userBirthday = new Date(birthday.birthday);
        const daysLeft = daysLeftUntilBirthday(userBirthday);
        const age = calculateAge(userBirthday);
        currentEmbedField++;
        if (daysLeft > 0) embedDescription += `<@${birthday.userId}> ${getReadableDate(userBirthday)} (${age} years old, ${daysLeft} days left)\n\n`;
        else embedDescription += `<@${birthday.userId}> ${getReadableDate(userBirthday)} (${age} years old, **Birthday Today!**)\n\n`;
        if (currentEmbedField === 10 && birthdays.length > 10) {
          currentEmbed.setDescription(embedDescription);
          embeds.push(currentEmbed);
          currentEmbed = new EmbedBuilder().setTitle("Birthdays");
          currentEmbedIndex++;
          currentEmbedField = 0;
          embedDescription = "";
        } else if (currentEmbedField === birthdays.length) {
          currentEmbed.setDescription(embedDescription);
          embeds.push(currentEmbed);
        }
      }
      BuildPagination(interaction, embeds).paginate();
    }

    function daysLeftUntilBirthday(date: Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate());
      if (today > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      const daysLeft = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft;
    }

    function getReadableDate(date: Date) {
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${day}${getDaySuffix(day)} of ${month}, ${year}`;
    }

    function getDaySuffix(day: number) {
      if (day > 3 && day < 21) return "th";
      const lastDigit = day % 10;
      if (lastDigit === 1) return "st";
      if (lastDigit === 2) return "nd";
      if (lastDigit === 3) return "rd";
      return "th";
    }

    function calculateAge(date: Date) {
      const today = new Date();
      const m = today.getMonth() - date.getMonth();
      let age = today.getFullYear() - date.getFullYear();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
      return age;
    }
  },
} satisfies Command;
