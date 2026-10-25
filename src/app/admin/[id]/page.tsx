import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { STEPS, STATUS, LINK_KEYS, LINK_LABELS } from "@/lib/questions";
import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "@/components/DeleteButton";
import PrintButton from "@/components/PrintButton";
import { saveBriefing, deleteBriefing } from "../actions";
export const dynamic = "force-dynamic";
export default async function Detail({ params, searchParams }: { params: { id: string }; searchParams: { salvo?: string; erro?: string } }) {
  const sb = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(params.id)) notFound();
  const { data: b } = await sb.from("briefings").select("*").eq("id", params.id).maybeSingle();
  if (!b) notFound();
  const val = (key: string, type: string) => {
    if (key === "companyName") return b.company_name; if (key === "segment") return b.segment; const v = b.answers?.[key];
    if (type === "links") return LINK_KEYS.filter((k) => v?.[k]).map((k) => `${LINK_LABELS[k]}: ${v[k]}`).join("\n");
    return Array.isArray(v) ? v.join(", ") : v;
  };
  return (<main className="mx-auto max-w-3xl px-5 py-10">
    <div className="flex items-center justify-between print:hidden"><Link href="/admin" className="text-sm text-bronze underline">← Voltar à lista</Link><PrintButton /></div>
    <h1 className="mt-4 font-serif text-3xl">{b.company_name}</h1>
    <p className="text-sm text-warm">Recebido em {new Date(b.created_at).toLocaleString("pt-BR")} · {STATUS[b.status]}</p>
    <a className="mt-2 inline-block text-sm text-bronze underline print:hidden" href={`/admin/export?format=json&id=${b.id}`}>Exportar este briefing (JSON)</a>
    {searchParams.salvo && <p className="mt-4 text-sm text-bronze">Alterações salvas.</p>}
    {searchParams.erro && <p role="alert" className="mt-4 text-sm text-red-300">Não foi possível concluir a operação.</p>}
    <form action={saveBriefing.bind(null, b.id)} className="card mt-6 space-y-4 print:hidden">
      <div><label htmlFor="status" className="text-sm text-warm">Status</label><select id="status" name="status" defaultValue={b.status} className="input mt-1">{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
      <div><label htmlFor="notes" className="text-sm text-warm">Observações internas (privadas)</label><textarea id="notes" name="notes" rows={4} maxLength={5000} defaultValue={b.admin_notes ?? ""} className="input mt-1" /></div>
      <SubmitButton>Salvar alterações</SubmitButton></form>
    {(b.answers?.contactName || b.answers?.contactInfo) && <section className="card mt-6"><h2 className="font-serif text-xl text-bronze">Contato</h2>
      <dl className="mt-2 space-y-2 text-sm"><div><dt className="text-warm">Nome</dt><dd>{b.answers?.contactName || "—"}</dd></div><div><dt className="text-warm">WhatsApp ou e-mail</dt><dd>{b.answers?.contactInfo || "—"}</dd></div></dl></section>}
    {STEPS.map((s) => (<section key={s.title} className="mt-10"><h2 className="font-serif text-2xl text-bronze">{s.title}</h2>
      <dl className="mt-4 space-y-4">{s.fields.map((f) => (<div key={f.key}><dt className="text-sm text-warm">{f.n}. {f.label}</dt><dd className="whitespace-pre-wrap">{val(f.key, f.type) || <span className="text-warm/60">—</span>}</dd></div>))}</dl></section>))}
    <div className="mt-12 print:hidden"><DeleteButton action={deleteBriefing.bind(null, b.id)} /></div></main>);
}
