import { cn } from "../lib/utils";

export const Logo = () => {
  return (
    <div
      className={cn(
        "pl-2 pr-4 rounded-br-2xl select-none shadow-md",
        "flex items-center gap-2 h-10",
        "bg-teal-500 hover:bg-teal-600 transition-colors duration-200 ease-in-out"
      )}
    >
      <div className="font-bold text-white">Design-Collab</div>
    </div>
  );
};
