import path from "path";
import { Collection, Client as DiscordClient, type ClientOptions } from "discord.js";
import type { YuukoComponent } from "#utils/types";
import type { ClientCommand } from "./command";
import Logger from "#utils/logger";
import { RSA } from "#utils/rsaEncryption";

export class Client extends DiscordClient {
  public commands: Collection<string, ClientCommand>;
  public components: Collection<string, YuukoComponent>;
  public cooldowns: Collection<string, Collection<string, number>>; // alternative: { name: string, expire: number}[]>
  public logger: Logger;
  public rsa: RSA;

  constructor(o: ClientOptions) {
    super(o);

    this.logger = new Logger(path.join(import.meta.dir, "..", "Logging", "Logs.log"));
    this.commands = new Collection();
    this.components = new Collection();
    this.cooldowns = new Collection();
    this.rsa = new RSA();
  }

  log(text: string, category: string) {
    this.logger.log(text, category);
  }
}
