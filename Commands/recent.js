const Discord = require("discord.js"),
  { EmbedBuilder, SlashCommandBuilder, AttachmentBuilder } = require("discord.js"),
  { mwGetUserEntry } = require("#Middleware/UserEntry.js"),
  Command = require("#Structures/Command.js"),
  EmbedError = require("#Utils/EmbedError.js"),
  SeriesTitle = require("#Utils/SeriesTitle.js"),
  Canvas = require("canvas"),
  CommandCategories = require("#Utils/CommandCategories.js"),
  GraphQLRequest = require("#Utils/GraphQLRequest.js"),
  GraphQLQueries = require("#Utils/GraphQLQueries.js");

const name = "recent";
const usage = "recent";
const description = "Shows the 9 most recent watched/read media of the user in a image grid.";

module.exports = new Command({
  name,
  usage,
  description,
  middlewares: [mwGetUserEntry],
  type: CommandCategories.Anilist,
  slash: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("type").setDescription("The type of media to search for").addChoices({ name: "Anime", value: "ANIME" }, { name: "Manga", value: "MANGA" }).setRequired(true))
    .addStringOption((option) => option.setName("user").setDescription("The user to search for").setRequired(false)),

  async run(interaction, args, run) {
    const userName = interaction.options.getString("user");
    const mediaType = interaction.options.getString("type");

    let vars = {
      perPage: 9,
      type: mediaType,
    };

    if (!userName) {
      // We try to use the one the user set
      try {
        vars.userId = interaction.alID;
      } catch (error) {
        console.error(error);
        return interaction.reply({ embeds: [EmbedError(`You have yet to set an AniList token.`)] });
      }
    } else {
      vars.user = userName;
    }

    try {
      let data = await GraphQLRequest(GraphQLQueries.RecentChart, vars);
      data = data.Page.mediaList;

      if (!data) return interaction.reply({ embeds: [EmbedError("Unable to find specified user", vars)] });

      const canvas = Canvas.createCanvas(1000, 1000);
      const ctx = canvas.getContext("2d");

      let x = 0,
        y = 0;

      for (item of data) {
        const cover = item.media.coverImage?.extraLarge || "https://i.imgur.com/Hx8474m.png"; // Placeholder image
        const canvasImage = await Canvas.loadImage(cover);

        const width = 1000 / Math.ceil(data.length / 3);
        const height = (width / canvasImage.width) * canvasImage.height;

        ctx.drawImage(canvasImage, x, y, width, height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(x, y + width - 40, width, 40);

        ctx.font = "17px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        const title = SeriesTitle(item.media);
        const status = parseStatus(item, mediaType);
        ctx.fillText(status, x + width / 2, y + width - 24);
        ctx.fillText(title, x + width / 2, y + width - 5);
        x += width;
        if (x >= 999) {
          x = 0;
          y += width;
        }
      }

      const canvasResult = canvas.toBuffer();
      if (!canvasResult) return interaction.reply({ embeds: [EmbedError("Encountered an error whilst trying to create the image.", vars)] });
      const attachment = new AttachmentBuilder(canvasResult);
      interaction.reply({ files: [attachment] });
    } catch (error) {
      interaction.reply({ embeds: [EmbedError(error, vars)] });
    }
  },
});

function parseStatus(data, mediaType) {
  if (!data.status) return "Unknown";
  switch (data.status) {
    case "CURRENT":
      if (mediaType === "ANIME") return `Watched Episode ${data.progress} of`;
      else return `Read Chapter ${data.progress} of`;
    case "PLANNING":
      if (mediaType === "ANIME") return `Planning to Watch`;
      else return `Planning to Read`;
    case "COMPLETED":
      return `Completed`;
    case "PAUSED":
      return `Paused`;
    case "DROPPED":
      return `Dropped`;
    case "REPEATING":
      if (mediaType === "ANIME") return `Re-watching`;
      else return `Re-reading`;
  }
}
