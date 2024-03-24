import { authRouter } from "./router/authRouter";
import { boardRouter } from "./router/boardRouter";
import { router } from "./trpcServer";

export const trpcRouter = router({
  auth: authRouter,
  board: boardRouter,
});

export type TrpcRouter = typeof trpcRouter;
