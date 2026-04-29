import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionFromHeaders } from "../../server/auth/session.js";
import { createNoteSchema } from "../../server/notes/schema.js";
import {
  createNoteForUser,
  listNotesForUser,
} from "../../server/notes/service.js";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session?.user) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }

  if (request.method === "GET") {
    const notes = await listNotesForUser(session.user.id);
    response.status(200).json({ notes });
    return;
  }

  if (request.method === "POST") {
    const payload = createNoteSchema.safeParse(request.body);

    if (!payload.success) {
      response.status(400).json({
        error: "Invalid note payload.",
        issues: payload.error.flatten(),
      });
      return;
    }

    const note = await createNoteForUser(session.user.id, payload.data);
    response.status(201).json({ note });
    return;
  }

  response.setHeader("Allow", "GET, POST");
  response.status(405).json({ error: "Method not allowed." });
}
