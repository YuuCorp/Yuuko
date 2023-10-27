import fs from "node:fs";
import type { Message } from "discord.js";
import { ActivityType, ChannelType } from "discord.js";
import type { YuukoEvent } from "../Structures";
import { registerCommands, registerEvents } from "../Utils";
import { registerComponents } from "../Utils/registerComponents";

export const run: YuukoEvent<"ready"> = async (client) => {
  if (!client.user) return;
  setInterval(async () => {
    client.user?.setPresence({ activities: [{ type: ActivityType.Watching, name: `${client.guilds.cache.size} servers` }], status: "online" });
  }, 15000);

  await registerCommands(client);
  await registerComponents(client);

  client.log(`${client.user.tag} is ready!`);

  // React to update command output if exists
  if (fs.existsSync("./src/Local/updatemsg.json")) {
    const updatemsg = JSON.parse(fs.readFileSync("./src/Local/updatemsg.json").toString());
    try {
      const channel = client.channels.cache.get(updatemsg.channelId);
      // TODO: Actually check if this works
      if (channel && channel.type === ChannelType.GuildText) {
        channel?.messages.fetch(updatemsg.id).then(async (msg: Message) => {
          await msg.react("❤️");
          console.log("Heartbeat sent to update output.");
        });
      }
      fs.unlink("./src/Local/updatemsg.json", (err) => {
        if (err) throw err;
        else console.log("Deleted updatemsg.json");
      });
    } catch (err) {
      console.log("Failed to react to update message", err);
    }
  }
};
