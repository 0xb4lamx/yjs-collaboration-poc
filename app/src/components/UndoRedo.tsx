import { RedoIcon, UndoIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Row } from "./base/Row";

export const UndoRedo = () => {
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
