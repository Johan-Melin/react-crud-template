import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client.ts";
import { getHealth } from "../features/system/get-health.ts";
import { publicEnv } from "../lib/public-env.ts";
import { ThemeToggle } from "../theme/theme-toggle.tsx";
import { useTheme } from "../theme/use-theme.ts";

const plannedSlices = [
  "TanStack Router and Query foundation",
  "Better Auth and Drizzle on Vercel Functions",
  "Protected notes CRUD with mobile-first UI",
];

export function HomePage() {
  const { mode, resolvedTheme } = useTheme();
  const sessionQuery = authClient.useSession();
  const healthQuery = useQuery({
    queryKey: ["system", "health"],
    queryFn: getHealth,
  });

  const appName = publicEnv.VITE_APP_NAME ?? "React CRUD Template";
  const isSignedIn = Boolean(sessionQuery.data?.session);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="panel mb-6 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Foundation Slice</p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
                {appName}
              </h1>
              <span className="rounded-full border border-app-border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-app-muted">
                Vite SPA + Vercel API
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <section className="grid flex-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-app-accent to-transparent opacity-80" />
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-app-muted">
              Secure by boundary, minimal by design
            </p>
            <h2 className="max-w-2xl text-4xl font-bold tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              Fork a CRUD starter that keeps secrets off the client.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-app-muted sm:text-lg">
              This foundation slice wires the app for responsive routing, query
              state, serverless API development, and theme control before the
              auth and database layers arrive.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
                Server-only
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text">
                `/api` and `/server` own runtime logic. `/src` only speaks HTTP
                and can use non-sensitive `VITE_*` values.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
                Router-ready
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text">
                TanStack Router now owns app navigation, so protected routes can
                slot in without rewiring the shell later.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
                Query-backed
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text">
                TanStack Query is live now and already verifying the API runtime
                through the health endpoint.
              </p>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {isSignedIn ? (
              <Link to="/app" className="button-primary">
                Open app
              </Link>
            ) : (
              <Link to="/sign-up" className="button-primary">
                Create account
              </Link>
            )}
            {isSignedIn ? (
              <button
                type="button"
                className="button-secondary"
                onClick={() => {
                  void authClient.signOut();
                  window.location.reload();
                }}
              >
                Sign out
              </button>
            ) : (
              <Link to="/sign-in" className="button-secondary">
                Sign in
              </Link>
            )}
            <a href="#status" className="button-secondary">
              Check runtime status
            </a>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
              Auth route status
            </p>
            <p className="mt-3 text-sm leading-6 text-app-text">
              Email/password auth is wired server-side now, and the auth pages
              use a safe provider endpoint to decide whether GitHub or Discord
              should appear.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/sign-up" className="button-secondary">
                Open sign-up
              </Link>
              <Link to="/sign-in" className="button-secondary">
                Open sign-in
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <section id="status" className="panel p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
                  Local Runtime
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-[-0.04em]">
                  API healthcheck
                </h3>
              </div>
              <div className="rounded-full border border-app-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-app-muted">
                {resolvedTheme} / {mode}
              </div>
            </div>

            <div className="mt-5 rounded-[1.5rem] border border-app-border bg-app-bg-strong p-4">
              {healthQuery.isPending ? (
                <p className="text-sm text-app-muted">
                  Contacting `/api/health`...
                </p>
              ) : null}

              {healthQuery.isError ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-300">
                    API runtime unavailable
                  </p>
                  <p className="text-sm leading-6 text-app-muted">
                    Start the combined dev command to bring up Vite and the
                    Vercel function runtime together.
                  </p>
                </div>
              ) : null}

              {healthQuery.data ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-app-muted">Status</dt>
                    <dd className="rounded-full bg-app-accent-soft px-3 py-1 font-semibold text-app-accent">
                      {healthQuery.data.status}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-app-muted">Runtime</dt>
                    <dd className="font-medium">{healthQuery.data.runtime}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-app-muted">Environment</dt>
                    <dd className="font-medium">
                      {healthQuery.data.environment}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-app-muted">Timestamp</dt>
                    <dd className="font-medium">
                      {new Date(
                        healthQuery.data.timestamp,
                      ).toLocaleTimeString()}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </section>

          <section className="panel p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
              Planned Next
            </p>
            <ul className="mt-4 space-y-3">
              {plannedSlices.map((item) => (
                <li
                  key={item}
                  className="rounded-[1.25rem] border border-app-border bg-white/50 px-4 py-3 text-sm leading-6 dark:bg-white/5"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
