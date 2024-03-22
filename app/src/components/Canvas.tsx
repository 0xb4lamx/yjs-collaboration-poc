import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { useMainStore } from "../lib/mainStore";

export const Canvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasEl.current) {
      return;
    }

    // ------------------------------
    // set canvas full screen
    // ------------------------------
    canvasEl.current.width = window.innerWidth;
    canvasEl.current.height = window.innerHeight;
    const resizeCanvas = () => {
      if (!canvasEl.current) {
        return;
      }
      canvasEl.current.width = window.innerWidth;
      canvasEl.current.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    // ------------------------------
    // create a new fabric canvas instance
    // ------------------------------
    const options = {};
    const canvas = new fabric.Canvas(canvasEl.current, options);
    useMainStore.setState({ canvas });

    // ------------------------------
    // add board box to the canvas
    // ------------------------------
    const rect = new fabric.Rect({
      left: 0,
      top: 0,
      fill: "white",
      width: 500,
      height: 500,
    });
    canvas.add(rect);
    canvas.centerObject(rect);
    // disable resize and rotation
    rect.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
      mtr: false,
    });
    // disable board selection
    rect.selectable = false;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasEl} />;
};
