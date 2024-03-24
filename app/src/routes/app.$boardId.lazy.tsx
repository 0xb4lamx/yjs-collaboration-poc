import { createLazyFileRoute } from "@tanstack/react-router";

import { Canvas } from "../components/Canvas";
import { LeftPanel } from "../components/LeftPanel";
import { UndoRedo } from "../components/UndoRedo";
import { UsersPointer } from "../components/UsersPointer";
import { ZoomControls } from "../components/ZoomControls";
import { Col } from "../components/base/Col";
import { Row } from "../components/base/Row";

import { useCanvasListeners } from "../hooks/useCanvasListeners";
import { useFigureRenderer } from "../hooks/useFigureRenderer";
import { useInitYjsWebsocket } from "../hooks/useInitYjsWebsocket";

export const Route = createLazyFileRoute("/app/$boardId")({
  component: BoardApp,
});

function BoardApp() {
  const { boardId } = Route.useParams();

  useInitYjsWebsocket(boardId);
  useCanvasListeners();
  useFigureRenderer();

  return (
    <Col className="bg-gray-100 h-screen relative">
      <Canvas />
      <LeftPanel />
      <UsersPointer />
      <Row className="gap-3 absolute bottom-5 left-[50%] transform -translate-x-1/2">
        <UndoRedo />
        <ZoomControls />
      </Row>
    </Col>
  );
}
