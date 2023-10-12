const Discord = require('discord.js')
const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const Command = require('#Structures/Command.js')
const BuildPagination = require('#Utils/BuildPagination.js')
const UserBirthday = require('#Models/UserBirthday.js')
const CommandCategories = require('#Utils/CommandCategories.js')

const name = 'birthday'
const usage = 'birthday <user | list | set>'
const description = 'Shows general list of birthdays for BBH server, or shows birthday for specific person.'

module.exports = new Command({
  name,
  usage,
  description,
  type: CommandCategories.Misc,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('The user to get the birthday of.')
        .addUserOption(option => option.setName('user').setDescription('The user to get the birthday of.').setRequired(true)),
    )
    .addSubcommand(subcommand => subcommand.setName('list').setDescription('List the birthdays of all registered users in this guild.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set your birthday.')
        .addStringOption(option => option.setName('date').setDescription('The date of your birthday. Format: YYYY-MM-DD').setMinLength(10).setMaxLength(10).setRequired(true)),
    ),

  async run(interaction, args, run) {
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === 'set') {
      const date = interaction.options.getString('date')
      const birthday = new Date(date)
      if (birthday.toString() === 'Invalid Date')
        return interaction.reply({ content: 'Invalid date format. Please use YYYY-MM-DD.', ephemeral: true })
      const userBirthday = await UserBirthday.findOne({ where: { user_id: interaction.user.id } })
      if (userBirthday) {
        userBirthday.birthday = birthday
        await userBirthday.save()
      }
      else {
        await UserBirthday.create({ user_id: interaction.user.id, birthday, guild_id: interaction.guild.id })
      }
      return interaction.reply({ content: `Your birthday has been set to ${getReadableDate(birthday)}.`, ephemeral: true })
    }

    if (subcommand === 'user') {
      const user = interaction.options.getUser('user')
      const birthday = await UserBirthday.findOne({ where: { user_id: user.id } })
      if (!birthday)
        return interaction.reply({ content: `${user.tag} has not set their birthday.`, ephemeral: true })
      const daysLeft = daysLeftUntilBirthday(birthday.birthday)
      const age = calculateAge(birthday.birthday)

      const embed = new EmbedBuilder().setTitle(`${user.tag}'s Birthday`).addFields(
        {
          name: 'Birthday',
          value: getReadableDate(birthday.birthday),
        },
        {
          name: 'Age',
          value: age.toString(),
        },
        {
          name: 'Days Left',
          value: daysLeft.toString(),
        },
      )
      return interaction.reply({ embeds: [embed] })
    }

    if (subcommand === 'list') {
      const birthdays = await UserBirthday.findAll({ where: { guild_id: interaction.guild.id } })
      if (birthdays.length === 0)
        return interaction.reply({ content: 'There are no birthdays registered for this server.', ephemeral: true })
      const embeds = []
      let currentEmbed = new EmbedBuilder().setTitle('Birthdays')
      let currentEmbedIndex = 0
      let currentEmbedField = 0
      let embedDescription = ''

      // Co-authored by Github Copilot
      const sortedBirthdays = birthdays.sort((a, b) => {
        const aDate = new Date(a.birthday)
        const bDate = new Date(b.birthday)
        if (aDate.getMonth() === bDate.getMonth())
          return aDate.getDate() - bDate.getDate()
        return aDate.getMonth() - bDate.getMonth()
      })

      for (const birthday of sortedBirthdays) {
        const daysLeft = daysLeftUntilBirthday(birthday.birthday)
        const age = calculateAge(birthday.birthday)
        currentEmbedField++
        if (daysLeft > 0)
          embedDescription += `<@${birthday.user_id}> ${getReadableDate(birthday.birthday)} (${age} years old, ${daysLeft} days left)\n\n`
        else embedDescription += `<@${birthday.user_id}> ${getReadableDate(birthday.birthday)} (${age} years old, **Birthday Today!**)\n\n`
        if (currentEmbedField === 10 && birthdays.length > 10) {
          currentEmbed.setDescription(embedDescription)
          embeds.push(currentEmbed)
          currentEmbed = new EmbedBuilder().setTitle('Birthdays')
          currentEmbedIndex++
          currentEmbedField = 0
          embedDescription = ''
        }
        else if (currentEmbedField === birthdays.length) {
          currentEmbed.setDescription(embedDescription)
          embeds.push(currentEmbed)
        }
      }
      BuildPagination(interaction, embeds).paginate()
    }

    function daysLeftUntilBirthday(date) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const nextBirthday = new Date(today.getFullYear(), date.getMonth(), date.getDate())
      if (today > nextBirthday)
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
      const daysLeft = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24))
      return daysLeft
    }

    function getReadableDate(date) {
      const day = date.getDate()
      const month = date.toLocaleString('default', { month: 'long' })
      const year = date.getFullYear()
      return `${day}${getDaySuffix(day)} of ${month}, ${year}`
    }

    function getDaySuffix(day) {
      if (day > 3 && day < 21)
        return 'th'
      const lastDigit = day % 10
      if (lastDigit === 1)
        return 'st'
      if (lastDigit === 2)
        return 'nd'
      if (lastDigit === 3)
        return 'rd'
      return 'th'
    }

    function calculateAge(date) {
      const today = new Date()
      const m = today.getMonth() - date.getMonth()
      let age = today.getFullYear() - date.getFullYear()
      if (m < 0 || (m === 0 && today.getDate() < date.getDate()))
        age--
      return age
    }
  },
})
