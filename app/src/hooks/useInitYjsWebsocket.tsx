/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { generateColor, generateName } from "../lib/utils";
import { User, useMainStore } from "../lib/mainStore";
import { nanoid } from "nanoid";

export const useInitYjsWebsocket = () => {
  const roomName = "my-roomname";

  useEffect(() => {
    // --------------------------------
    // Initialize Yjs
    // --------------------------------
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      import.meta.env.VITE_WS_URL,
      roomName,
      doc
    );

    wsProvider.on("status", (e: any) => {
      useMainStore.setState({ isConnected: e.status === "connected" });
    });

    // --------------------------------
    // Set awareness
    // --------------------------------

    const awareness = wsProvider.awareness;
    const myUserId = nanoid();
    useMainStore.setState({ awareness, myUserId });

    const metadata: User["metadata"] = {
      id: myUserId,
      name: generateName(),
      color: generateColor(),
    };
    const cursor: User["cursor"] = { x: 0, y: 0 };

    awareness.setLocalStateField("metadata", metadata);
    awareness.setLocalStateField("cursor", cursor);

    const awarenessChangeHandler = () => {
      const users = Array.from(
        wsProvider.awareness.getStates().values()
      ) as User[];
      useMainStore.setState({ users });
    };

    awareness.on("change", awarenessChangeHandler);

    return () => {
      awareness.off("change", awarenessChangeHandler);
      wsProvider.destroy();
    };
  }, []);
};
