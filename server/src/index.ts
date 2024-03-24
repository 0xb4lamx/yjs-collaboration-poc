import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { logger } from "hono/logger";
import { greet } from "shared";
import { trpcRouter } from "./trpcRouter";

export type HonoType = {
  Variables: {};
  Bindings: {};
};

export type TrpcContext = {
  env: HonoType["Bindings"];
};

const app = new Hono<HonoType>();

app.use("*", cors());
app.use("*", logger());
// app.use("*", authMiddleware);

app.get("/", (c) => {
  return c.json({
    message: greet("World"),
  });
});

app.use("/trpc/*", async (c) => {
  const res = fetchRequestHandler({
    router: trpcRouter,
    endpoint: "/trpc",
    req: c.req.raw,
    createContext: (): TrpcContext => ({
      env: env(c),
    }),
  });

  return res;
});

export default app;
