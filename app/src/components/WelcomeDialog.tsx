import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./base/Dialog";
import { Row } from "./base/Row";
import { Col } from "./base/Col";
import { useMainStore } from "../lib/mainStore";
import { useRouter } from "@tanstack/react-router";
import { AuthSection } from "./AuthSection";
import { RecentBoards } from "./RecentBoards";
import { trpc } from "../lib/trpc";
import { toast } from "sonner";

export const WelcomeDialog = () => {
  const isLoggedIn = useMainStore((s) => s.isLoggedIn);
  const router = useRouter();

  const initBoard = trpc.board.init.useMutation({
    onSuccess: (data) => {
      router.navigate({
        to: `/app/$boardId`,
        params: { boardId: data.id },
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreateBoard = () => {
    if (!isLoggedIn) {
      toast.warning("Please login to create a board");
      return;
    }

    initBoard.mutate();
  };

  return (
    <Dialog open={true}>
      <DialogContent
        hideCloseButton
        className="max-w-screen-lg px-8 min-h-[500px]"
      >
        <DialogHeader>
          <DialogTitle>Welcome and Enjoy!</DialogTitle>

          <Row className="h-full">
            <Col expanded>
              <p>
                Start creating your board by drawing shapes, adding text, and
                collaborating with others.
              </p>

              {/* choose board size */}
              <p className="mt-8 text-sm text-slate-400">
                Choose the size of the board
              </p>
              <Row
                expanded
                center
                crossCenter
                className="mt-2 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <Col expanded center crossCenter>
                  <Row onClick={handleCreateBoard}>
                    <div className="w-56 h-56 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" />
                  </Row>
                </Col>
              </Row>
            </Col>

            <Col className="w-[320px] ml-10">
              {isLoggedIn ? <RecentBoards /> : <AuthSection />}
            </Col>
          </Row>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
