import type { Config } from "drizzle-kit";

export default {
  schema: "src/Database/schema.ts",
  out: "./src/Database/drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "src/Database/db.sqlite",
  },
} satisfies Config;