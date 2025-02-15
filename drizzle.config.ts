import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./src/database/migration",
    schema: "./src/database/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:./src/database/sqlite/db.sqlite",
    }
});
