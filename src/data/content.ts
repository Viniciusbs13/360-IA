// Todo o texto do site vive aqui. Edite sem mexer nos componentes.

export const site = {
  brand: 'ELVINI',
  tagline: 'IA no dia a dia',
  product: 'Domínio IA 360°',
  domain: 'elvini.com.br',
  email: 'contato@elvini.com.br', // PLACEHOLDER — trocar pelo e-mail real
  year: 2026,
  status: 'Turma aberta',
  checkoutUrl: 'https://pay.cakto.com.br/4nr7szd_1198338',
  whatsapp: '', // opcional: https://wa.me/55...
  price: { from: '197', now: '47', installments: 'pagamento único · ou parcele em até 12x no cartão' },
  guaranteeDays: 7,
};

export const loader = {
  title: ['ELVINI', 'Domínio IA 360°'],
  enter: 'Entrar na experiência',
  fetching: 'Carregando',
  ready: 'Pronto',
  variant: 'Variante 01',
  tag: 'Curso //',
  card: { made: 'Feito no', where: 'Brasil', n: '15+', label: 'Ferramentas' },
  lite: 'Versão leve',
};

export const nav = [
  { label: 'Início', href: '#inicio' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Método', href: '#metodo' },
  { label: 'Quem ensina', href: '#quem' },
  { label: 'Oferta', href: '#oferta' },
  { label: 'Dúvidas', href: '#faq' },
];

export const hero = {
  eyebrow: 'Inteligência artificial • Produtividade • Inovação',
  title: ['Aprenda a usar', 'IA de verdade'],
  sub: 'Do básico ao avançado. Transforme a inteligência artificial numa ferramenta pra trabalhar melhor, produzir mais e criar novas oportunidades.',
  cta: 'Quero aprender IA',
  scroll: 'Role',
};

// Frases reveladas em sequência durante o scroll (como os statements do aengel)
// Trechos entre [[ ]] recebem a cor de destaque escura (legível sobre o disco claro do buraco negro)
export const statements = [
  'Você já usa IA.',
  'Só não do [[jeito que]] funciona.',
  'O problema nunca [[foi a]] ferramenta…',
  '…foi ninguém ter [[te]] ensinado a pedir.',
  'Saber direcionar é a melhor estratégia.',
];

export const modules = [
  { n: '01', title: 'Fundamentos', sub: 'O que a IA faz (e o que ela não faz)', desc: 'Como um modelo de linguagem funciona na prática, por que ele erra e qual ferramenta usar pra cada coisa.', stack: ['ChatGPT', 'Claude', 'Gemini'], dur: 'ao vivo + ferramentas' },
  { n: '02', title: 'Prompts', sub: 'Pedidos que funcionam', desc: 'A estrutura que usamos no curso inteiro: papel, contexto, tarefa, formato, exemplos. Como iterar em vez de aceitar a primeira resposta.', stack: ['Estrutura', 'Exemplos', 'Iteração'], dur: 'ao vivo + ferramentas' },
  { n: '03', title: 'Trabalho', sub: 'IA no dia a dia do escritório', desc: 'E-mails difíceis, atas, relatórios, apresentações e planilhas. Fórmulas, resumos de PDF e organização de informação.', stack: ['E-mail', 'Relatório', 'Planilha'], dur: 'ao vivo + ferramentas' },
  { n: '04', title: 'Estudo', sub: 'Aprender qualquer coisa mais rápido', desc: 'Transforme qualquer material em explicação, flashcards, simulado e plano de estudo. Faculdade, concurso, idioma, carreira.', stack: ['Explicar', 'Simulado', 'Cronograma'], dur: 'ao vivo + ferramentas' },
  { n: '05', title: 'Conteúdo', sub: 'Texto, imagem e vídeo', desc: 'Posts, roteiros, legendas, imagens pra anúncio e capa. O processo de criar a semana inteira de conteúdo em uma tarde.', stack: ['Roteiro', 'Imagem', 'Calendário'], dur: 'ao vivo + ferramentas' },
  { n: '06', title: 'Automação', sub: 'Agentes e rotinas sem código', desc: 'A IA que responde o WhatsApp, resume o que chegou e preenche a planilha. Ferramentas visuais como n8n, sem programar.', stack: ['n8n', 'Agentes', 'WhatsApp'], dur: 'ao vivo + ferramentas' },
  { n: '07', title: 'Renda', sub: 'Ganhar dinheiro com IA', desc: 'Os serviços que pequenas empresas já pagam, como precificar, como entregar e como achar os primeiros clientes.', stack: ['Serviços', 'Preço', 'Proposta'], dur: 'ao vivo + ferramentas' },
  { n: '08', title: 'Projeto', sub: 'Seu sistema pessoal de IA', desc: 'Você monta a sua biblioteca de prompts, as suas rotinas e um fluxo automatizado de verdade pro seu trabalho ou negócio.', stack: ['Biblioteca', 'Rotinas', 'Automação'], dur: 'ao vivo + ferramentas' },
];

export const method = {
  year: '2026',
  kicker: 'O método',
  title: 'Pedir direito é o que separa quem usa IA de quem só testa IA.',
  body: 'Toda aula segue a mesma lógica: um problema real do seu dia, o pedido escrito do jeito certo, a resposta da IA, e as duas rodadas de ajuste que transformam "mais ou menos" em "pronto pra enviar". Você sai de cada aula com um exercício pra aplicar no seu próprio trabalho no mesmo dia.',
  roleTitle: 'Como funciona',
  roleBody: 'Uma aula ao vivo por mês com as novidades de IA, mais de 15 ferramentas e skills prontas pra usar, exercício no fim de cada módulo e comunidade pra dúvidas. Quando sai ferramenta nova, ela entra no curso sem custo extra.',
  stackTitle: 'Ferramentas',
  stack: ['ChatGPT', 'Claude', 'Gemini', 'n8n'],
  constraintsTitle: 'O que não é',
  constraints: 'Não é curso de programação, não é teoria sobre o futuro da IA e não depende de plano pago. Tudo roda nas versões gratuitas do ChatGPT, Claude ou Gemini. Quando um plano pago faz diferença, a gente mostra, e ele é opcional.',
  next: 'Ver os módulos',
};

export const about = {
  typed: 'Eu uso IA todo dia.',
  role: 'Quem ensina',
  body: 'Monto automações, atendimentos e campanhas com IA para negócios de verdade, todos os dias. Tudo que está no curso eu uso no meu próprio trabalho antes de ensinar. Não é teoria: é o que funciona hoje, com as ferramentas que você já tem no celular.',
  name: 'Elvini', // PLACEHOLDER — nome do instrutor
  labels: { a: 'instrutor', b: 'automação · n8n', c: 'sistema pessoal de IA', d: 'de São Paulo', e: 'atende o Brasil inteiro', f: 'ferramentas + aula ao vivo' },
};

export const includes = [
  { n: '+15', t: 'ferramentas e skills', d: 'Prontas pra você utilizar.' },
  { n: '1', t: 'aula ao vivo por mês', d: 'Com as novidades de IA.' },
  { n: '+100', t: 'prompts prontos', d: 'Biblioteca por situação.' },
  { n: '12', t: 'meses de acesso', d: 'Com todas as atualizações.' },
];

export const offer = {
  kicker: 'Inscrição',
  title: 'Domínio IA 360°. Tudo incluso.',
  list: [
    '8 módulos, do básico ao avançado',
    'Mais de 15 ferramentas e skills para você utilizar',
    'Projeto final guiado: sua automação funcionando',
    'Comunidade de alunos com resposta todo dia útil',
    'Uma aula ao vivo por mês',
    'Atualizações incluídas por 12 meses',
    'Certificado de conclusão',
  ],
  cta: 'Quero aprender IA',
  pay: 'PIX, cartão em até 12x ou boleto. Acesso imediato por e-mail após a aprovação.',
  guarantee: 'Garantia incondicional de 7 dias. Assista, aplique e, se não for pra você, peça o reembolso. Devolvemos 100%.',
};

export const faq = [
  { q: 'Preciso saber programar?', a: 'Não. O curso inteiro é em português, escrevendo para a IA como você escreveria para uma pessoa. No módulo de automação usamos ferramentas visuais, sem código.' },
  { q: 'Preciso pagar o ChatGPT ou outra IA?', a: 'Não. Tudo pode ser feito nas versões gratuitas do ChatGPT, Claude ou Gemini. Mostramos quando um plano pago faz diferença, mas ele é opcional e pago direto a essas empresas.' },
  { q: 'Serve pra quem nunca usou IA?', a: 'Sim. O módulo 1 começa do zero: o que é, como criar conta, como conversar. Quem já usa pode ir direto para o módulo 2.' },
  { q: 'Funciona no celular?', a: 'Sim. As aulas e as ferramentas funcionam no celular. Só o módulo de automação fica mais confortável no computador.' },
  { q: 'Como são as aulas?', a: 'Uma aula ao vivo por mês, com as novidades de IA e espaço pra dúvidas. Entre as aulas você usa as ferramentas e skills do curso no seu dia a dia.' },
  { q: 'Por quanto tempo tenho acesso?', a: '12 meses a partir da compra, com todas as atualizações que entrarem nesse período. A renovação é opcional.' },
  { q: 'Como funciona a garantia?', a: 'Você tem 7 dias corridos a partir da compra para pedir reembolso integral, por qualquer motivo. É só enviar um e-mail.' },
  { q: 'Como recebo o acesso?', a: 'Por e-mail, assim que o pagamento for aprovado. PIX e cartão liberam na hora; boleto leva até 2 dias úteis.' },
];

export const footer = {
  legal: 'Aviso legal',
  privacy: 'Privacidade',
  note: 'ChatGPT é marca da OpenAI, Claude é marca da Anthropic e Gemini é marca do Google. O curso ELVINI é independente e não tem ligação com essas empresas.',
};
