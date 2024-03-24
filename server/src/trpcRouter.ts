import { authRouter } from "./trpcRouters/authRouter";
import { userRouter } from "./trpcRouters/userRouter";
import { router } from "./trpcServer";

export const trpcRouter = router({
  user: userRouter,
  auth: authRouter,
});

export type TrpcRouter = typeof trpcRouter;
