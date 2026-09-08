import fs from 'node:fs'
import path from 'node:path';
import type { Check } from "#structures/index";
import { srcPath } from "#utils/paths";
import { logger } from "#src/utils/logger";

export async function runChecks() {
  // Flatten the array of checks
  const checksPath = srcPath("checks");
  const checkFiles = fs.readdirSync(checksPath).filter((file) => file.endsWith(".ts"));

  const checks: Check[] = [];

  for (const file of checkFiles) {
    const filePath = path.join(checksPath, file);
    const module = await import(filePath) as { default: Check };

    checks.push(module.default);
  }

  logger.info("Running checks", { type: "check", total: checks.length });

  for (const check of checks) {
    try {
      await check.run()
      logger.info("Check passed", { type: "check", name: check.name, optional: check.optional });
    }
    catch (e) {
      if (check.optional === true) {
        logger.log("warn", "Optional check failed", {
          type: "check",
          name: check.name,
          purpose: check.description,
          why: serializeError(e),
        });
      }
      else {
        throw new Error(`Critical check "${check.name}" failed
              > Purpose: ${check.description}
              > Why: ${serializeError(e)}
              `)
      }
    }
  }

  logger.info("Checks passed!");
}

function serializeError(e: unknown): string {
  if (e instanceof Error) {
    return e.stack ?? e.message;
  }

  if (typeof e === "object" && e !== null) {
    return JSON.stringify(e);
  }

  return String(e);
}