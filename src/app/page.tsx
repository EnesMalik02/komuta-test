import { getNotes } from "@/lib/notes";
import { addNoteAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const notes = await getNotes();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-8 py-16 px-6">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50">
          Notlar
        </h1>

        <form action={addNoteAction} className="flex gap-2">
          <input
            type="text"
            name="content"
            placeholder="Bir not yaz..."
            required
            className="flex-1 rounded-md border border-black/[.1] bg-white px-4 py-2 text-black dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Ekle
          </button>
        </form>

        <ul className="flex flex-col gap-3">
          {notes.length === 0 && (
            <li className="text-zinc-500">Henüz not yok.</li>
          )}
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-md border border-black/[.08] bg-white px-4 py-3 dark:border-white/[.145] dark:bg-zinc-900"
            >
              <p className="text-black dark:text-zinc-50">{note.content}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {new Date(note.created_at).toLocaleString("tr-TR")}
              </p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
