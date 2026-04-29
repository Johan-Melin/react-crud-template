import { desc, eq } from "drizzle-orm";
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
