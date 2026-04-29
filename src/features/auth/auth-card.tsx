import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export function AuthCard({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthCardProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-app-accent to-transparent opacity-80" />
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="max-w-xl text-4xl font-bold tracking-[-0.06em] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-app-muted sm:text-lg">
            {description}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <article className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
                Cookie sessions
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text">
                Better Auth owns the session lifecycle on the server while the
                client interacts through the same `/api/auth/*` routes the
                template ships with.
              </p>
            </article>
            <article className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-app-muted">
                Provider-safe UI
              </p>
              <p className="mt-3 text-sm leading-6 text-app-text">
                Social buttons only render from safe server config, never from
                exposed secrets or `VITE_*` flags.
              </p>
            </article>
          </div>

          <div className="mt-8">
            <Link to="/" className="button-secondary">
              Back to landing page
            </Link>
          </div>
        </section>

        <section className="panel p-6 sm:p-8">
          {children}
          <div className="mt-6 border-t border-app-border pt-6 text-sm text-app-muted">
            {footer}
          </div>
        </section>
      </div>
    </main>
  );
}
