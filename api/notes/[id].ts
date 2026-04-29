import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionFromHeaders } from "../../server/auth/session.ts";
import { createNoteSchema } from "../../server/notes/schema.ts";
import {
  deleteNoteForUser,
  updateNoteForUser,
} from "../../server/notes/service.ts";

function getNoteId(request: VercelRequest) {
  const { id } = request.query;
  return Array.isArray(id) ? id[0] : id;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session?.user) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }

  const noteId = getNoteId(request);

  if (!noteId) {
    response.status(400).json({ error: "Note id is required." });
    return;
  }

  if (request.method === "PATCH") {
    const payload = createNoteSchema.safeParse(request.body);

    if (!payload.success) {
      response.status(400).json({
        error: "Invalid note payload.",
        issues: payload.error.flatten(),
      });
      return;
    }

    const note = await updateNoteForUser(session.user.id, noteId, payload.data);

    if (!note) {
      response.status(404).json({ error: "Note not found." });
      return;
    }

    response.status(200).json({ note });
    return;
  }

  if (request.method === "DELETE") {
    const note = await deleteNoteForUser(session.user.id, noteId);

    if (!note) {
      response.status(404).json({ error: "Note not found." });
      return;
    }

    response.status(200).json({ note });
    return;
  }

  response.setHeader("Allow", "PATCH, DELETE");
  response.status(405).json({ error: "Method not allowed." });
}
