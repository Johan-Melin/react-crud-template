import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
export async function getSessionFromHeaders(headers) {
    const normalizedHeaders = headers instanceof Headers ? headers : fromNodeHeaders(headers);
    return auth.api.getSession({
        headers: normalizedHeaders,
    });
}
//# sourceMappingURL=session.js.map