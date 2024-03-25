import { useEffect } from "react";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import { TPointerEventInfo, TPointerEvent } from "fabric";
import { Figure } from "../domain";

export const useCanvasListeners = () => {
  const canvas = useMainStore((state) => state.canvas);
  const awareness = useMainStore((state) => state.awareness);

  // ------------------------------
  // mouse move
  // ------------------------------
  useEffect(() => {
    const mouseMoveHandler = (e: TPointerEventInfo<TPointerEvent>) => {
      if (!awareness) return;

      const { x, y } = e.scenePoint;
      awareness.setLocalStateField("cursor", { x, y });
    };

    canvas.on("mouse:move", mouseMoveHandler);
    return () => {
      canvas.off("mouse:move", mouseMoveHandler);
    };
  }, [awareness, canvas]);

  // ------------------------------
  // short cut
  // ------------------------------
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        const activeObject = canvas.getActiveObject() as unknown as Figure;
        mainStoreActions.figure.remove(activeObject.id);
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [canvas]);
};
