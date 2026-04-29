import "../load-env.js";
import { z } from "zod";
const fallbackDatabaseUrl = "postgresql://postgres:postgres@127.0.0.1:5432/react_crud_template";
const databaseEnvSchema = z.object({
    DATABASE_URL: z.url(),
});
export function getDatabaseUrl() {
    return databaseEnvSchema.parse({
        DATABASE_URL: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
    }).DATABASE_URL;
}
//# sourceMappingURL=env.js.map