import { redirect } from "next/navigation";
import { serverClient } from "./supabase/server";
/** Verifica no servidor: sessão válida E presença na tabela admins (via função is_admin). */
export async function requireAdmin() {
  const sb = serverClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) redirect("/admin/login?erro=autorizacao");
  return sb;
}
