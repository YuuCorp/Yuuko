import fs from 'node:fs'
import { Client, type Check } from "#structures/index";
import { srcPath } from "#utils/paths";
import { logger } from "#src/utils/logger";

export async function runChecks(client: Client) {
  // Flatten the array of checks
  const checks: Check[] = (
    await Promise.all(
      fs
        .readdirSync(srcPath("checks"))
        .filter(file => file.endsWith('.ts') && file !== 'run.ts')
        .map(async (file) => {
          const check = await import(srcPath("checks", file))
          return check.default
        }),
    )
  ).flat()
  logger.info("Running checks", { type: "check", total: checks.length });

  for (const check of checks) {
    try {
      check.run()
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
              > Why: ${e}
              `)
      }
    }
  }

  logger.info("Checks passed!");
}

function serializeError(e: unknown) {
  if (e instanceof Error) {
    return {
      message: e.message,
      stack: e.stack,
      name: e.name,
    };
  }
  return e;
}