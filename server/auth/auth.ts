import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client.js";
import * as schema from "../db/schema.js";
import {
  getAuthBaseUrl,
  getAuthSecret,
  getEnabledSocialProviders,
} from "./env.js";

export const auth = betterAuth({
  appName: "React CRUD Template",
  baseURL: getAuthBaseUrl(),
  basePath: "/api/auth",
  secret: getAuthSecret(),
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: getEnabledSocialProviders(),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
