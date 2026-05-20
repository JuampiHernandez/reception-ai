import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Schema = typeof schema;
type Database = PostgresJsDatabase<Schema>;

let _db: Database | null = null;

function createDb(): Database {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is missing. Add your Supabase Postgres connection string to .env.local — see docs/ENV_SETUP.md"
    );
  }

  const client = postgres(connectionString, {
    prepare: false,
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  return drizzle(client, { schema });
}

function getDb(): Database {
  if (!_db) _db = createDb();
  return _db;
}

export const db = new Proxy({} as Database, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(real);
    }
    return value;
  },
});

export { schema };
