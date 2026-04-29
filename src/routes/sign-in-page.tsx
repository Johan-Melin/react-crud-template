import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthCard } from "../features/auth/auth-card.tsx";
import { getProviderConfig } from "../features/auth/get-provider-config.ts";
import { ProviderButtons } from "../features/auth/provider-buttons.tsx";
import { useSessionRedirect } from "../features/auth/use-session-redirect.ts";
import { authClient } from "../lib/auth-client.ts";

export function SignInPage() {
  const navigate = useNavigate();
  const sessionQuery = useSessionRedirect({ whenAuthenticated: "/app" });
  const providersQuery = useQuery({
    queryKey: ["auth", "providers"],
    queryFn: getProviderConfig,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (sessionQuery.isPending) {
    return null;
  }

  async function handleEmailSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/app",
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to sign in right now.");
      return;
    }

    void navigate({ to: "/app" });
  }

  async function handleSocialSignIn(provider: "github" | "discord") {
    setIsSubmitting(true);
    setError(null);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: "/app",
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Unable to start social sign-in.");
    }
  }

  return (
    <AuthCard
      eyebrow="Sign In"
      title="Return to your starter with one path for email and social login."
      description="This page proves the auth client, the server handler, and provider gating without committing to a product-specific dashboard yet."
      footer={
        <p>
          New here?{" "}
          <Link to="/sign-up" className="font-semibold text-app-accent">
            Create an account
          </Link>
          .
        </p>
      }
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
          Email and password
        </p>
        <form className="mt-4 space-y-4" onSubmit={handleEmailSignIn}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-app-text">Email</span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-app-border bg-white/70 px-4 py-3 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent dark:bg-white/5"
              placeholder="name@example.com"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-app-text">Password</span>
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-app-border bg-white/70 px-4 py-3 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent dark:bg-white/5"
              placeholder="Your password"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="button-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-app-border" />
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-app-muted">
          or
        </span>
        <div className="h-px flex-1 bg-app-border" />
      </div>

      {providersQuery.data ? (
        <ProviderButtons
          config={providersQuery.data}
          isBusy={isSubmitting}
          onSignIn={handleSocialSignIn}
        />
      ) : null}

      {providersQuery.isError ? (
        <p className="mt-3 text-sm text-app-muted">
          Social provider availability could not be loaded right now.
        </p>
      ) : null}
    </AuthCard>
  );
}
