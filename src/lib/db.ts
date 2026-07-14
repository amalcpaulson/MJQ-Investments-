import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "⚠️ DATABASE_URL is not defined. Please set it in your .env.local file."
  );
}

// Initialize the Neon HTTP connection
const sql = neon(databaseUrl || "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder");

// Export the Drizzle client wrapped with our schema
export const db = drizzle(sql, { schema });
