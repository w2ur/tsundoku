import { supabase } from "./supabase";

export async function deleteAccount(): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Not available" };

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { error: "Not signed in" };

  const userId = session.user.id;

  // Delete all books
  await supabase.from("books").delete().eq("user_id", userId);

  // Delete all covers from storage
  const { data: files } = await supabase.storage.from("covers").list(userId);
  if (files && files.length > 0) {
    await supabase.storage
      .from("covers")
      .remove(files.map((f) => `${userId}/${f.name}`));
  }

  // Delete profile (cascades to sync_metadata)
  await supabase.from("profiles").delete().eq("id", userId);

  // Sign out
  await supabase.auth.signOut();

  return { error: null };
}
