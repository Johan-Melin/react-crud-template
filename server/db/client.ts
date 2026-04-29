import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "./env.ts";
import * as schema from "./schema.ts";

const sql = neon(getDatabaseUrl());

export const db = drizzle({ client: sql, schema, casing: "snake_case" });
