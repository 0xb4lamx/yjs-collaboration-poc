import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./base/Dialog";
import { Row } from "./base/Row";
import { Col } from "./base/Col";
import { ScrollArea } from "./base/ScrollArea";
import { useMainStore } from "../lib/mainStore";
import { Link } from "@tanstack/react-router";
import { nanoid } from "nanoid";
import { AuthSection } from "./AuthSection";
import { trpc } from "../lib/trpc";
import { useEffect } from "react";
import { Spinner } from "./base/Spinner";

export const WelcomeDialog = () => {
  const user = trpc.auth.check.useQuery();
  useEffect(() => {
    if (user.data) {
      useMainStore.setState({
        isLoggedIn: user.data.loggedIn,
        myUserId: user.data.userId,
      });
    }
  }, [user.data]);

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
                  <Link
                    to="/app/$boardId"
                    params={{
                      boardId: nanoid(),
                    }}
                  >
                    <div className="w-56 h-56 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" />
                  </Link>
                </Col>
              </Row>
            </Col>

            <Col className="w-[320px] ml-10">
              {user.isLoading ? (
                <Col expanded center crossCenter>
                  <Spinner />
                </Col>
              ) : user.data?.loggedIn ? (
                <RecentBoards />
              ) : (
                <AuthSection />
              )}
            </Col>
          </Row>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const dummyRecentBoards = [
  {
    id: "1",
    name: "My first board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "My second board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "My third board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "My fourth board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "My fifth board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "My sixth board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "My seventh board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "My eighth board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "My ninth board",
    createdAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "My tenth board",
    createdAt: new Date().toISOString(),
  },
];

const RecentBoards = () => {
  return (
    <Col
      expanded
      className="pl-5 rounded-lg text-sm border-l border-l-slate-200"
    >
      <Col className="pl-3">
        <p className="font-bold text-xl">Recent Boards</p>
        <p className="">Access your recent boards</p>
      </Col>
      <ScrollArea className="flex-1 min-h-0 max-h-80 mt-6">
        {dummyRecentBoards.map((board) => (
          <Row
            key={board.id}
            className="hover:bg-slate-50 rounded-lg p-3 cursor-pointer"
          >
            <Col expanded>
              <p className="text-lg">{board.name}</p>
              <p className="text-xs text-slate-400">
                Created at {new Date(board.createdAt).toLocaleString()}
              </p>
            </Col>
          </Row>
        ))}
      </ScrollArea>
    </Col>
  );
};
