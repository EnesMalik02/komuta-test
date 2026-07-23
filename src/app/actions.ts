"use server";

import { revalidatePath } from "next/cache";
import { addNote } from "@/lib/notes";

export async function addNoteAction(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;

  await addNote(content);
  revalidatePath("/");
}
