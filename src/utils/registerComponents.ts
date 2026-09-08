import path from "node:path";
import fs from "node:fs";
import type { YuukoComponent } from ".";
import type { Client } from "#structures/index";
import { srcPath } from "./paths";
import { logger } from "#src/utils/logger";

export async function registerComponents(client: Client) {
  const compPath = srcPath("components");
  const componentFiles = fs.readdirSync(compPath).filter((file) => file.endsWith(".ts"));

  const components: YuukoComponent[] = [];

  for (const file of componentFiles) {
    const filePath = path.join(compPath, file);
    const module = await import(filePath) as { default: YuukoComponent };

    components.push(module.default);
  }

  for (const component of components) {
    logger.info("Component loaded", { type: "startup", component: component.name });
    client.components.set(component.name, component);
  }
}
