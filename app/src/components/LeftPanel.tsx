import {
  CircleIcon,
  MousePointer2Icon,
  SquareIcon,
  TriangleIcon,
  TypeIcon,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Col } from "./base/Col";

export const LeftPanel = () => {
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

      <SquareIcon size="20" className="cursor-pointer hover:text-primary" />
      <CircleIcon size="20" className="cursor-pointer hover:text-primary" />
      <TriangleIcon size="20" className="cursor-pointer hover:text-primary" />
      <TypeIcon size="20" className="cursor-pointer hover:text-primary" />
    </Col>
  );
};
