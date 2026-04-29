import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../features/system/get-health.ts";

const plannedSlices = [
  "TanStack Router and Query foundation",
  "Better Auth and Drizzle on Vercel Functions",
  "Protected notes CRUD with mobile-first UI",
];

export function HomePage() {
  const healthQuery = useQuery({
    queryKey: ["system", "health"],
    queryFn: getHealth,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-700">
            Foundation Slice
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                React CRUD Template
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                The starter app is now running on TanStack Router and TanStack
                Query with a local API healthcheck.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
              Vite SPA + Vercel API
            </span>
          </div>
        </header>

        <section className="grid gap-6 pt-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-slate-950 p-6 text-slate-50 sm:p-8">
              <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Browser code calls HTTP. Server code owns secrets.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                This commit replaces the Vite starter with an app shell that is
                already aligned to the template boundary rules.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                    Server-only
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    `/api` and `/server` own runtime logic while `/src` sticks
                    to route and query concerns.
                  </p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                    Router-ready
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    TanStack Router is now the navigation layer for future auth
                    guards and notes pages.
                  </p>
                </article>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
                    Query-backed
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    TanStack Query verifies the API runtime through the health
                    endpoint.
                  </p>
                </article>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Current route
                </Link>
                <a
                  href="#status"
                  className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
                >
                  Health status
                </a>
              </div>
            </div>

            <section>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                Planned Next
              </p>
              <ul className="mt-4 space-y-3">
                {plannedSlices.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section
            id="status"
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Local Runtime
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              API healthcheck
            </h3>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              {healthQuery.isPending ? (
                <p className="text-sm text-slate-500">
                  Contacting `/api/health`...
                </p>
              ) : null}

              {healthQuery.isError ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-600">
                    API runtime unavailable
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Start the combined dev command to bring up Vite and the
                    local API runtime together.
                  </p>
                </div>
              ) : null}

              {healthQuery.data ? (
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Status</dt>
                    <dd className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
                      {healthQuery.data.status}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Runtime</dt>
                    <dd className="font-medium text-slate-900">
                      {healthQuery.data.runtime}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Environment</dt>
                    <dd className="font-medium text-slate-900">
                      {healthQuery.data.environment}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500">Timestamp</dt>
                    <dd className="font-medium text-slate-900">
                      {new Date(
                        healthQuery.data.timestamp,
                      ).toLocaleTimeString()}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
