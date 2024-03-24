import { forwardRef } from "react";
import { cn } from "../../lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  expanded?: boolean;
  center?: boolean;
  crossCenter?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Col = forwardRef<HTMLDivElement, Props>(
  ({ expanded, center, crossCenter, className, ...rest }, ref) => {
    return (
      <div
        className={cn(
          "flex flex-col",
          expanded && "flex-1",
          center && "justify-center",
          crossCenter && "items-center",
          className
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);
