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

  const handleAddRect = () => {
    const center = canvas.getCenterPoint();
    const rect = new fabric.Rect({
      fill: "gray",
      width: 100,
      height: 100,
      top: center.y,
      left: center.x,
    }).toObject();

    mainStoreActions.addFigure({
      type: "Rect",
      ...rect,
    });
  };

  const handleAddCircle = () => {
    const center = canvas.getCenterPoint();
    const circle = new fabric.Circle({
      fill: "gray",
      radius: 50,
      top: center.y,
      left: center.x,
    }).toObject();

    mainStoreActions.addFigure({
      type: "Circle",
      ...circle,
    });
  };

  const handleAddTriangle = () => {
    const center = canvas.getCenterPoint();
    const triangle = new fabric.Triangle({
      fill: "gray",
      width: 100,
      height: 100,
      top: center.y,
      left: center.x,
    }).toObject();

    mainStoreActions.addFigure({
      id: nanoid(),
      type: "Triangle",
      ...triangle,
    });
  };

  const handleAddText = () => {
    const center = canvas.getCenterPoint();
    const text = new fabric.Textbox("Text", {
      fill: "gray",
      width: 100,
      height: 100,
      top: center.y,
      left: center.x,
    }).toObject();

    mainStoreActions.addFigure({
      type: "Textbox",
      ...text,
    });
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
