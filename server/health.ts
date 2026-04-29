import { serverEnv } from "./env.js";

export type HealthPayload = {
  environment: string;
  runtime: string;
  status: "ok";
  timestamp: string;
};

export function getHealthPayload(runtime: string): HealthPayload {
  return {
    environment: serverEnv.VERCEL_ENV ?? serverEnv.NODE_ENV,
    runtime,
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}
