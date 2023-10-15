import fs from "node:fs";
import type { Message } from "discord.js";
import { ActivityType, ChannelType } from "discord.js";
import { YuukoEvent } from "../Structures/Event";

export default new YuukoEvent("ready", (client) => {
  if (!client.user) return;
  setInterval(async () => {
    client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
  }, 15000);

  console.log(`${client.user.tag} is ready!`);

  // React to update command output if exists
  if (fs.existsSync("./Local/updatemsg.json")) {
    const updatemsg = JSON.parse(fs.readFileSync("./Local/updatemsg.json").toString());
    try {
      const channel = client.channels.cache.get(updatemsg.channelId);
      // TODO: Actually check if this works
      if (channel && channel.type === ChannelType.GuildText) {
        channel?.messages.fetch(updatemsg.id).then(async (msg: Message) => {
          await msg.react("❤️");
          console.log("Heartbeat sent to update output.");
        });
      }
      fs.unlink("./Local/updatemsg.json", (err) => {
        if (err) throw err;
        else console.log("Deleted updatemsg.json");
      });
    } catch (err) {
      console.log("Failed to react to update message", err);
    }
  }
});
