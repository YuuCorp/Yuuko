import fs from 'node:fs'
import path from 'node:path'

const checks = fs
  .readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && !f.includes('Run.js'))
  .map(f => require(path.join(__dirname, f)))
  .filter(c => Array.isArray(c))
  .flat()

console.log(`[CheckRunner] Running ${checks.length} checks...`)

for (const check of checks) {
  try {
    check.run()
    console.log(`[✅] Check "${check.name}" passed.`)
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

console.log(`[CheckRunner] Checks passed!`)
