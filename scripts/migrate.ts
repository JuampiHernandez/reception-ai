import "./load-env";
import postgres from "postgres";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required. See docs/ENV_SETUP.md");
  process.exit(1);
}

const sql = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

async function migrate() {
  const migrationPath = path.join(
    process.cwd(),
    "supabase/migrations/001_initial.sql"
  );
  const migrationSql = fs.readFileSync(migrationPath, "utf-8");
  await sql.unsafe(migrationSql);
  console.log("Supabase migration applied successfully");
  await sql.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
