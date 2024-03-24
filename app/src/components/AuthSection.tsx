import { useState } from "react";
import { Col } from "./base/Col";
import { cn } from "../lib/utils";
import { Input } from "./base/Input";
import { Label } from "@radix-ui/react-label";
import { trpc } from "../lib/trpc";
import { useMainStore } from "../lib/mainStore";
import { toast } from "sonner";

const caption = {
  login: "Login",
  signup: "Sign Up",
  alreadyHaveAccount: "Already have an account?",
  dontHaveAccount: "Don't have an account?",
  username: "Username",
  password: "Password",
  enterUsername: "Enter your username",
  enterPassword: "Enter your password",
};

export const AuthSection = () => {
  const [mode, setMode] = useState<"Login" | "Sign Up">("Login");

  const login = trpc.auth.login.useMutation({
    onSuccess(data) {
      toast.success("Logged in");
      useMainStore.setState({ isLoggedIn: true, myUserId: data.userId });
    },
    onError(error) {
      toast.error(error.message);
    },
  });
  const register = trpc.auth.register.useMutation({
    onSuccess(data) {
      toast.success("Registered and logged in");
      useMainStore.setState({ isLoggedIn: true, myUserId: data.userId });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = (e.target as HTMLFormElement).username.value;
    const password = (e.target as HTMLFormElement).password.value;

    if (mode === "Login") {
      login.mutate({ username, password });
    } else {
      register.mutate({ username, password });
    }
  };

  return (
    <Col
      className={cn(
        "p-5 h-full rounded-lg text-sm",
        "bg-gradient-to-r from-slate-900 to-gray-700 border border-slate-200"
      )}
    >
      <p className="text-white font-bold text-xl">{mode}</p>
      <p className="text-white">to save your boards</p>

      <form
        className="flex-1 flex flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <Label htmlFor="username" className="mt-8 text-white">
          Username
        </Label>
        <Input
          id="username"
          placeholder={caption.enterUsername}
          className="mt-1"
          minLength={3}
          maxLength={31}
          required
        />

        <Label htmlFor="password" className="mt-4 text-white">
          {caption.password}
        </Label>
        <Input
          id="password"
          type="password"
          placeholder={caption.enterPassword}
          className="mt-1"
          minLength={6}
          maxLength={255}
          required
        />

        <button
          className={cn(
            "mt-8 w-full h-10 bg-white text-slate-900 rounded-md",
            login.isPending || register.isPending
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-slate-100"
          )}
          type="submit"
          disabled={login.isPending || register.isPending}
        >
          {mode === "Login" ? caption.login : caption.signup}
        </button>
      </form>

      {mode === "Login" ? (
        <>
          <p className="mt-8 text-xs text-slate-400 text-center">
            {caption.dontHaveAccount}
          </p>

          <button
            className="w-full h-10 bg-transparent text-white"
            onClick={() => setMode("Sign Up")}
          >
            {caption.signup}
          </button>
        </>
      ) : (
        <>
          <p className="mt-8 text-xs text-slate-400 text-center">
            {caption.alreadyHaveAccount}
          </p>
          <button
            className="w-full h-10 bg-transparent text-white"
            onClick={() => setMode("Login")}
          >
            {caption.login}
          </button>
        </>
      )}
    </Col>
  );
};
