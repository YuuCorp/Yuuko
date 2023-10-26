import type { YuukoComponent } from ".";
import type { Client } from "../Structures";
import fs from "fs";

export async function registerComponents(client: Client) {
  fs.readdirSync("./src/Components")
    .filter((file) => file.endsWith(".ts"))
    .forEach(async (file) => {
      const comp: YuukoComponent = (await import(`#Components/${file}`)).default;
      client.log(`Component ${comp.name} loaded`);
      client.components.set(comp.name, comp);
    });
}
