import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.ts";

export async function getSessionFromHeaders(headers: Headers | IncomingHttpHeaders) {
  const normalizedHeaders =
    headers instanceof Headers ? headers : fromNodeHeaders(headers);

  return auth.api.getSession({
    headers: normalizedHeaders,
  });
}
