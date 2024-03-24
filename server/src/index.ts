import { env } from "hono/adapter";
import { serveStatic } from "hono/bun";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { lucia } from "./lib/auth";
import { db } from "./lib/db";
import { trpcRouter } from "./trpcRouter";
// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils";

import type { Session, User } from "lucia";
import { parseNameFromPath } from "./lib/utils";
import { HonoWithSockets } from "./lib/honoWithSocket";

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

const server = new HonoWithSockets<HonoType>();
server.api.use("*", logger());

server.api.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

server.api.use("*", csrf());

server.api.use("/trpc/*", async (c, next) => {
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

server.api.use("/trpc/*", async (c) => {
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

server.api.get("/ws/*", (c) => {
  const docName = parseNameFromPath(c.req.url);

  return server.ws(c, {}, (ws) => {
    setTimeout(() => {
      setupWSConnection(ws, c.req, { docName });
    }, 0);
  });
});

server.api.use("/*", (c, next) => {
  return serveStatic({ root: "./client/" })(c, next);
});

server.api.get("*", serveStatic({ path: "./client/index.html" }));

server.listen(3000);
