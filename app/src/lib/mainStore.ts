import { create } from "zustand";
import { Canvas } from "fabric";
import { Awareness } from "y-protocols/awareness";
import { Figure, User } from "../domain";
import { FabricObject } from "fabric";
import * as Y from "yjs";

export const useMainStore = create(() => ({
  canvas: new Canvas() as Canvas,
  zoom: 100,
  renderedFigureMap: new Map<string, FabricObject>(),
  isLoggedIn: false,
  isMenuOpen: false,
  isFigureSettingsOpen: false,
  selectedFigure: null as {
    type: string;
    id: string;
  } | null,

  // yjs
  isConnected: false,
  myUserId: "",
  users: [] as User[],
  awareness: undefined as Awareness | undefined,
  yDoc: new Y.Doc(),
  yFigureIds: new Y.Array<string>(),
  yFigureConfigMap: new Y.Map<Y.Map<unknown>>(),
}));

const { setState, getState } = useMainStore;

export const mainStoreActions = {
  canvas: {
    setZoom: (zoom: number) => setState({ zoom }),
    selectFigure: (params: { type: string; id: string }) =>
      setState({ selectedFigure: params }),
    deselectFigure: () => setState({ selectedFigure: null }),
  },

  figure: {
    add: (figure: Figure) => {
      const state = getState();

      const yConfig = new Y.Map();
      Object.entries(figure).forEach(([key, value]) => {
        yConfig.set(key, value);
      });

      state.yDoc.transact(() => {
        state.yFigureIds.push([figure.id]);
        state.yFigureConfigMap.set(figure.id, yConfig);
      });
    },
    update: (id: string, figure: Figure) => {
      const state = getState();
      const yConfig = state.yFigureConfigMap.get(id);

      if (yConfig) {
        state.yDoc.transact(() => {
          Object.entries(figure).forEach(([key, value]) => {
            yConfig.set(key, value);
          });
        });
      }
    },
    remove: (id: string) => {
      const state = getState();
      state.yDoc.transact(() => {
        state.yFigureIds.delete(state.yFigureIds.toArray().indexOf(id));
        state.yFigureConfigMap.delete(id);
      });
    },
  },

  renderedFigure: {
    set: (id: string, figure: FabricObject) =>
      setState((state) => ({
        renderedFigureMap: new Map(state.renderedFigureMap.set(id, figure)),
      })),
    remove: (id: string) =>
      setState((state) => {
        const newMap = new Map(state.renderedFigureMap);
        newMap.delete(id);
        return { renderedFigureMap: newMap };
      }),
  },

  yjs: {
    setup: (params: { awareness: Awareness; myUserId: string; yDoc: Y.Doc }) =>
      setState(() => ({
        awareness: params.awareness,
        myUserId: params.myUserId,
        yDoc: params.yDoc,
        yFigureIds: params.yDoc.getArray("figureIds"),
        yFigureConfigMap: params.yDoc.getMap("figureConfigMap"),
      })),
  },

  user: {
    loggedOut: () => setState({ isLoggedIn: false }),
    loggedIn: (userId: string) =>
      setState({ isLoggedIn: true, myUserId: userId }),
  },
};
