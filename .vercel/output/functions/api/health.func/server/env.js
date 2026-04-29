import { z } from "zod";
const serverEnvSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.string().optional(),
    VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
});
export const serverEnv = serverEnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_ENV: process.env.VERCEL_ENV,
});
//# sourceMappingURL=env.js.map