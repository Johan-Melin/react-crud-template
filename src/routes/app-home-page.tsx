import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSessionRedirect } from "../features/auth/use-session-redirect.ts";
import { authClient } from "../lib/auth-client.ts";
import { createNote, getNotes } from "../features/notes/api.ts";
import { ThemeToggle } from "../theme/theme-toggle.tsx";
import { useTheme } from "../theme/use-theme.ts";

export function AppHomePage() {
  const { mode, resolvedTheme } = useTheme();
  const sessionQuery = useSessionRedirect({ whenUnauthenticated: "/sign-in" });
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
  });
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      setNoteText("");
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      setError("Unable to create the note.");
    },
  });

  async function handleSignOut() {
    await authClient.signOut();
    window.location.href = "/";
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    await createNoteMutation.mutateAsync(noteText.trim());
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
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
                Notes
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.06em]">
                Authenticated users can now list and create their own notes.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-app-muted sm:text-lg">
                This is the first real CRUD handoff from the protected route.
                The API already scopes reads and writes to the signed-in user.
              </p>
            </div>

            <Link to="/" className="button-secondary">
              Back to landing page
            </Link>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleCreateNote}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-app-text">
                New note
              </span>
              <textarea
                required
                rows={5}
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                className="w-full rounded-[1.5rem] border border-app-border bg-white/70 px-4 py-3 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent dark:bg-white/5"
                placeholder="Write a note to verify create and list flows."
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="button-primary"
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? "Saving..." : "Create note"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-app-muted">
                Your notes
              </p>
              {notesQuery.data ? (
                <span className="rounded-full border border-app-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-app-muted">
                  {notesQuery.data.length} total
                </span>
              ) : null}
            </div>

            {notesQuery.isPending ? (
              <div className="rounded-[1.5rem] border border-app-border bg-app-bg-strong p-5 text-sm text-app-muted">
                Loading notes...
              </div>
            ) : null}

            {notesQuery.isError ? (
              <div className="rounded-[1.5rem] border border-red-300/60 bg-red-50 p-5 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
                Unable to load notes right now.
              </div>
            ) : null}

            {notesQuery.data && notesQuery.data.length === 0 ? (
              <div className="rounded-[1.5rem] border border-app-border bg-app-bg-strong p-5 text-sm leading-6 text-app-muted">
                No notes yet. Create one above to verify the first authenticated
                CRUD path.
              </div>
            ) : null}

            {notesQuery.data?.map((note) => (
              <article
                key={note.id}
                className="rounded-[1.5rem] border border-app-border bg-white/55 p-5 dark:bg-white/5"
              >
                <p className="whitespace-pre-wrap text-sm leading-7 text-app-text">
                  {note.text}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-app-muted">
                  Updated{" "}
                  {new Date(note.updatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </article>
            ))}
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
