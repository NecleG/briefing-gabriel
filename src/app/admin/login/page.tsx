import SubmitButton from "@/components/SubmitButton";
import { login } from "../actions";
export default function Login({ searchParams }: { searchParams: { erro?: string } }) {
  const msg = searchParams.erro === "autorizacao" ? "Esta conta não tem permissão de administrador." : searchParams.erro ? "E-mail ou senha incorretos." : "";
  return (<main className="mx-auto max-w-sm px-5 py-20"><h1 className="font-serif text-3xl">Área administrativa</h1>
    <form action={login} className="mt-8 space-y-4">
      <div><label htmlFor="email" className="text-sm text-warm">E-mail</label><input id="email" name="email" type="email" required autoComplete="username" className="input mt-1" /></div>
      <div><label htmlFor="password" className="text-sm text-warm">Senha</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input mt-1" /></div>
      {msg && <p role="alert" className="text-sm text-red-300">{msg}</p>}
      <SubmitButton className="btn w-full">Entrar</SubmitButton></form>
    <p className="mt-6 text-xs text-warm">Para redefinir a senha, use o painel do Supabase (Authentication &gt; Users).</p></main>);
}
