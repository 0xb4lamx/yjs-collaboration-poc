import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./base/Dialog";
import { Row } from "./base/Row";
import { Col } from "./base/Col";
import { cn } from "../lib/utils";
import { Input } from "./base/Input";
import { Label } from "@radix-ui/react-label";
import { ScrollArea } from "./base/ScrollArea";
import { useMainStore } from "../lib/mainStore";

export const WelcomeDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
  const isLoggedIn = useMainStore((state) => state.isLoggedIn);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-screen-lg px-8 min-h-[500px]">
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
                  <div className="w-56 h-56 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer" />
                </Col>
              </Row>
            </Col>

            <Col className="w-[320px] ml-10">
              {isLoggedIn ? <RecentBoards /> : <LoginSection />}
            </Col>
          </Row>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const LoginSection = () => {
  const [mode, setMode] = useState<"Login" | "Sign Up">("Login");

  return (
    <Col
      className={cn(
        "p-5 h-full rounded-lg text-white text-sm",
        "bg-gradient-to-r from-slate-900 to-gray-700 border border-slate-200"
      )}
    >
      <p className="font-bold text-xl">{mode}</p>
      <p className="">to access your saved boards</p>

      <Col expanded center>
        <Label htmlFor="username" className="mt-8">
          Username
        </Label>
        <Input
          id="username"
          placeholder="Enter your username"
          className="mt-1"
        />

        <Label htmlFor="password" className="mt-4">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mt-1"
        />

        <button className="mt-8 w-full h-10 bg-white text-slate-900 rounded-md">
          {mode}
        </button>
      </Col>

      {mode === "Login" ? (
        <>
          <p className="mt-8 text-xs text-slate-400 text-center">
            Don't have an account?{" "}
          </p>

          <button
            className="w-full h-10 bg-transparent text-white"
            onClick={() => setMode("Sign Up")}
          >
            Sign up
          </button>
        </>
      ) : (
        <>
          <p className="mt-8 text-xs text-slate-400 text-center">
            Already have an account?{" "}
          </p>
          <button
            className="w-full h-10 bg-transparent text-white"
            onClick={() => setMode("Login")}
          >
            Login
          </button>
        </>
      )}
    </Col>
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
