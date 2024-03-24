import { drizzle } from "drizzle-orm/better-sqlite3";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

import Database from "better-sqlite3";
import { sessionTable, userTable } from "./schema";

const sqlite = new Database("../db/sqlite.db");

export const db = drizzle(sqlite, { schema });
export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);

migrate(db, { migrationsFolder: "./migrations" });
