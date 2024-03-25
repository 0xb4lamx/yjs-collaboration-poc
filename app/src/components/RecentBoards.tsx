import { Row } from "./base/Row";
import { Col } from "./base/Col";
import { ScrollArea } from "./base/ScrollArea";
import { mainStoreActions, useMainStore } from "../lib/mainStore";
import { CirclePowerIcon } from "lucide-react";
import { trpc } from "../lib/trpc";
import { formatDate } from "../lib/utils";
import { useRouter } from "@tanstack/react-router";

export const RecentBoards = () => {
  const myUserId = useMainStore((s) => s.myUserId);
  const router = useRouter();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: mainStoreActions.user.loggedOut,
  });

  const listBoard = trpc.board.listByUser.useQuery({
    limit: 10,
  });

  const renderBoards = () => {
    if (listBoard.isLoading) {
      return (
        <Col expanded center crossCenter className="text-slate-400">
          Loading...
        </Col>
      );
    }

    if (!listBoard.data || listBoard.data.length === 0) {
      return (
        <Col expanded center crossCenter className="text-slate-400">
          No boards created yet
        </Col>
      );
    }

    return (
      <ScrollArea className="flex-1 min-h-0 max-h-80 mt-6">
        {listBoard.data.map((board) => (
          <Col
            key={board.id}
            onClick={() => {
              router.navigate({
                to: "/app/$boardId",
                params: { boardId: board.id },
              });
              useMainStore.setState({ isMenuOpen: false });
            }}
          >
            <Col
              expanded
              className="hover:bg-slate-50 rounded-lg p-3 cursor-pointer"
            >
              <p className="text-lg">{board.name}</p>
              <p className="text-xs text-slate-400">
                Created at {formatDate(board.createdAt)}
              </p>
            </Col>
          </Col>
        ))}
      </ScrollArea>
    );
  };

  return (
    <Col
      expanded
      className="pl-5 rounded-lg text-sm border-l border-l-slate-200"
    >
      <Col className="pl-3">
        <Row>
          <Col expanded>
            <p className="font-bold text-xl">Hi, {myUserId}</p>
            <p className="">Access your recent boards</p>
          </Col>
          <Col
            center
            crossCenter
            className="cursor-pointer"
            onClick={() => logout.mutate()}
          >
            <CirclePowerIcon size={24} className="text-red-500" />
            <p className="text-xs mt-1">logout</p>
          </Col>
        </Row>
      </Col>

      {renderBoards()}
    </Col>
  );
};
