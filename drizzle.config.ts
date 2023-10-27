import type { Config } from "drizzle-kit";

export default {
  schema: "src/Database/schema.ts",
  out: "./src/Database/drizzle",
  driver: "libsql",
  dbCredentials: {
    url: "file:./src/Database/db.sqlite",
  },
} satisfies Config;