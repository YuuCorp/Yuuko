const Discord = require("discord.js");
const Client = require("./Client.js");
/**
 *
 * @param {Discord.Message | Discord.Interaction} message
 * @param {string[]} args
 * @param {Client} client
 */
function RunFunction(message, args, client) {}

class Command {
  /**
   * @param {objects} options
   */
  constructor(options) {
    this.usage = options.usage;
    this.name = options.name;
    this.description = options.description;
    this.type = options.type;
    this.run = options.run;
    if (options.slash) {
      this.slash = options.slash;
    }
    if (options.guildOnly) {
        this.guildOnly = options.guildOnly;
    }
    if (options.middlewares) {
      this.middlewares = options.middlewares;
    }
  }
}

module.exports = Command;
