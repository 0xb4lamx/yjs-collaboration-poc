import { createTRPCReact } from "@trpc/react-query";
import type { TrpcRouter } from "../../../server/src/trpcRouter";

export const trpc = createTRPCReact<TrpcRouter>();
