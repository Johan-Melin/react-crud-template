import { getSessionFromHeaders } from "../../server/auth/session.js";
import { createNoteSchema } from "../../server/notes/schema.js";
import { deleteNoteForUser, updateNoteForUser, } from "../../server/notes/service.js";
function getNoteId(request) {
    const { id } = request.query;
    return Array.isArray(id) ? id[0] : id;
}
export default async function handler(request, response) {
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
//# sourceMappingURL=%5Bid%5D.js.map