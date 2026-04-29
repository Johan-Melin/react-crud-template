import { Link } from "@tanstack/react-router";
import { useSessionRedirect } from "../features/auth/use-session-redirect.ts";
import { authClient } from "../lib/auth-client.ts";
import { ThemeToggle } from "../theme/theme-toggle.tsx";
import { useTheme } from "../theme/use-theme.ts";

export function AppHomePage() {
  const { mode, resolvedTheme } = useTheme();
  const sessionQuery = useSessionRedirect({ whenUnauthenticated: "/sign-in" });

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  if (sessionQuery.isPending) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="panel w-full max-w-xl p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
            Checking session
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-[-0.05em]">
            Loading your authenticated app shell.
          </h1>
        </div>
      </main>
    );
  }

  const session = sessionQuery.data?.session;
  const user = sessionQuery.data?.user;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="panel mb-6 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Authenticated Area</p>
            <h1 className="text-2xl font-bold tracking-[-0.04em] sm:text-3xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              type="button"
              className="button-secondary"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className="grid flex-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="panel p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
            Route protection
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.06em]">
            The app route is now guarded by session state.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-app-muted sm:text-lg">
            This placeholder authenticated route is the handoff point for the
            notes CRUD slice. Anonymous users are redirected to sign in before
            they can reach it.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="button-secondary">
              Back to landing page
            </Link>
          </div>
        </div>

        <aside className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
            Current session
          </p>
          <div className="mt-5 rounded-[1.5rem] border border-app-border bg-app-bg-strong p-4">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-app-muted">User</dt>
                <dd className="font-medium">{user?.email ?? "Unknown"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-app-muted">Session id</dt>
                <dd className="font-medium">{session?.id ?? "Unavailable"}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-app-muted">Theme</dt>
                <dd className="font-medium">
                  {resolvedTheme} / {mode}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </main>
  );
}
