import { NextResponse } from "next/server";
import { serverClient } from "@/lib/supabase/server";
import { STEPS, STATUS, LINK_KEYS, LINK_LABELS } from "@/lib/questions";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const sb = serverClient();
  const { data: { user } } = await sb.auth.getUser();
  const { data: ok } = user ? await sb.rpc("is_admin") : { data: false };
  if (!ok) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const u = new URL(req.url), id = u.searchParams.get("id"), fmt = u.searchParams.get("format") === "json" ? "json" : "csv";
  let q = sb.from("briefings").select("*").order("created_at", { ascending: false }).limit(5000);
  if (id) q = q.eq("id", id);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: "Falha na exportação." }, { status: 500 });
  const stamp = new Date().toISOString().slice(0, 10);
  if (fmt === "json") return new NextResponse(JSON.stringify(data, null, 2), { headers: { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": `attachment; filename="briefings-${stamp}.json"` } });

  const cols: { h: string; get: (r: any) => any }[] = [{ h: "ID", get: (r) => r.id }, { h: "Recebido em", get: (r) => r.created_at }, { h: "Status", get: (r) => STATUS[r.status] }, { h: "Observações internas", get: (r) => r.admin_notes }];
  for (const s of STEPS) for (const f of s.fields) {
    if (f.type === "links") LINK_KEYS.forEach((k) => cols.push({ h: `${f.n}. ${LINK_LABELS[k]}`, get: (r) => r.answers?.links?.[k] }));
    else cols.push({ h: `${f.n}. ${f.label}`, get: (r) => (f.key === "companyName" ? r.company_name : f.key === "segment" ? r.segment : r.answers?.[f.key]) });
  }
  const cell = (v: any) => { let s = Array.isArray(v) ? v.join("; ") : String(v ?? ""); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
  const csv = "\uFEFF" + [cols.map((c) => cell(c.h)).join(","), ...(data ?? []).map((r) => cols.map((c) => cell(c.get(r))).join(","))].join("\r\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="briefings-${stamp}.csv"` } });
}
