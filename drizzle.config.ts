import type { Config } from "drizzle-kit";

export default {
  schema: "src/Database/schema.ts",
  out: "./src/Database/drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "src/Database/db.sqlite",
  },
  verbose: true,
  strict: true,
  tablesFilter: ["!libsql_wasm_func_table"],

} satisfies Config;