import { authRouter } from "./router/authRouter";
import { userRouter } from "./router/userRouter";
import { router } from "./trpcServer";

export const trpcRouter = router({
  user: userRouter,
  auth: authRouter,
});

export type TrpcRouter = typeof trpcRouter;
