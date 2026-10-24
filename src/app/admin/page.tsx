import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { STATUS } from "@/lib/questions";
import { logout } from "./actions";
export const dynamic = "force-dynamic";
const PER = 10;
type SP = { q?: string; status?: string; page?: string; ordem?: string; excluido?: string };
export default async function Admin({ searchParams: sp }: { searchParams: SP }) {
  const sb = await requireAdmin();
  const q = (sp.q ?? "").replace(/[^\p{L}\p{N} ]/gu, "").slice(0, 80), page = Math.max(1, Number(sp.page) || 1), asc = sp.ordem === "asc";
  const count = (s?: string) => { const r = sb.from("briefings").select("id", { count: "exact", head: true }); return (s ? r.eq("status", s) : r).then((x) => x.count ?? 0); };
  let list = sb.from("briefings").select("id,company_name,segment,status,created_at", { count: "exact" }).order("created_at", { ascending: asc }).range((page - 1) * PER, page * PER - 1);
  if (q) list = list.or(`company_name.ilike.%${q}%,segment.ilike.%${q}%`);
  if (sp.status && sp.status in STATUS) list = list.eq("status", sp.status);
  const [total, novos, analise, concl, res] = await Promise.all([count(), count("novo"), count("em_analise"), count("concluido"), list]);
  const rows = res.data ?? [], pages = Math.max(1, Math.ceil((res.count ?? 0) / PER));
  const href = (p: number) => `/admin?${new URLSearchParams({ ...(q && { q }), ...(sp.status && { status: sp.status }), ...(asc && { ordem: "asc" }), page: String(p) })}`;
  const fmt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  return (<main className="mx-auto max-w-5xl px-5 py-10">
    <div className="flex items-center justify-between"><h1 className="font-serif text-3xl">Briefings</h1>
      <form action={logout}><button className="btn-ghost">Sair</button></form></div>
    {sp.excluido && <p className="mt-4 text-sm text-bronze">Briefing excluído.</p>}
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Total", total], ["Novos", novos], ["Em análise", analise], ["Concluídos", concl]].map(([l, n]) => (
      <div key={l as string} className="card"><p className="text-sm text-warm">{l}</p><p className="font-serif text-3xl text-bronze">{n}</p></div>))}</div>
    <form className="mt-8 flex flex-wrap gap-3" role="search">
      <input name="q" defaultValue={q} placeholder="Buscar empresa ou segmento" aria-label="Buscar" className="input flex-1 min-w-[200px]" />
      <select name="status" defaultValue={sp.status ?? ""} aria-label="Status" className="input w-auto"><option value="">Todos os status</option>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select name="ordem" defaultValue={asc ? "asc" : "desc"} aria-label="Ordem" className="input w-auto"><option value="desc">Mais recentes</option><option value="asc">Mais antigos</option></select>
      <button className="btn">Filtrar</button><Link href="/admin" className="btn-ghost">Atualizar</Link></form>
    <div className="mt-4 flex gap-3 text-sm"><a className="text-bronze underline" href="/admin/export?format=csv">Exportar CSV</a><a className="text-bronze underline" href="/admin/export?format=json">Exportar JSON</a></div>
    {res.error ? <p role="alert" className="card mt-6 text-red-300">Não foi possível carregar os dados. Verifique a conexão e atualize.</p>
      : rows.length === 0 ? <p className="card mt-6 text-warm">Nenhum briefing encontrado.</p>
      : <ul className="mt-6 space-y-3">{rows.map((r) => (<li key={r.id}><Link href={`/admin/${r.id}`} className="card flex flex-wrap items-center justify-between gap-2 transition hover:border-bronze">
          <div><p className="font-medium">{r.company_name}</p><p className="text-sm text-warm">{r.segment} · {fmt(r.created_at)}</p></div>
          <span className="rounded-full border border-bronze/60 px-3 py-1 text-xs text-bronze">{STATUS[r.status]}</span></Link></li>))}</ul>}
    <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Paginação">
      {page > 1 ? <Link className="btn-ghost" href={href(page - 1)}>Anterior</Link> : <span />}<span className="text-warm">Página {page} de {pages}</span>
      {page < pages ? <Link className="btn-ghost" href={href(page + 1)}>Próxima</Link> : <span />}</nav></main>);
}
