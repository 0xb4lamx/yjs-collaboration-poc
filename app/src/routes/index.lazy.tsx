import { createLazyFileRoute } from "@tanstack/react-router";

import { LeftPanel } from "../components/LeftPanel";
import { UsersPointer } from "../components/UsersPointer";
import { WelcomeDialog } from "../components/WelcomeDialog";
import { Col } from "../components/base/Col";
import { Header } from "../components/Header";
import { ViewOnGithub } from "../components/ViewOnGithub";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Col className="bg-gray-100 h-screen relative">
      <Header />
      <ViewOnGithub />
      <LeftPanel />
      <UsersPointer />
      <WelcomeDialog isOpen={true} />
    </Col>
  );
}
