import {
  CircleIcon,
  MinusIcon,
  PlusIcon,
  RedoIcon,
  SquareIcon,
  TriangleIcon,
  TypeIcon,
  UndoIcon,
} from "lucide-react";
import { cn } from "./lib/utils";
import { Col } from "./components/Col";
import { Row } from "./components/Row";
import { useState } from "react";

const App = () => {
  return (
    <Col className="bg-gray-100 h-screen relative">
      <LeftPanel />
      <Row className="gap-3 absolute bottom-5 left-[50%] transform -translate-x-1/2">
        <UndoRedo />
        <ZoomControls />
      </Row>
    </Col>
  );
};

const LeftPanel = () => {
  return (
    <Col
      center
      className={cn(
        "absolute left-0 top-[50%] transform -translate-y-1/2",
        "bg-background pl-3 pr-4 py-6 rounded-tr-xl rounded-br-xl shadow-xl gap-5"
      )}
    >
      <SquareIcon size="20" className="cursor-pointer hover:text-primary" />
      <CircleIcon size="20" className="cursor-pointer hover:text-primary" />
      <TriangleIcon size="20" className="cursor-pointer hover:text-primary" />
      <TypeIcon size="20" className="cursor-pointer hover:text-primary" />
    </Col>
  );
};

const ZoomControls = () => {
  const [zoom, setZoom] = useState(100);

  return (
    <Row
      center
      className={cn("bg-background pl-3 pr-4 py-1 rounded-lg shadow-lg gap-2")}
    >
      <MinusIcon
        size="14"
        className="cursor-pointer hover:text-primary"
        onClick={() => setZoom(zoom - 10)}
      />
      <div className="text-xs py-1 px-3 text-gray-500 bg-gray-100 rounded-md select-none">
        {zoom}%
      </div>
      <PlusIcon
        size="14"
        className="cursor-pointer hover:text-primary"
        onClick={() => setZoom(zoom + 10)}
      />
    </Row>
  );
};

const UndoRedo = () => {
  return (
    <Row
      center
      className={cn("bg-background pl-3 pr-4 py-1 rounded-lg shadow-lg gap-3")}
    >
      <UndoIcon size="14" className="cursor-pointer hover:text-primary" />
      <RedoIcon size="14" className="cursor-pointer hover:text-primary" />
    </Row>
  );
};

export default App;
