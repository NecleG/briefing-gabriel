"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { STEPS, LINK_KEYS, LINK_LABELS, CONTACT, type Field } from "@/lib/questions";
import { briefingSchema } from "@/lib/schema";

const KEY = "briefing-rascunho-v1";
const blank = (): any => {
  const d: any = { contactName: "", contactInfo: "", segmentOther: "", website_hp: "", links: Object.fromEntries(LINK_KEYS.map((k) => [k, ""])) };
  STEPS.forEach((s) => s.fields.forEach((f) => { if (f.type === "multi") d[f.key] = []; else if (f.type !== "links") d[f.key] = ""; }));
  return d;
};
const seg = (d: any) => (d.segment === "Outro" ? d.segmentOther.trim() : d.segment);

export default function BriefingForm() {
  const [d, setD] = useState<any>(blank);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [fail, setFail] = useState("");
  const lock = useRef(false);
  const sid = useRef("");

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) { const p = JSON.parse(s); setD({ ...blank(), ...p.d }); sid.current = p.sid; } } catch {}
    if (!sid.current) sid.current = crypto.randomUUID();
  }, []);
  useEffect(() => { if (sid.current && !done) try { localStorage.setItem(KEY, JSON.stringify({ d, sid: sid.current })); } catch {} }, [d, done]);

  const set = (k: string, v: any) => { setD((p: any) => ({ ...p, [k]: v })); setErr((e) => { const n = { ...e }; delete n[k]; return n; }); };
  const toggle = (k: string, o: string) => set(k, d[k].includes(o) ? d[k].filter((x: string) => x !== o) : [...d[k], o]);

  const check = (keys: string[] | null) => {
    const r = briefingSchema.safeParse({ ...d, segment: seg(d), submissionId: sid.current });
    const e: Record<string, string> = {};
    if (!r.success) for (const i of r.error.issues) { const k = i.path.join("."); if ((!keys || keys.includes(String(i.path[0]))) && !e[k]) e[k] = i.message; }
    return e;
  };
  const top = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const next = () => { const e = check(STEPS[step].fields.map((f) => f.key)); setErr(e); if (!Object.keys(e).length) { setStep(step + 1); top(); } };
  const back = () => { setStep(step - 1); top(); };

  const submit = async () => {
    if (lock.current) return;
    const e = check(null);
    if (Object.keys(e).length) {
      setErr(e); const bad = STEPS.findIndex((s) => s.fields.some((f) => Object.keys(e).some((k) => k.split(".")[0] === f.key)));
      setStep(Math.max(bad, 0)); top(); return;
    }
    lock.current = true; setSending(true); setFail("");
    try {
      const r = await fetch("/api/briefing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...d, segment: seg(d), submissionId: sid.current }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || "Falha ao enviar.");
      try { localStorage.removeItem(KEY); } catch {}
      setDone(true); top();
    } catch (x: any) {
      setFail(x?.message && x.message !== "Failed to fetch" ? x.message : "Sem conexão ou servidor indisponível. Suas respostas foram mantidas; tente novamente.");
    } finally { lock.current = false; setSending(false); }
  };

  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "");
  if (done) return (<main className="mx-auto max-w-xl px-5 py-24 text-center">
    <CheckCircle2 className="mx-auto h-12 w-12 text-bronze" aria-hidden />
    <h1 className="mt-6 font-serif text-4xl">Briefing recebido</h1>
    <p className="mt-4 text-warm">Obrigado! Analisarei suas respostas e retornarei {process.env.NEXT_PUBLIC_PRAZO_RETORNO || "em breve"}.</p>
    {wa && <a className="btn mt-8" href={`https://wa.me/${wa}?text=${encodeURIComponent("Olá! Acabei de enviar o briefing da minha empresa.")}`}>Falar pelo WhatsApp</a>}</main>);

  const S = STEPS[step], last = step === STEPS.length - 1;
  const Err = ({ k }: { k: string }) => err[k] ? <p id={`e-${k}`} role="alert" className="mt-1 text-sm text-red-300">{err[k]}</p> : null;
  const Label = ({ f }: { f: Field }) => (<>
    <span className="block text-base font-medium"><span className="text-bronze">{f.n}.</span> {f.label}{f.req && <span className="ml-1 text-bronze" aria-label="obrigatório">*</span>}</span>
    {f.hint && <span className="mt-1 block text-sm text-warm">{f.hint}</span>}</>);

  const render = (f: Field) => {
    const id = `f-${f.key}`, bad = !!err[f.key];
    if (f.type === "text" || f.type === "long") {
      const P = { id, value: d[f.key], onChange: (e: any) => set(f.key, e.target.value), "aria-invalid": bad, "aria-describedby": bad ? `e-${f.key}` : undefined, className: "input mt-2" };
      return (<div key={f.key}><label htmlFor={id}><Label f={f} /></label>
        {f.type === "text" ? <input {...P} maxLength={300} /> : <textarea {...P} rows={4} maxLength={2000} />}<Err k={f.key} /></div>);
    }
    if (f.type === "links") return (<fieldset key={f.key}><legend><Label f={f} /></legend>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">{LINK_KEYS.map((k) => (<div key={k}>
        <label htmlFor={`l-${k}`} className="text-sm text-warm">{LINK_LABELS[k]}</label>
        <input id={`l-${k}`} className="input mt-1" inputMode="url" maxLength={300} value={d.links[k]} aria-invalid={!!err[`links.${k}`]}
          placeholder={k === "whatsapp" ? "(00) 00000-0000" : "https://"} onChange={(e) => set("links", { ...d.links, [k]: e.target.value })} /><Err k={`links.${k}`} /></div>))}</div></fieldset>);
    const multi = f.type === "multi";
    return (<fieldset key={f.key} aria-describedby={bad ? `e-${f.key}` : undefined}><legend><Label f={f} /></legend>
      <div className="mt-2 flex flex-wrap gap-2">{f.options!.map((o) => { const on = multi ? d[f.key].includes(o) : d[f.key] === o;
        return (<label key={o} className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition focus-within:outline focus-within:outline-2 focus-within:outline-bronze ${on ? "border-bronze bg-bronze text-ink" : "border-warm/30 hover:border-bronze"}`}>
          <input type={multi ? "checkbox" : "radio"} name={f.key} className="sr-only" checked={on} onChange={() => (multi ? toggle(f.key, o) : set(f.key, o))} />{o}</label>); })}</div>
      {f.key === "segment" && d.segment === "Outro" && <input className="input mt-3" aria-label="Qual segmento?" placeholder="Qual segmento?" maxLength={100} value={d.segmentOther} onChange={(e) => set("segmentOther", e.target.value)} />}
      <Err k={f.key} /></fieldset>);
  };

  const show = (f: Field) => f.type === "links" ? LINK_KEYS.filter((k) => d.links[k]).map((k) => `${LINK_LABELS[k]}: ${d.links[k]}`).join(" · ") : Array.isArray(d[f.key]) ? d[f.key].join(", ") : f.key === "segment" ? seg(d) : d[f.key];

  return (<main className="mx-auto max-w-3xl px-5 py-10">
    <div className="mb-8"><p className="text-sm text-warm">Etapa {step + 1} de {STEPS.length}</p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-graphite" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
        <div className="h-full bg-bronze transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>
      <h1 className="mt-5 font-serif text-3xl sm:text-4xl">{S.title}</h1></div>
    {/* campo-isca anti-bot: invisível para pessoas */}
    <input tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px]" value={d.website_hp} onChange={(e) => set("website_hp", e.target.value)} />
    <form onSubmit={(e) => { e.preventDefault(); last ? submit() : next(); }} noValidate className="space-y-8">
      {S.fields.map(render)}
      {last && <fieldset className="card"><legend className="px-1 font-medium">Como posso falar com você? <span className="text-sm text-warm">(opcional)</span></legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{CONTACT.map((c) => (<div key={c.key}><label htmlFor={`c-${c.key}`} className="text-sm text-warm">{c.label}</label>
          <input id={`c-${c.key}`} className="input mt-1" maxLength={200} value={d[c.key]} onChange={(e) => set(c.key, e.target.value)} /></div>))}</div></fieldset>}
      {last && <details className="card" open><summary className="cursor-pointer font-medium">Revisar respostas</summary>
        <dl className="mt-4 space-y-3 text-sm">{STEPS.flatMap((s) => s.fields).filter((f) => show(f)).map((f) => (<div key={f.key}><dt className="text-warm">{f.n}. {f.label}</dt><dd className="whitespace-pre-wrap">{show(f)}</dd></div>))}{CONTACT.filter((c) => d[c.key]).map((c) => (<div key={c.key}><dt className="text-warm">{c.label}</dt><dd>{d[c.key]}</dd></div>))}</dl></details>}
      {fail && <p role="alert" className="rounded-lg border border-red-300/40 bg-red-950/40 p-4 text-sm text-red-200">{fail}</p>}
      <div className="flex items-center justify-between gap-3 pt-2">
        {step > 0 ? <button type="button" onClick={back} className="btn-ghost"><ArrowLeft className="h-4 w-4" aria-hidden />Voltar</button> : <span />}
        <button type="submit" disabled={sending} className="btn">{sending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{last ? (sending ? "Enviando…" : "Enviar briefing") : <>Continuar<ArrowRight className="h-4 w-4" aria-hidden /></>}</button></div>
    </form>
    <p className="mt-10 text-xs text-warm">Seu rascunho é salvo apenas neste navegador e não é um envio oficial. Só o botão “Enviar briefing” registra suas respostas. <Link href="/privacidade" className="underline">Privacidade</Link></p>
  </main>);
}
