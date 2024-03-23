import { create } from "zustand";
import { Canvas } from "fabric";
import { Awareness } from "y-protocols/awareness";
import { Figure, User } from "../domain";
import { FabricObject } from "fabric";
import { nanoid } from "nanoid";
import * as Y from "yjs";

export const useMainStore = create(() => ({
  isConnected: false,
  myUserId: "",
  canvas: new Canvas() as Canvas,
  users: [] as User[],
  zoom: 100,
  figures: [] as Figure[],
  renderedFigureMap: new Map<string, FabricObject>(),

  // yjs
  awareness: undefined as Awareness | undefined,
  yDoc: new Y.Doc(),
  figureIds: new Y.Array<string>(),
  // figureConfigMap: new Y.Map<Y.Map<any>>(),
}));

const { setState } = useMainStore;

export const mainStoreActions = {
  setZoom: (zoom: number) => setState({ zoom }),

  // figures
  addFigure: (figure: Omit<Figure, "id">) =>
    setState((state) => ({
      figures: [
        ...state.figures,
        {
          id: nanoid(),
          ...figure,
        },
      ],
    })),
  removeFigure: (id: string) =>
    setState((state) => ({
      figures: state.figures.filter((f) => f.id !== id),
    })),
  updateFigure: (id: string, figure: Figure) =>
    setState((state) => ({
      figures: state.figures.map((f) => (f.id === id ? figure : f)),
    })),

  // renderedFigureMap
  setRenderedFigure: (id: string, figure: FabricObject) =>
    setState((state) => ({
      renderedFigureMap: new Map(state.renderedFigureMap.set(id, figure)),
    })),
};
