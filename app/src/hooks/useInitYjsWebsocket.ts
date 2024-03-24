/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { generateColor, generateName } from "../lib/utils";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import { User } from "../domain";

export const useInitYjsWebsocket = (boardId: string) => {
  const roomName = boardId;
  const myUserId = useMainStore((s) => s.myUserId);

  useEffect(() => {
    if (!roomName) return;

    // --------------------------------
    // Initialize Yjs
    // --------------------------------
    const yDoc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      import.meta.env.PROD
        ? "wss://" + window.location.host + "/ws"
        : "ws://" + import.meta.env.VITE_SERVER_URL + "/ws",
      roomName,
      yDoc
    );

    wsProvider.on("status", (e: any) => {
      useMainStore.setState({ isConnected: e.status === "connected" });
    });

    // --------------------------------
    // Set awareness
    // --------------------------------

    const awareness = wsProvider.awareness;
    mainStoreActions.setupYjs({
      awareness,
      myUserId,
      yDoc,
    });

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
  }, [roomName, myUserId]);
};
