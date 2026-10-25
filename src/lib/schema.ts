import { z } from "zod";
const txt = (max = 2000) => z.string().trim().max(max, `Máximo de ${max} caracteres.`);
const req = (max = 2000) => txt(max).min(1, "Campo obrigatório.");
const url = z.string().trim().max(300).refine(
  (v) => v === "" || /^(https?:\/\/)[^\s]+\.[^\s]+$/i.test(v) || /^[+\d\s()-]{8,20}$/.test(v),
  "Informe um link válido (começando com https://) ou número de WhatsApp.");
const multi = z.array(txt(100)).max(20);

export const briefingSchema = z.object({
  submissionId: z.string().uuid(),
  // Etapa 1
  companyName: req(200), segment: req(100), segmentOther: txt(100).optional(),
  region: txt(300), products: req(),
  // Etapa 2
  goals: multi.min(1, "Escolha ao menos um objetivo."), challenge: req(), targets: txt(), channels: multi,
  // Etapa 3
  idealClient: txt(), differentials: req(), competitors: txt(), brandPerception: multi,
  // Etapa 4
  priorities: req(), avoid: txt(), contentStyle: multi, onCamera: multi, materials: multi, restrictions: txt(),
  // Etapa 5
  hours: txt(300), contactChannels: multi,
  links: z.object({ instagram: url, facebook: url, tiktok: url, google: url, website: url, whatsapp: url }),
  googleProfile: txt(60).optional(),
  // Etapa 6
  hasWebsite: txt(60).optional(), websitePurpose: multi, extra: txt(),
  contactName: txt(120).optional(), contactInfo: txt(200).optional(),
  website_hp: z.string().max(0).optional(), // honeypot anti-bot
});
export type BriefingInput = z.infer<typeof briefingSchema>;
