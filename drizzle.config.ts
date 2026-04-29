import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:5432/react_crud_template";

export default defineConfig({
  out: "./drizzle",
  schema: "./server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  },
});
