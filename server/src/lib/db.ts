import { drizzle } from "drizzle-orm/bun-sqlite";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

import { Database } from "bun:sqlite";
import { sessionTable, userTable } from "./schema";

import { mkdirSync } from "fs";
mkdirSync("../db", { recursive: true });

const sqlite = new Database("../db/sqlite.db", {
  create: true,
});

export const db = drizzle(sqlite, { schema });
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

migrate(db, { migrationsFolder: "./migrations" });
