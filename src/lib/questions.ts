export type Field = { key: string; n: number; label: string; type: "text" | "long" | "single" | "multi" | "links"; req?: boolean; options?: string[]; hint?: string };
export const LINK_KEYS = ["instagram", "facebook", "tiktok", "google", "website", "whatsapp"] as const;
export const LINK_LABELS: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok", google: "Google Maps / Perfil da Empresa", website: "Site", whatsapp: "WhatsApp" };
export const STATUS: Record<string, string> = { novo: "Novo", em_analise: "Em análise", aguardando_cliente: "Aguardando cliente", concluido: "Concluído", arquivado: "Arquivado" };
export const STEPS: { title: string; fields: Field[] }[] = [
  { title: "Sobre o negócio", fields: [
    { n: 1, key: "companyName", label: "Qual é o nome da empresa ou marca?", type: "text", req: true },
    { n: 2, key: "segment", label: "Qual é o segmento do negócio?", type: "single", req: true, options: ["Restaurante", "Cafeteria", "Bar", "Hamburgueria", "Loja", "Serviço", "Saúde e beleza", "Turismo", "Outro"] },
    { n: 3, key: "region", label: "Qual é o endereço ou a região de atuação da empresa?", type: "text", hint: "Cidade, bairro, endereço ou área atendida." },
    { n: 4, key: "products", label: "Quais são os principais produtos ou serviços oferecidos?", type: "long", req: true } ] },
  { title: "Objetivos e momento atual", fields: [
    { n: 5, key: "goals", label: "Qual é o principal objetivo com o marketing digital neste momento?", type: "multi", req: true, options: ["Atrair novos clientes", "Aumentar vendas", "Fortalecer a marca", "Aumentar movimento no estabelecimento", "Divulgar produtos ou serviços", "Aumentar pedidos pelo WhatsApp", "Aumentar reservas", "Divulgar eventos", "Crescer nas redes sociais", "Outro"] },
    { n: 6, key: "challenge", label: "Qual é o maior desafio do negócio atualmente?", type: "long", req: true },
    { n: 7, key: "targets", label: "Existe alguma meta ou resultado específico que você gostaria de alcançar nos próximos meses?", type: "long" },
    { n: 8, key: "channels", label: "Quais canais digitais a empresa utiliza atualmente?", type: "multi", options: ["Instagram", "Facebook", "TikTok", "Google", "WhatsApp", "Site próprio", "Outros", "Nenhum"] } ] },
  { title: "Público e diferenciais", fields: [
    { n: 9, key: "idealClient", label: "Quem é o cliente ideal da empresa?", type: "long", hint: "Perfil, faixa etária, localização, interesses e hábitos." },
    { n: 10, key: "differentials", label: "O que diferencia a empresa dos concorrentes?", type: "long", req: true },
    { n: 11, key: "competitors", label: "Quais são os principais concorrentes ou referências do mercado?", type: "long", hint: "Nomes e links de perfis." },
    { n: 12, key: "brandPerception", label: "Como você gostaria que as pessoas percebessem a marca?", type: "multi", options: ["Sofisticada", "Acessível", "Acolhedora", "Moderna", "Divertida", "Tradicional", "Premium", "Familiar", "Criativa", "Outra"] } ] },
  { title: "Conteúdo e comunicação", fields: [
    { n: 13, key: "priorities", label: "Quais produtos, serviços ou assuntos devemos priorizar nos conteúdos?", type: "long", req: true },
    { n: 14, key: "avoid", label: "Existe algum produto, serviço ou assunto que não deve ser divulgado?", type: "long" },
    { n: 15, key: "contentStyle", label: "Que estilo de conteúdo combina mais com a empresa?", type: "multi", options: ["Bastidores", "Vídeos de produtos", "Depoimentos", "Dicas", "Conteúdos educativos", "Tendências", "Humor", "Ofertas", "Histórias da marca", "Apresentação da equipe", "Eventos", "Outros"] },
    { n: 16, key: "onCamera", label: "Quem poderá aparecer nos vídeos e nas fotos?", type: "multi", options: ["Proprietário", "Funcionários", "Clientes autorizados", "Influenciadores", "Ninguém", "Ainda não definido", "Outros"] },
    { n: 17, key: "materials", label: "A empresa já possui fotos, vídeos, materiais gráficos ou identidade visual definidos?", type: "multi", options: ["Fotos profissionais", "Vídeos próprios", "Logotipo", "Identidade visual", "Banco de imagens", "Nenhum material", "Outros"] },
    { n: 18, key: "restrictions", label: "Há alguma restrição de linguagem, imagem, tema ou comunicação que devemos respeitar?", type: "long" } ] },
  { title: "Rotina, atendimento e presença digital", fields: [
    { n: 19, key: "hours", label: "Quais são os dias e horários de funcionamento?", type: "text" },
    { n: 20, key: "contactChannels", label: "Quais são os canais preferenciais para receber clientes ou pedidos?", type: "multi", options: ["WhatsApp", "Telefone", "Direct do Instagram", "Reservas", "Site", "Atendimento presencial", "Aplicativo de entrega", "Outros"] },
    { n: 21, key: "links", label: "Quais são os links dos perfis e canais digitais existentes?", type: "links" },
    { n: 22, key: "googleProfile", label: "A empresa já possui um Perfil da Empresa no Google configurado?", type: "single", options: ["Sim, e está atualizado", "Sim, mas precisa de melhorias", "Não", "Não sei"] } ] },
  { title: "Site e alinhamento final", fields: [
    { n: 23, key: "hasWebsite", label: "A empresa possui site próprio?", type: "single", options: ["Sim, e está atualizado", "Sim, mas precisa de melhorias", "Não possui"] },
    { n: 24, key: "websitePurpose", label: "Se criarmos ou melhorarmos um site, qual seria a principal finalidade?", type: "multi", options: ["Apresentar a empresa", "Divulgar cardápio ou serviços", "Captar contatos", "Receber pedidos", "Gerar solicitações de orçamento", "Facilitar reservas", "Divulgar eventos", "Outra finalidade", "Não preciso de site neste momento"] },
    { n: 25, key: "extra", label: "Existe alguma informação importante que não perguntamos e que você gostaria de compartilhar?", type: "long" } ] },
];
export const CONTACT = [
  { key: "contactName", label: "Seu nome" },
  { key: "contactInfo", label: "WhatsApp ou e-mail para contato" },
];
