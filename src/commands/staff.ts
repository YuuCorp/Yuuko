import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Command } from "#structures/index";
import { buildPagination, footer, graphQLRequest, SeriesTitle, getOptions, YuukoError } from "#utils/index";

const name = "staff";
const usage = "staff <name>";
const description = "Gives you info about a staff member from anilist's DB.";

export default {
  name,
  usage,
  description,
  commandType: "Anilist",
  withBuilder: new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) => option.setName("query").setDescription("The query to search for").setRequired(true)),

  run: async ({ interaction, client }): Promise<void> => {

    const { query: staffName } = getOptions<{ query: string }>(interaction.options, ["query"]);

    const {
      data: { Staff: data },
      headers
    } = await graphQLRequest("Staff", { staffName });
    if (!data) throw new YuukoError("Couldn't find any data.", { staffName });
    const staffMedia = data.staffMedia;
    const characterMedia = data.characterMedia;


    // Fix the description by replacing and converting HTML tags
    const descLength = 1000;
    const description =
      data.description
        ?.replace(/<br><br>/g, "\n")
        .replace(/<br>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/~!|!~/g, "||") /* .replace(/\n\n/g, "\n") */ || "No description available.";
    const staffEmbed = new EmbedBuilder()
      .setThumbnail(data.image!.large!)
      .setTitle(data.name!.full!)
      .setDescription(description.length > descLength ? `${description.substring(0, descLength)}...` || "No description available." : description || "No description available.")
      .addFields({ name: "Staff Info: \n", value: `**Age**: ${data.age || "No age specified"} **Gender**: ${data.gender || "No gender specified."}\n **Home Town**: ${data.homeTown || "No home town specified."}` })
      .setURL(data.siteUrl || "https://anilist.co")
      .setColor("Green")
      .setFooter(footer(headers));

    const pageList = [staffEmbed];
    if (staffMedia?.edges && staffMedia.edges.length > 0) {
      const media = staffMedia.edges.map((edge) => {
        if (!edge?.node || !edge?.staffRole) return;
        return `${edge.staffRole} - [${edge.node.title?.english || edge.node.title?.romaji || edge.node.title?.native}](${edge.node.siteUrl})`;
      });
      const mediaEmbed = new EmbedBuilder()
        .setThumbnail(data.image!.large!)
        .setTitle(`${data.name!.full}'s Media`)
        .setDescription(media.join("\n"))
        .setURL(data.siteUrl || "https://anilist.co")
        .setColor("Green");
      pageList.push(mediaEmbed);
    }
    if (characterMedia?.edges && characterMedia.edges.length > 0) {
      const media = characterMedia.edges.map((node) => {
        if (!node?.node || !node?.characters) return;
        const work = node.characters.map((character) => {
          return `${character?.name?.full || "Unknown"} - [${SeriesTitle(node.node?.title || undefined)}](${node.node?.siteUrl || "https://anilist.co"})`;
        });
        return work;
      });
      const charEmbed = new EmbedBuilder()
        .setThumbnail(data.image!.large!)
        .setTitle(`${data.name!.full}'s Characters`)
        .setDescription(media.join("\n"))
        .setURL(data.siteUrl || "https://anilist.co")
        .setColor("Green");
      pageList.push(charEmbed);
    }
    return void await buildPagination(interaction, pageList);
  },
} satisfies Command;
