import { z } from "zod";

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

export function getDatabaseUrl() {
  return databaseEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
  }).DATABASE_URL;
}
