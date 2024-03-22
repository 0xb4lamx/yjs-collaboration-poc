import { create } from "zustand";
import { Canvas } from "fabric";

export const useMainStore = create(() => ({
  canvas: new Canvas() as Canvas,
  zoom: 100,
}));

const { setState } = useMainStore;

export const mainStoreActions = {
  setZoom: (zoom: number) => setState({ zoom }),
};
