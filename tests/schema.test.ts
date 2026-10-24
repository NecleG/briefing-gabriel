import { describe, it, expect } from "vitest";
import { briefingSchema } from "../src/lib/schema";
import { STEPS } from "../src/lib/questions";
const ok = { submissionId: crypto.randomUUID(), companyName: "Bistrô Aurora", segment: "Restaurante", segmentOther: "", region: "", products: "Pratos", goals: ["Aumentar vendas"], challenge: "Movimento", targets: "", channels: [], idealClient: "", differentials: "Receita", competitors: "", brandPerception: [], priorities: "Almoço", avoid: "", contentStyle: [], onCamera: [], materials: [], restrictions: "", hours: "", contactChannels: [], links: { instagram: "", facebook: "", tiktok: "", google: "", website: "", whatsapp: "" }, extra: "" };
describe("briefing", () => {
  it("tem 25 perguntas em 6 etapas", () => { expect(STEPS.length).toBe(6); expect(STEPS.flatMap((s) => s.fields).length).toBe(25); });
  it("aceita briefing válido", () => expect(briefingSchema.safeParse(ok).success).toBe(true));
  it("exige campos obrigatórios", () => { const r = briefingSchema.safeParse({ ...ok, companyName: "", products: "" }); expect(r.success).toBe(false); });
  it("valida formato de links", () => expect(briefingSchema.safeParse({ ...ok, links: { ...ok.links, instagram: "javascript:alert(1)" } }).success).toBe(false));
  it("limita tamanho", () => expect(briefingSchema.safeParse({ ...ok, challenge: "x".repeat(2001) }).success).toBe(false));
  it("descarta honeypot preenchido", () => expect(briefingSchema.safeParse({ ...ok, website_hp: "bot" }).success).toBe(false));
});
