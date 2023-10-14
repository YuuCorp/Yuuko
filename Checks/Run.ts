import fs from "node:fs";
import path from "node:path";
import { Check } from "#Structures/Check.ts";

// Flatten the array of checks
const checks: Check[] = (
  await Promise.all(
    fs
      .readdirSync(path.join(__dirname))
      .filter((file) => file.endsWith(".ts") && file !== "Run.ts")
      .map(async (file) => {
        const check = await import(path.join(__dirname, file));
        return check.default;
      }),
  )
).flat();
console.log(`[CheckRunner] Running ${checks.length} checks...`);

for (const check of checks) {
  try {
    check.run();
    console.log(`[✅] Check "${check.name}" passed.`);
  } catch (e) {
    if (check.optional === true) {
      console.warn(`[⚠️] Optional check "${check.name}" failed. This may or may not cause problems in the future.
            > Purpose: ${check.description}
            > Why: ${e}
            `);
    } else {
      throw new Error(`[❌] FATAL: Critical check "${check.name}" failed. Cannot continue.
            > Purpose: ${check.description}
            > Why: ${e}
            `);
    }
  }
}

console.log(`[CheckRunner] Checks passed!`);
