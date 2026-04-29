import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { notes } from "../db/schema.ts";
import type { CreateNoteInput } from "./schema.ts";

export async function listNotesForUser(userId: string) {
  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt), desc(notes.createdAt));
}

export async function createNoteForUser(userId: string, input: CreateNoteInput) {
  const [note] = await db
    .insert(notes)
    .values({
      userId,
      text: input.text,
    })
    .returning();

  return note;
}

export async function updateNoteForUser(
  userId: string,
  noteId: string,
  input: CreateNoteInput,
) {
  const [note] = await db
    .update(notes)
    .set({
      text: input.text,
      updatedAt: new Date(),
    })
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning();

  return note ?? null;
}

export async function deleteNoteForUser(userId: string, noteId: string) {
  const [note] = await db
    .delete(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .returning();

  return note ?? null;
}
