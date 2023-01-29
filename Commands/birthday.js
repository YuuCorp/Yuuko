const Discord = require("discord.js"),
    Command = require("#Structures/Command.js"),
    { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
    CommandCategories = require("#Utils/CommandCategories.js");

const name = "birthday";
const usage = "birthday <?discord user>";
const description = "Shows general list of birthdays for BBH server, or shows birthday for specific person.";

module.exports = new Command({
    name,
    usage,
    description,
    type: CommandCategories.Misc,
    guildOnly: true,
    slash: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption((option) => option.setName("user").setRequired(false).setDescription("The user to get the birthday of.")),

    async run(interaction, args, run) {
        if (interaction.guild.id !== process.env.GUILD_ID) return interaction.reply({ content: "Sorry, seems like you have somehow gotten access to a command you shouldn't be able to.", ephemeral: true });
        const birthdays = {
            "407520116478312448": {
                string: "2nd of January 2003",
                date: new Date("2003-01-02"),
            }, // sprit3
            "420825464245059586": {
                string: "5th of March 2008",
                date: new Date("2008-03-05"),
            }, // miku simp
            "592338499810885653": {
                string: "7th of March 2007",
                date: new Date("2007-03-07"),
            }, // lebeb
            "327012928031162368": {
                string: "11th of March 2006",
                date: new Date("2006-03-11"),
            }, // manzom
            "367386777758990337": {
                string: "20th of March 2004",
                date: new Date("2004-03-20"),
            }, // purpleyuki
            "236907218342117376": {
                string: "23rd of April 2007",
                date: new Date("2007-04-23"),
            }, // akira
            "313699902758715404": {
                string: "24th of June 2005",
                date: new Date("2005-06-24"),
            }, // kevin
            "419512104685666304": {
                string: "18th of July 2006",
                date: new Date("2006-07-18"),
            }, // mads
            "422007636133675018": {
                string: "3rd of August 2006",
                date: new Date("2006-08-03"),
            }, // salami
            "212179051652055040": {
                string: "20th of August 2004",
                date: new Date("2004-08-20"),
            }, // martin
            "795261856964673536": {
                string: "12th of September 2007",
                date: new Date("2007-09-12"),
            }, // aishi
            "227032992978042881": {
                string: "1st of October 2003",
                date: new Date("2003-10-01"),
            }, // tibi
            "696943140183081052": {
                string: "12th of November 2008",
                date: new Date("2008-11-12"),
            }, // rye
        };

        const user = interaction.options.getUser("user");

        if (user) {
            const birthday = birthdays[user.id];
            if (!birthday) return interaction.reply({ content: "This user does not have a birthday set.", ephemeral: true });
            const daysLeft = daysLeftUntilBirthday(birthday.date);
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}'s birthday`)
                .setDescription(`Their birthday is on ${birthday.string}, which is in ${daysLeft} days!`)
                .setTimestamp()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle("Birthdays of bros before hoes members")
                .setDescription(
                    Object.entries(birthdays)
                        .map(([id, birthday]) => {
                            const daysLeft = daysLeftUntilBirthday(birthday.date);
                            const age = calculateAge(birthday.date);
                            return `<@${id}> - ${birthday.string} - **${daysLeft} days left** - ${age}yo \n`;
                        })
                        .join("\n")
                )
                .setTimestamp()
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });
            interaction.reply({ embeds: [embed] });
        }

        function daysLeftUntilBirthday(date) {
            const today = new Date();
            const nextBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate());
            if (today > nextBirthday) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
            const daysLeft = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
            return daysLeft;
        }

        function calculateAge(date) {
            const today = new Date();
            const m = today.getMonth() - date.getMonth();
            let age = today.getFullYear() - date.getFullYear();
            if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
            return age;
        }
    },
});
