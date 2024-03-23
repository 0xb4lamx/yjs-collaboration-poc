import { create } from "zustand";
import { Canvas } from "fabric";
import { Awareness } from "y-protocols/awareness";
import { Figure, User } from "../domain";
import { FabricObject } from "fabric";
import { nanoid } from "nanoid";
import * as Y from "yjs";

export const useMainStore = create(() => ({
  canvas: new Canvas() as Canvas,
  zoom: 100,
  renderedFigureMap: new Map<string, FabricObject>(),

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
  setZoom: (zoom: number) => setState({ zoom }),

  // figures
  addFigure: (figure: Omit<Figure, "id">) => {
    const state = getState();

    const id = nanoid();

    const yConfig = new Y.Map();
    Object.entries(figure).forEach(([key, value]) => {
      yConfig.set(key, value);
    });

    state.yDoc.transact(() => {
      state.yFigureIds.push([id]);
      state.yFigureConfigMap.set(id, yConfig);
    });
  },
  updateFigure: (id: string, figure: Figure) => {
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

  // renderedFigureMap
  setRenderedFigure: (id: string, figure: FabricObject) =>
    setState((state) => ({
      renderedFigureMap: new Map(state.renderedFigureMap.set(id, figure)),
    })),

  setupYjs: (params: { awareness: Awareness; myUserId: string; yDoc: Y.Doc }) =>
    setState(() => ({
      awareness: params.awareness,
      myUserId: params.myUserId,
      yDoc: params.yDoc,
      yFigureIds: params.yDoc.getArray("figureIds"),
      yFigureConfigMap: params.yDoc.getMap("figureConfigMap"),
    })),
};
