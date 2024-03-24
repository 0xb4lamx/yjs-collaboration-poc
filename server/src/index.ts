import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { lucia } from "./lib/auth";
import { db } from "./lib/db";
import { trpcRouter } from "./trpcRouter";

import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import type { Session, User } from "lucia";

export type HonoType = {
  Variables: {
    user: User | null;
    session: Session | null;
  };
  Bindings: {};
};

export type TrpcContext = {
  env: HonoType["Bindings"];
  user: User | null;
  session: Session | null;
  db: typeof db;
  setCookie: (serializeValue: string) => void;
};

const app = new Hono<HonoType>();
app.use("*", logger());

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use("*", csrf());

app.use("*", async (c, next) => {
  const cookieName = lucia.sessionCookieName;
  const sessionId = getCookie(c, cookieName) ?? null;

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);
  return next();
});

app.use("/trpc/*", async (c) => {
  const res = fetchRequestHandler({
    router: trpcRouter,
    endpoint: "/trpc",
    req: c.req.raw,
    createContext: (): TrpcContext => ({
      env: env(c),
      user: c.get("user"),
      session: c.get("session"),
      db: db,
      setCookie: (serializeValue) => {
        c.res.headers.set("Set-Cookie", serializeValue);
      },
    }),
  });

  return res;
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
