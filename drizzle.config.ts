import type { Config } from "drizzle-kit";

export default {
    schema: "src/database/schema.ts",
    out: "./src/databaseMigration/drizzle",
    driver: "libsql",
    dbCredentials: {
        url: "file:./src/database/sqlite/db.sqlite",
    },
} satisfies Config;
