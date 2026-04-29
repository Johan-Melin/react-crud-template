import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.ts";
import { getAuthProviderConfig } from "./auth/provider-config.ts";
import { getSessionFromHeaders } from "./auth/session.ts";
import { getHealthPayload } from "./health.ts";
import { createNoteSchema } from "./notes/schema.ts";
import {
  createNoteForUser,
  deleteNoteForUser,
  listNotesForUser,
  updateNoteForUser,
} from "./notes/service.ts";

const port = 3001;
const authNodeHandler = toNodeHandler(auth.handler);

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/api/health") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(getHealthPayload("local-node-dev-server")));
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/providers") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(getAuthProviderConfig()));
    return;
  }

  if (url.pathname === "/api/notes") {
    const session = await getSessionFromHeaders(request.headers);

    if (!session?.user) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Authentication required." }));
      return;
    }

    if (request.method === "GET") {
      const notes = await listNotesForUser(session.user.id);
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ notes }));
      return;
    }

    if (request.method === "POST") {
      const body = await new Response(request).json().catch(() => null);
      const payload = createNoteSchema.safeParse(body);

      if (!payload.success) {
        response.writeHead(400, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            error: "Invalid note payload.",
            issues: payload.error.flatten(),
          }),
        );
        return;
      }

      const note = await createNoteForUser(session.user.id, payload.data);
      response.writeHead(201, { "content-type": "application/json" });
      response.end(JSON.stringify({ note }));
      return;
    }

    response.writeHead(405, {
      "content-type": "application/json",
      Allow: "GET, POST",
    });
    response.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  if (url.pathname.startsWith("/api/notes/")) {
    const session = await getSessionFromHeaders(request.headers);
    const noteId = url.pathname.split("/").at(-1);

    if (!session?.user) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Authentication required." }));
      return;
    }

    if (!noteId) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Note id is required." }));
      return;
    }

    if (request.method === "PATCH") {
      const body = await new Response(request).json().catch(() => null);
      const payload = createNoteSchema.safeParse(body);

      if (!payload.success) {
        response.writeHead(400, { "content-type": "application/json" });
        response.end(
          JSON.stringify({
            error: "Invalid note payload.",
            issues: payload.error.flatten(),
          }),
        );
        return;
      }

      const note = await updateNoteForUser(session.user.id, noteId, payload.data);

      if (!note) {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "Note not found." }));
        return;
      }

      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ note }));
      return;
    }

    if (request.method === "DELETE") {
      const note = await deleteNoteForUser(session.user.id, noteId);

      if (!note) {
        response.writeHead(404, { "content-type": "application/json" });
        response.end(JSON.stringify({ error: "Note not found." }));
        return;
      }

      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ note }));
      return;
    }

    response.writeHead(405, {
      "content-type": "application/json",
      Allow: "PATCH, DELETE",
    });
    response.end(JSON.stringify({ error: "Method not allowed." }));
    return;
  }

  if (url.pathname.startsWith("/api/auth/")) {
    await authNodeHandler(request, response);
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`Local API emulator listening on http://127.0.0.1:${port}`);
});
