import { supabase } from "./supabase";

export async function uploadCover(
  dataUrl: string,
  userId: string,
  bookId: string
): Promise<string> {
  if (!supabase) throw new Error("Supabase not available");

  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const path = `${userId}/${bookId}.jpg`;

  const { error } = await supabase.storage
    .from("covers")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(path);

  return data.publicUrl;
}
