import { env } from "hono/adapter";
import { serveStatic } from "hono/bun";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import * as Y from 'yjs'
// @ts-ignore
import { setupWSConnection, docs, setPersistence, WSSharedDoc } from "y-websocket/bin/utils";
import { LeveldbPersistence } from 'y-leveldb'

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { lucia } from "./lib/auth";
import { db } from "./lib/db";
import { trpcRouter } from "./trpcRouter";

const ldb = new LeveldbPersistence('./statedesign-store')
setPersistence({
  provider: ldb,
  bindState: async (docName: string, ydoc: WSSharedDoc) => {
    //executed on closeConn(), if persistence enabled,will store state then destroy ydocument
    //ref to https://github.com/yjs/y-websocket/blob/master/bin/utils.cjs#L168
    const persistedYdoc = await ldb.getYDoc(docName)
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
    //y-leveldb only stores incremental updates
    ydoc.on('update', (update: Uint8Array) => {
      ldb.storeUpdate(docName, update)
    })
  },
  writeState: async (_docName: string, _ydoc: WSSharedDoc) => {
    //executed on closeConn(), if persistence enabled,will store state in DB then destroy ydocument
    //ref to https://github.com/yjs/y-websocket/blob/master/bin/utils.cjs#L225
    console.log('no one in the room anymore, let\'s save it to DB')
    console.log(_ydoc.toJSON())
    // save to postgreSQL, which type, binary? (performance wise it makes sense! what about readability by different teams?) 
  }
})

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
    //why we need setTimeout here?
    setTimeout(() => {
      setupWSConnection(ws, c.req, { docName });
    }, 0);
  });
});

server.api.use("/*", (c, next) => {
  return serveStatic({ root: "./client/" })(c, next);
});

server.api.get("*", serveStatic({ path: "./client/index.html" }));

// log some stats
setInterval(() => {
  let conns = 0
  docs.forEach( (doc: WSSharedDoc) => { conns += doc.conns.size })
  const stats = {
    conns,
    docs: docs.size,
    websocket: `ws://localhost:${3000}`,
  }
  console.log(`${new Date().toISOString()} Stats: ${JSON.stringify(stats)}`)
}, 10000)

server.listen(3000);
