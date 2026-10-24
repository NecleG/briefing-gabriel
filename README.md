# Briefing — Gabriel Assis | Marketing Digital
Next.js 14 + Tailwind + Supabase (Postgres, Auth, RLS). Público: `/briefing`. Painel: `/admin`.

## Passo a passo
1. **Supabase:** crie um projeto em supabase.com.
2. **Migrations:** no SQL Editor, rode `supabase/migrations/0001_briefings.sql` (ou `supabase db push` com a CLI).
3. **Variáveis:** copie `.env.example` para `.env.local` e preencha URL e chave anon/publishable (Project Settings > API). Nunca use `service_role` aqui.
4. **Admin:** em Authentication > Users crie seu usuário (e-mail e senha). Em Authentication > Providers desative "Allow new users to sign up". No SQL Editor rode a última linha comentada da migration (`insert into public.admins ...`) com o seu e-mail.
5. **Redirecionamento:** Authentication > URL Configuration: Site URL = domínio publicado; adicione `http://localhost:3000` aos Redirect URLs.
6. **Local:** `npm install`, `npm test`, `npm run dev`.
7. **GitHub:** `git init`, commit e push (`.env*` já é ignorado).
8. **Vercel:** importe o repositório e cadastre as duas variáveis `NEXT_PUBLIC_*` + `NEXT_PUBLIC_CONTACT_EMAIL`.
9. **Domínio:** Vercel > Settings > Domains.
10. **Verificações:** envie um briefing de teste; confira no painel; atualize a página e veja que persiste.
11. **Teste de segurança (sem login):**
    `curl "$URL/rest/v1/briefings?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"` deve retornar `[]`; um `DELETE` ou `PATCH` não pode afetar nada; `/admin` e `/admin/export` devem redirecionar/negar.
12. **Backup:** use "Exportar CSV/JSON" no painel e os backups do Supabase.

## Decisões
- Rate limit em memória (`api/briefing`): troque por Upstash/Vercel KV em produção; considere Cloudflare Turnstile se houver spam.
- Recuperação de senha: feita pelo painel do Supabase.
- Texto de privacidade é base editável; revise juridicamente (LGPD).
