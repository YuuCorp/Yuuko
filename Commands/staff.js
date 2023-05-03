const Discord = require("discord.js"),
  { EmbedBuilder, SlashCommandBuilder } = require("discord.js"),
  Command = require("#Structures/Command.js"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  Footer = require("#Utils/Footer.js"),
  BuildPagination = require("#Utils/BuildPagination.js"),
  EmbedError = require("#Utils/EmbedError.js"),
  GraphQLRequest = require("#Utils/GraphQLRequest.js"),
  seriesTitle = require("#Utils/SeriesTitle.js"),
  GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "staff";
const usage = "staff <name>";
const description = "Gives you info about a staff member from anilist's DB.";

module.exports = new Command({
  name,
  usage,
  description,
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  async run(interaction, args, run) {
    let vars = { staffName: interaction.options.getString("query") };

    // TODO: Fixme description length, it crashes the bot.

    GraphQLRequest(GraphQLQueries.Staff, vars)
      .then((response, headers) => {
        let data = response.Staff;
        let staffMedia = data.staffMedia;
        let characterMedia = data.characterMedia;
        if (data) {
          // Fix the description by replacing and converting HTML tags
          const descLength = 1000;
          let description =
            data.description
              ?.replace(/<br><br>/g, "\n")
              .replace(/<br>/g, "\n")
              .replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, " ")
              .replace(/~!|!~/g, "||") /*.replace(/\n\n/g, "\n")*/ || "No description available.";
          const staffEmbed = new EmbedBuilder()
            .setThumbnail(data.image.large)
            .setTitle(data.name.full)
            .setDescription(description.length > descLength ? description.substring(0, descLength) + "..." || "No description available." : description || "No description available.")
            .addFields({ name: "Staff Info: \n", value: `**Age**: ${data.age || "No age specified"} **Gender**: ${data.gender || "No gender specified."}\n **Home Town**: ${data.homeTown || "No home town specified."}` })
            .setURL(data.siteUrl)
            .setColor("Green")
            .setFooter(Footer(headers));

          const pageList = [staffEmbed];
          if (staffMedia.edges.length > 0) {
            const media = staffMedia.edges.map((edge) => {
              return `${edge.staffRole} - [${edge.node?.title?.english || edge.node?.title?.romaji || edge.node?.title?.native}](${edge.node.siteUrl})`;
            });
            const mediaEmbed = new EmbedBuilder()
              .setThumbnail(data.image.large)
              .setTitle(data.name.full + "'s Media")
              .setDescription(media.join("\n"))
              .setURL(data.siteUrl)
              .setColor("Green");
            pageList.push(mediaEmbed);
          }
          if (characterMedia.edges.length > 0) {
            const media = characterMedia.edges.map((node) => {
              const work = node.characters.map((character) => {
                return `${character.name.full || "Unknown"} - [${seriesTitle(node.node)}](${node.node.siteUrl})`;
              });
              return work;
            });
            const charEmbed = new EmbedBuilder()
              .setThumbnail(data.image.large)
              .setTitle(data.name.full + "'s Characters")
              .setDescription(media.join("\n"))
              .setURL(data.siteUrl)
              .setColor("Green");
            pageList.push(charEmbed);
          }
          return BuildPagination(interaction, pageList).paginate();
        } else {
          return interaction.reply({ embeds: [EmbedError(`Couldn't find any data.`, vars)] });
        }
      })
      .catch((error) => {
        console.error(error);
        interaction.reply({ embeds: [EmbedError(error, vars)] });
      });
  },
});
