import { Pool } from "pg";

declare global {
  var pgPool: Pool | undefined;
}

function connectionStringWithoutSslMode(url: string) {
  return url.replace(/([?&])sslmode=[^&]*&?/, "$1").replace(/[?&]$/, "");
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString: connectionStringWithoutSslMode(process.env.DATABASE_URL as string),
    ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}
