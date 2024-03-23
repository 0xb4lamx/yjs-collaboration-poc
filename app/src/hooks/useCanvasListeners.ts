import { useEffect } from "react";
import { useMainStore } from "../lib/mainStore";
import { TPointerEventInfo, TPointerEvent } from "fabric";

export const useCanvasListeners = () => {
  const canvas = useMainStore((state) => state.canvas);
  const awareness = useMainStore((state) => state.awareness);

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
};
