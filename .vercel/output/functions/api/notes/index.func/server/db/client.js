import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { getDatabaseUrl } from "./env.js";
import * as schema from "./schema.js";
const sql = neon(getDatabaseUrl());
export const db = drizzle({ client: sql, schema, casing: "snake_case" });
//# sourceMappingURL=client.js.map