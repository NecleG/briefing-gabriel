"use client";
export default function Err({ reset }: { error: Error; reset: () => void }) {
  return <main className="mx-auto max-w-xl px-5 py-24 text-center"><h1 className="font-serif text-3xl">Algo não saiu como esperado</h1>
    <p className="mt-3 text-warm">Tente novamente em instantes.</p><button onClick={reset} className="btn mt-6">Tentar novamente</button></main>;
}
