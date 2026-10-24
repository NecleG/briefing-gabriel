import Link from "next/link";
export default function Intro() {
  return (<main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
    <h1 className="font-serif text-4xl leading-tight sm:text-5xl">Vamos conhecer melhor o seu negócio?</h1>
    <p className="mt-5 max-w-xl text-lg text-warm">Suas respostas me ajudam a desenvolver uma estratégia de marketing digital personalizada para a sua marca.</p>
    <p className="mt-6 text-cream/90">São <strong className="text-bronze">25 perguntas</strong> em 6 etapas. Leva aproximadamente <strong className="text-bronze">5 a 10 minutos</strong>.</p>
    <Link href="/briefing/novo" className="btn mt-10">Começar briefing</Link>
    <p className="mt-10 text-xs text-warm">Usamos suas respostas apenas para elaborar a proposta de marketing. Veja a <Link href="/privacidade" className="underline">política de privacidade</Link>.</p>
  </main>);
}
