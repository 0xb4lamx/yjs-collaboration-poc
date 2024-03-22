import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
  center?: boolean;
  crossCenter?: boolean;
};

export const Row = forwardRef<HTMLDivElement, Props>(
  ({ expanded, center, crossCenter, className, ...rest }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-row",
          expanded && "flex-grow",
          center && "items-center",
          crossCenter && "justify-center",
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);
