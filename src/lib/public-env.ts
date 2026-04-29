import { z } from "zod";

const publicEnvSchema = z.object({
  VITE_APP_NAME: z.string().trim().min(1).optional(),
});

export const publicEnv = publicEnvSchema.parse({
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
});
