import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
  center?: boolean;
  crossCenter?: boolean;
};

export const Col = forwardRef<HTMLDivElement, Props>(
  ({ expanded, center, crossCenter, className, ...rest }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col",
          expanded && "flex-1",
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
