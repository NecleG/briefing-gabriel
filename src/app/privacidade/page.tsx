const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contato@seudominio.com.br";
export const metadata = { title: "Privacidade | Gabriel Assis — Marketing Digital" };
export default function Privacy() {
  return (<main className="mx-auto max-w-2xl space-y-4 px-5 py-14 text-cream/90">
    <h1 className="font-serif text-3xl">Política de privacidade</h1>
    {/* Texto-base editável: revise com um profissional jurídico (LGPD). */}
    <p>Coletamos apenas as informações enviadas no briefing, com a finalidade exclusiva de analisar seu negócio e elaborar uma proposta de marketing digital.</p>
    <p>Os dados ficam em banco de dados protegido, acessíveis somente a Gabriel Assis. Não são vendidos nem compartilhados com terceiros para outros fins.</p>
    <p>O rascunho salvo durante o preenchimento fica apenas no seu navegador e não conta como envio. Ele é apagado após o envio.</p>
    <p>Para solicitar acesso, correção ou exclusão dos seus dados, escreva para <a className="text-bronze underline" href={`mailto:${email}`}>{email}</a>.</p>
  </main>);
}
