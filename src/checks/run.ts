import fs from 'node:fs'
import path from 'node:path'
import { Client, type Check } from "#structures/index";

export async function runChecks(client: Client) {
  // Flatten the array of checks
  const checks: Check[] = (
    await Promise.all(
      fs
        .readdirSync(path.join(import.meta.dir))
        .filter(file => file.endsWith('.ts') && file !== 'run.ts')
        .map(async (file) => {
          const check = await import(path.join(import.meta.dir, file))
          return check.default
        }),
    )
  ).flat()
  client.logger.info("Running checks", { type: "check", total: checks.length });

  for (const check of checks) {
    try {
      check.run()
      client.logger.info("Check passed", { type: "check", name: check.name, optional: check.optional });
    }
    catch (e) {
      if (check.optional === true) {
        client.logger.log("warn", "Optional check failed", {
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

  client.logger.info("Checks passed!");
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