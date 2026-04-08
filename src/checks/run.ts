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
  client.logger.info("Running checks", { total: checks.length });

  for (const check of checks) {
    try {
      check.run()
      client.logger.info("Check passed", { check: check.name });
    }
    catch (e) {
      if (check.optional === true) {
        client.logger.log("warn", "Optional check failed", {
          check: check.name,
          purpose: check.description,
          why: e,
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
