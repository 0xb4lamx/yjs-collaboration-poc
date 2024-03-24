import { createFileRoute, useRouter } from "@tanstack/react-router";
import { trpc } from "../lib/trpc";
import { Col } from "../components/base/Col";
import { Spinner } from "../components/base/Spinner";
import { useEffect } from "react";
import { useMainStore } from "../lib/mainStore";

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
});

function LogoutPage() {
  const router = useRouter();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      useMainStore.setState({ isLoggedIn: false });
      router.navigate({
        to: "/",
      });
    },
  });

  useEffect(() => {
    logout.mutate();
  }, [logout]);

  return (
    <Col expanded center crossCenter>
      <Spinner />
    </Col>
  );
}
