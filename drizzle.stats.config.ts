import type { Config } from "drizzle-kit";

export default {
    schema: "src/database/statsSchema.ts",
    out: "./src/databaseMigration/drizzle/stats",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:./src/database/sqlite/statsdb.sqlite",
    },
} satisfies Config;
