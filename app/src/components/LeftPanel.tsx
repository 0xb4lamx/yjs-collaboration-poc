import {
  CircleIcon,
  MousePointer2Icon,
  SquareIcon,
  TriangleIcon,
  TypeIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Col } from "./base/Col";
import { useMainStore } from "../lib/mainStore";
import * as fabric from "fabric";

export const LeftPanel = () => {
  const canvas = useMainStore((state) => state.canvas);

  const handleAddRect = () => {
    const rect = new fabric.Rect({
      fill: "gray",
      width: 100,
      height: 100,
    });
    canvas.add(rect);
    canvas.centerObject(rect);
  };

  const handleAddCircle = () => {
    const circle = new fabric.Circle({
      fill: "gray",
      radius: 50,
    });
    canvas.add(circle);
    canvas.centerObject(circle);
  };

  const handleAddTriangle = () => {
    const triangle = new fabric.Triangle({
      fill: "gray",
      width: 100,
      height: 100,
    });
    canvas.add(triangle);
    canvas.centerObject(triangle);
  };

  const handleAddText = () => {
    const text = new fabric.Textbox("Text", {
      fill: "gray",
      width: 100,
      height: 100,
    });
    canvas.add(text);
    canvas.centerObject(text);
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
