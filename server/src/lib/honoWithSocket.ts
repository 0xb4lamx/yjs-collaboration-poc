/**
 * REF: https://gist.github.com/tobowers/2117365c8210d1758a4c6e2f859619c0
 */

import { Server, ServerWebSocket } from "bun";
import { Hono, Context, Env } from "hono";
import { nanoid } from "nanoid";
import { EventEmitter } from "node:events";
import { type WebSocket } from "ws";
import { createFactory } from "hono/factory";

/*
  See: https://github.com/oven-sh/bun/issues/7346
  Bun has a bug where they tried to make the "ws" package work in Bun by mocking out some of the underlying implementation
  Unfortunately, this implementation is not complete and is missing the ping() method, which HocusPocus uses to determine if a connection is still alive.
  *Native* bun websockets support ping, but lack an eventlistener (on purpose)
  So, what we do is wrap the native bun websocket in a proxy, but also expose an event emitter.
  Then we use the native bun server to upgrade the connection, and keep track of these delegated websockets.
  We'll use the Hono framework ( https://hono.dev/ ) which is both fast and batteries included like express
  to expose regular API endpoints, and provide a convenience method for upgrading the connection to a websocket
  on certain paths.
*/

export class DelegatedWebsocket extends EventEmitter {
  constructor(private underlyingSocket?: ServerWebSocket) {
    super();

    // Create a proxy to handle method calls
    return new Proxy(this, {
      get: (_obj, prop) => {
        // Customize the behavior of one specific method
        if (
          [
            "on",
            "emit",
            "swapSocket",
            "once",
            "removeListener",
            "removeListeners",
            "off",
          ].includes(prop.toString())
        ) {
          return (...args: any) => {
            return (this as any)[prop](...args);
          };
        }

        const underlyingSocket = this.underlyingSocket;

        if (!underlyingSocket) {
          console.error("called methods before the underlying was set", prop);
          throw new Error("called methods before the underlying was set");
        }

        // Delegate all other methods to the target object
        if (typeof (underlyingSocket as any)[prop] === "function") {
          return (...args: any) => (underlyingSocket as any)[prop](...args);
        }

        return (underlyingSocket as any)[prop];
      },
    });
  }

  swapSocket(socket: ServerWebSocket<any>) {
    this.underlyingSocket = socket;
  }
}

type SocketWithId = ServerWebSocket<{ requestId: string }>;

export class HonoWithSockets<T extends Env> {
  private server?: Server;
  readonly api;

  private sockets: Record<string, DelegatedWebsocket>;

  static factory = createFactory();

  constructor() {
    this.api = new Hono<T>();
    this.sockets = {};
  }

  /*
   
  Used like:
  server.app.get("/:organizationSlug/debug-chat", async (c) => {
    return server.ws(c, data, (ws) => {
      // do stuff with a websocket
    })
  })
   */
  ws(ctx: Context<T>, data: Record<string, any>, cb: (ws: WebSocket) => void) {
    const requestId = nanoid();

    const socket = new DelegatedWebsocket();
    this.sockets[requestId] = socket;
    cb(socket as unknown as WebSocket);

    const success = (ctx.env?.server as Server).upgrade(ctx.req.raw, {
      data: {
        ...data,
        requestId,
      },
    });

    if (!success) {
      console.error("failed to upgrade");
      delete this.sockets[requestId];
      return new Response("failed to upgrade", { status: 500 });
    }

    return new Response(); // have to return empty response so hono doesn't get mad
  }

  public stop() {
    this.server?.stop();
  }

  public listen(port: number, cb?: () => void) {
    const swapAndEmit = (ws: SocketWithId, event: string, ...args: any[]) => {
      const delegated = this.sockets[ws.data.requestId];
      delegated.swapSocket(ws);
      delegated.emit(event, ...args);
    };

    this.server = Bun.serve({
      port,
      fetch: (request, server) => {
        return this.api.fetch(request, {
          server,
        });
      },
      websocket: {
        message: (ws: SocketWithId, msg) => {
          swapAndEmit(ws, "message", msg);
        },

        open: (ws: SocketWithId) => {
          if (!ws) {
            return;
          }

          swapAndEmit(ws, "open");
        },

        close: (ws: SocketWithId, code: number, reason: string) => {
          if (!ws) {
            return;
          }

          swapAndEmit(ws, "close", code, reason);
          delete this.sockets[ws.data.requestId];
        },

        ping: (ws: SocketWithId, data: Buffer) => {
          swapAndEmit(ws, "ping", data);
        },

        pong: (ws: SocketWithId, data: Buffer) => {
          swapAndEmit(ws, "pong", data);
        },
      },
    });

    console.log(`Running on http://localhost:${port}`);

    cb?.();

    return this.server;
  }
}
