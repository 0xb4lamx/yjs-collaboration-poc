import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Row } from "./base/Row";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import { useEffect } from "react";
import { Point, TPointerEventInfo } from "fabric";

export const ZoomControls = () => {
  const increment = 25;

  const zoom = useMainStore((state) => state.zoom);
  const canvas = useMainStore((state) => state.canvas);

  // zoom in/out with ctrl + mouse wheel
  useEffect(() => {
    const handleWheel = (opt: TPointerEventInfo<WheelEvent>) => {
      if (!opt.e.ctrlKey) {
        return;
      }

      const { x, y } = canvas.getViewportPoint(opt.e);
      const point = new Point(x, y);
      const newZoom = zoom - opt.e.deltaY / 10;

      // prevent zooming out too much
      if (newZoom < 10) {
        return;
      }

      canvas.zoomToPoint(point, newZoom / 100);
      mainStoreActions.setZoom(newZoom);
    };

    canvas.on("mouse:wheel", handleWheel);

    return () => {
      canvas.off("mouse:wheel", handleWheel);
    };
  }, [zoom, canvas]);

  const zoomToCenter = (newZoom: number) => {
    const { width, height } = canvas;
    const point = new Point(width / 2, height / 2);
    canvas.zoomToPoint(point, newZoom / 100);
  };

  const handleZoomIn = () => {
    zoomToCenter(zoom + increment);
    mainStoreActions.setZoom(zoom + increment);
  };

  const handleZoomOut = () => {
    zoomToCenter(zoom - increment);
    mainStoreActions.setZoom(zoom - increment);
  };

  return (
    <Row
      center
      className={cn("bg-background pl-3 pr-4 py-1 rounded-lg shadow-lg gap-2")}
    >
      <MinusIcon
        size="14"
        className="cursor-pointer hover:text-primary"
        onClick={handleZoomOut}
      />
      <div className="text-xs py-1 px-3 text-gray-500 bg-gray-100 rounded-md select-none">
        {zoom.toFixed(0)}%
      </div>
      <PlusIcon
        size="14"
        className="cursor-pointer hover:text-primary"
        onClick={handleZoomIn}
      />
    </Row>
  );
};
