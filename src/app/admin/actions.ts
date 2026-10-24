"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { serverClient } from "@/lib/supabase/server";
import { STATUS } from "@/lib/questions";

export async function login(fd: FormData) {
  const { error } = await serverClient().auth.signInWithPassword({ email: String(fd.get("email") ?? "").trim(), password: String(fd.get("password") ?? "") });
  redirect(error ? "/admin/login?erro=1" : "/admin");
}
export async function logout() { await serverClient().auth.signOut(); redirect("/admin/login"); }
export async function saveBriefing(id: string, fd: FormData) {
  const sb = await requireAdmin();
  const status = String(fd.get("status")); const notes = String(fd.get("notes") ?? "").slice(0, 5000);
  if (!(status in STATUS)) redirect(`/admin/${id}?erro=1`);
  const { error } = await sb.from("briefings").update({ status, admin_notes: notes || null }).eq("id", id);
  revalidatePath("/admin"); redirect(`/admin/${id}?${error ? "erro=1" : "salvo=1"}`);
}
export async function deleteBriefing(id: string) {
  const sb = await requireAdmin();
  const { error } = await sb.from("briefings").delete().eq("id", id);
  if (error) redirect(`/admin/${id}?erro=1`);
  revalidatePath("/admin"); redirect("/admin?excluido=1");
}
