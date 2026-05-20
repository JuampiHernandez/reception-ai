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
  const dir = path.join(process.cwd(), "supabase/migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const migrationSql = fs.readFileSync(path.join(dir, file), "utf-8");
    await sql.unsafe(migrationSql);
    console.log(`Applied ${file}`);
  }
  console.log("All migrations applied successfully");
  await sql.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
