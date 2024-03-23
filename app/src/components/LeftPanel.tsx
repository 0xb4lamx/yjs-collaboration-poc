import {
  CircleIcon,
  MousePointer2Icon,
  SquareIcon,
  TriangleIcon,
  TypeIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Col } from "./base/Col";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import * as fabric from "fabric";
import { nanoid } from "nanoid";

export const LeftPanel = () => {
  const canvas = useMainStore((s) => s.canvas);

  const createBaseFigureConfig = () => {
    const center = canvas.getCenterPoint();
    return {
      id: nanoid(),
      top: center.y,
      left: center.x,
      fill: "gray",
    };
  };

  const handleAddRect = () => {
    const rect = new fabric.Rect({
      ...createBaseFigureConfig(),
      width: 100,
      height: 100,
    }).toObject(["id", "type"]);

    mainStoreActions.addFigure(rect);
  };

  const handleAddCircle = () => {
    const circle = new fabric.Circle({
      ...createBaseFigureConfig(),
      radius: 50,
    }).toObject(["id", "type"]);

    mainStoreActions.addFigure(circle);
  };

  const handleAddTriangle = () => {
    const triangle = new fabric.Triangle({
      ...createBaseFigureConfig(),
      width: 100,
      height: 100,
    }).toObject(["id", "type"]);

    mainStoreActions.addFigure(triangle);
  };

  const handleAddText = () => {
    const text = new fabric.Textbox("Text", {
      ...createBaseFigureConfig(),
      width: 100,
      height: 100,
    }).toObject(["id", "type"]);

    mainStoreActions.addFigure(text);
  };

  return (
    <Col
      center
      className={cn(
        "absolute left-0 top-[50%] transform -translate-y-1/2",
        "bg-background pl-3 pr-4 py-6 rounded-tr-xl rounded-br-xl shadow-xl gap-5"
      )}
    >
      <MousePointer2Icon
        size="20"
        className="cursor-pointer hover:text-primary"
      />
      {/* divier */}
      <div className="w-8 h-0.5 bg-gray-200" />

      <SquareIcon
        size="20"
        className="cursor-pointer hover:text-primary"
        onClick={handleAddRect}
      />
      <CircleIcon
        size="20"
        className="cursor-pointer hover:text-primary"
        onClick={handleAddCircle}
      />
      <TriangleIcon
        size="20"
        className="cursor-pointer hover:text-primary"
        onClick={handleAddTriangle}
      />
      <TypeIcon
        size="20"
        className="cursor-pointer hover:text-primary"
        onClick={handleAddText}
      />
    </Col>
  );
};
