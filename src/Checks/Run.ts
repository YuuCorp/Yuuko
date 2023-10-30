import fs from 'node:fs'
import path from 'node:path'
import { Client } from "../Structures";
import type { Check } from '../Structures/Check'

export async function runChecks(client: Client) {
  // Flatten the array of checks
  const checks: Check[] = (
    await Promise.all(
      fs
        .readdirSync(path.join(__dirname))
        .filter(file => file.endsWith('.ts') && file !== 'Run.ts')
        .map(async (file) => {
          const check = await import(path.join(__dirname, file))
          return check.default
        }),
    )
  ).flat()
  client.log(`[CheckRunner] Running ${checks.length} checks...`)

  for (const check of checks) {
    try {
      check.run()
      client.log(`[✅] Check "${check.name}" passed.`)
    }
    catch (e) {
      if (check.optional === true) {
        console.warn(`[⚠️] Optional check "${check.name}" failed. This may or may not cause problems in the future.
              > Purpose: ${check.description}
              > Why: ${e}
              `)
      }
      else {
        throw new Error(`[❌] FATAL: Critical check "${check.name}" failed. Cannot continue.
              > Purpose: ${check.description}
              > Why: ${e}
              `)
      }
    }
  }

  client.log(`[CheckRunner] Checks passed!`)
}