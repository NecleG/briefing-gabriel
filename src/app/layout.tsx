import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--f-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--f-sans" });
export const metadata: Metadata = { title: "Briefing | Gabriel Assis — Marketing Digital", description: "Conte-nos sobre o seu negócio e receba uma estratégia de marketing digital personalizada.",
  openGraph: { title: "Briefing | Gabriel Assis — Marketing Digital", type: "website", locale: "pt_BR" },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230B0B0B'/><text x='16' y='23' font-size='20' text-anchor='middle' fill='%23C9B89B' font-family='Georgia'>G</text></svg>" } };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}><body>
    <header className="mx-auto max-w-3xl px-5 pt-6"><p className="font-serif text-sm tracking-[0.2em] text-warm uppercase">Gabriel Assis — Marketing Digital</p></header>
    {children}</body></html>);
}
