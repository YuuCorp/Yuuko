import type { YuukoComponent } from ".";
import type { Client } from "#structures/index";
import path from "path";
import fs from "fs";

export async function registerComponents(client: Client) {
  const compPath = path.join(import.meta.dir, "..", "components");
  fs.readdirSync(compPath)
    .filter((file) => file.endsWith(".ts"))
    .forEach(file => {
      const component = require(path.join(compPath, file)).default as YuukoComponent;
      client.log(`Component ${component.name} loaded`, "Info");
      client.components.set(component.name, component);
    });
}
