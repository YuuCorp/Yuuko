import type { Config } from "drizzle-kit";

export default {
  schema: "src/Database/statsSchema.ts",
  out: "./src/Database/drizzle/stats",
  driver: "libsql",
  dbCredentials: {
    url: "file:./src/Database/statsdb.sqlite",
  },
} satisfies Config;