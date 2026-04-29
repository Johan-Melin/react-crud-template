export type Note = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export async function getNotes() {
  const response = await fetch("/api/notes");

  if (!response.ok) {
    throw new Error("Unable to load notes.");
  }

  const payload = (await response.json()) as { notes: Note[] };
  return payload.notes;
}

export async function createNote(text: string) {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Unable to create the note.");
  }

  const payload = (await response.json()) as { note: Note };
  return payload.note;
}
