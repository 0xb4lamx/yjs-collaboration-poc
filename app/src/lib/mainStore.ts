import { create } from "zustand";
import { Canvas } from "fabric";
import { Awareness } from "y-protocols/awareness";

export type User = {
  metadata: { id: string; name: string; color: string };
  cursor: {
    x: number;
    y: number;
  };
};

export const useMainStore = create(() => ({
  isConnected: false,
  myUserId: "",
  canvas: new Canvas() as Canvas,
  awareness: undefined as Awareness | undefined,
  users: [] as User[],
  zoom: 100,
}));

const { setState } = useMainStore;

export const mainStoreActions = {
  setZoom: (zoom: number) => setState({ zoom }),
};
