import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "../lib/trpc";
import superjson from "superjson";
import { Toaster } from "../components/base/Toaster";
import { useMainStore } from "../lib/mainStore";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_SERVER_URL + "/trpc",
          transformer: superjson,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            }).then((res) => {
              if (res.status === 401) {
                useMainStore.setState({ isLoggedIn: false });
              }

              return res;
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <TanStackRouterDevtools />
        <Toaster richColors />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
