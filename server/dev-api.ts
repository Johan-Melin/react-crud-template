import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.ts";
import { getAuthProviderConfig } from "./auth/provider-config.ts";
import { getHealthPayload } from "./health.ts";

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
