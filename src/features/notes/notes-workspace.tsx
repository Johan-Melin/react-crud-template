import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, getNotes, updateNote } from "./api.ts";

export function NotesWorkspace() {
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
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
  const updateNoteMutation = useMutation({
    mutationFn: ({ noteId, text }: { noteId: string; text: string }) =>
      updateNote(noteId, text),
    onSuccess: async () => {
      setEditingNoteId(null);
      setEditingText("");
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      setError("Unable to update the note.");
    },
  });
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: () => {
      setError("Unable to delete the note.");
    },
  });

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    await createNoteMutation.mutateAsync(noteText.trim());
  }

  async function handleUpdateNote(
    event: React.FormEvent<HTMLFormElement>,
    noteId: string,
  ) {
    event.preventDefault();
    setError(null);
    await updateNoteMutation.mutateAsync({
      noteId,
      text: editingText.trim(),
    });
  }

  function startEditing(noteId: string, text: string) {
    setEditingNoteId(noteId);
    setEditingText(text);
    setError(null);
  }

  function cancelEditing() {
    setEditingNoteId(null);
    setEditingText("");
  }

  return (
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
            This is the first real CRUD handoff from the protected route. The
            API already scopes reads and writes to the signed-in user.
          </p>
        </div>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleCreateNote}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-app-text">New note</span>
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
            {editingNoteId === note.id ? (
              <form
                className="space-y-4"
                onSubmit={(event) => handleUpdateNote(event, note.id)}
              >
                <textarea
                  required
                  rows={5}
                  value={editingText}
                  onChange={(event) => setEditingText(event.target.value)}
                  className="w-full rounded-[1.5rem] border border-app-border bg-white/70 px-4 py-3 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent dark:bg-white/5"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={updateNoteMutation.isPending}
                  >
                    {updateNoteMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-sm leading-7 text-app-text">
                  {note.text}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => startEditing(note.id, note.text)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button-secondary"
                    disabled={deleteNoteMutation.isPending}
                    onClick={() => {
                      void deleteNoteMutation.mutateAsync(note.id);
                    }}
                  >
                    {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
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
  );
}
