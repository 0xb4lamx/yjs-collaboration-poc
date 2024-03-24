import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/lib/schema.ts",
  driver: "better-sqlite",
  dbCredentials: {
    url: "../db/sqlite.db",
  },
  verbose: true,
  strict: true,
  out: "./migrations",
});
