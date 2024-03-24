import {
  primaryKey,
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
});

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  passwordHash: text("password_hash").notNull(),
});

export const usersRelations = relations(userTable, ({ many }) => ({
  usersToBoards: many(usersToBoardsTable),
}));

export const boardTable = sqliteTable("board", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const boardRelations = relations(boardTable, ({ many }) => ({
  usersToBoards: many(usersToBoardsTable),
}));

export const usersToBoardsTable = sqliteTable(
  "board_user",
  {
    boardId: text("board_id")
      .notNull()
      .references(() => boardTable.id),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.boardId, t.userId] }),
  })
);

export const usersToBoardsRelations = relations(
  usersToBoardsTable,
  ({ one }) => ({
    board: one(boardTable, {
      fields: [usersToBoardsTable.boardId],
      references: [boardTable.id],
    }),
    user: one(userTable, {
      fields: [usersToBoardsTable.userId],
      references: [userTable.id],
    }),
  })
);
