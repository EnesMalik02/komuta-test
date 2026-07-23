import { pool, ensureSchema } from "./db";
import { cache, NOTES_CACHE_KEY } from "./cache";

export type Note = {
  id: number;
  content: string;
  created_at: string;
};

const CACHE_TTL_SECONDS = 60;

export async function getNotes(): Promise<Note[]> {
  await ensureSchema();

  const cached = await cache.get(NOTES_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const { rows } = await pool.query<Note>(
    "SELECT id, content, created_at FROM notes ORDER BY created_at DESC"
  );

  await cache.set(NOTES_CACHE_KEY, JSON.stringify(rows), "EX", CACHE_TTL_SECONDS);
  return rows;
}

export async function addNote(content: string): Promise<void> {
  await ensureSchema();
  await pool.query("INSERT INTO notes (content) VALUES ($1)", [content]);
  await cache.del(NOTES_CACHE_KEY);
}
