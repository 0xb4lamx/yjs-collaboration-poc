import { Col } from "./components/base/Col";
import { Row } from "./components/base/Row";
import { Canvas } from "./components/Canvas";
import { ZoomControls } from "./components/ZoomControls";
import { UndoRedo } from "./components/UndoRedo";
import { LeftPanel } from "./components/LeftPanel";
import { useInitYjsWebsocket } from "./hooks/useInitYjsWebsocket";
import { useCanvasListeners } from "./hooks/useCanvasListeners";
import { UsersPointer } from "./components/UsersPointer";
import { useFigureRenderer } from "./hooks/useFigureRenderer";

const App = () => {
  useInitYjsWebsocket();
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
};

export default App;
