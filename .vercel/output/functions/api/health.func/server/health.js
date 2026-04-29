import { serverEnv } from "./env.js";
export function getHealthPayload(runtime) {
    return {
        environment: serverEnv.VERCEL_ENV ?? serverEnv.NODE_ENV,
        runtime,
        status: "ok",
        timestamp: new Date().toISOString(),
    };
}
//# sourceMappingURL=health.js.map