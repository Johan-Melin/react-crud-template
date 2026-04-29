import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { getAuthProviderConfig } from "./auth/provider-config.js";
import { getHealthPayload } from "./health.js";

const port = 3001;
const host = "127.0.0.1";

let authNodeHandlerPromise:
  | Promise<
      (
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
      ) => Promise<void>
    >
  | undefined;

async function getAuthNodeHandler() {
  if (!authNodeHandlerPromise) {
    authNodeHandlerPromise = (async () => {
      const [{ toNodeHandler }, { auth }] = await Promise.all([
        import("better-auth/node"),
        import("./auth/auth.js"),
      ]);

      return toNodeHandler(auth.handler) as (
        request: IncomingMessage,
        response: ServerResponse<IncomingMessage>,
      ) => Promise<void>;
    })();
  }

  return authNodeHandlerPromise;
}

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
    const [{ getSessionFromHeaders }, { createNoteSchema }, notesService] =
      await Promise.all([
        import("./auth/session.js"),
        import("./notes/schema.js"),
        import("./notes/service.js"),
      ]);
    const session = await getSessionFromHeaders(request.headers);

    if (!session?.user) {
      response.writeHead(401, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Authentication required." }));
      return;
    }

    if (request.method === "GET") {
      const notes = await notesService.listNotesForUser(session.user.id);
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

      const note = await notesService.createNoteForUser(
        session.user.id,
        payload.data,
      );
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
    const [{ getSessionFromHeaders }, { createNoteSchema }, notesService] =
      await Promise.all([
        import("./auth/session.js"),
        import("./notes/schema.js"),
        import("./notes/service.js"),
      ]);
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

      const note = await notesService.updateNoteForUser(
        session.user.id,
        noteId,
        payload.data,
      );

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
      const note = await notesService.deleteNoteForUser(
        session.user.id,
        noteId,
      );

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
    const authNodeHandler = await getAuthNodeHandler();
    await authNodeHandler(request, response);
    return;
  }

  response.writeHead(404, { "content-type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, host, () => {
  console.log(`Local API emulator listening on http://${host}:${port}`);
});
