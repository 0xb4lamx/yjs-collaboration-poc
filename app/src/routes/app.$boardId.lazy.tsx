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
import { ViewOnGithub } from "../components/ViewOnGithub";
import { Header } from "../components/Header";
import { useMainStore } from "../lib/mainStore";
import { WelcomeDialog } from "../components/WelcomeDialog";
import { FigureSetting } from "../components/FigureSetting";

export const Route = createLazyFileRoute("/app/$boardId")({
  component: BoardApp,
});

function BoardApp() {
  const { boardId } = Route.useParams();

  const isMenuOpen = useMainStore((state) => state.isMenuOpen);

  useInitYjsWebsocket(boardId);
  useCanvasListeners();
  useFigureRenderer();

  return (
    <Col className="bg-gray-100 h-screen relative">
      <Canvas />
      <Header />
      <ViewOnGithub />
      <LeftPanel />
      <FigureSetting />
      <UsersPointer />
      <Row className="gap-3 absolute bottom-5 left-[50%] transform -translate-x-1/2">
        <UndoRedo />
        <ZoomControls />
      </Row>

      <WelcomeDialog
        isOpen={isMenuOpen}
        onOpenChange={(isMenuOpen) => useMainStore.setState({ isMenuOpen })}
      />
    </Col>
  );
}
