import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { briefingSchema } from "@/lib/schema";

const hits = new Map<string, number[]>(); // limite simples por IP (use Upstash/Vercel KV em produção)

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
  if (recent.length >= 5) return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const parsed = briefingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { submissionId, companyName, segment, website_hp, ...rest } = parsed.data;
  if (website_hp) return NextResponse.json({ ok: true }); // bot: finge sucesso sem gravar

  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
  const { error } = await sb.from("briefings").insert({ submission_id: submissionId, company_name: companyName, segment, answers: rest });
  if (error && error.code !== "23505") // 23505 = reenvio duplicado: já salvo
    return NextResponse.json({ error: "Não foi possível salvar agora. Suas respostas foram mantidas; tente novamente." }, { status: 500 });
  return NextResponse.json({ ok: true }); // sucesso só depois da confirmação do banco
}
