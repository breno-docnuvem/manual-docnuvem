// Configuração central do site e do carregamento do vault.
// Variáveis de ambiente sobrescrevem os valores (útil no Cloudflare Pages).

const flag = (nome, padrao) => {
  const v = process.env[nome];
  if (v === undefined || v === '') return padrao;
  return !['0', 'false', 'nao', 'não', 'off'].includes(v.toLowerCase());
};

export default {
  titulo: 'Manual Docnuvem',
  descricao: 'Manual do usuário do Docnuvem: gestão, armazenamento e assinatura de documentos.',

  // Interruptor dos placeholders de print ("[Print sugerido: ...]").
  // true: mostra uma caixa "Print a inserir" com a instrução; false: oculta.
  SHOW_PRINT_PLACEHOLDERS: flag('SHOW_PRINT_PLACEHOLDERS', true),

  // Enquanto o endereço for provisório (*.pages.dev), nada de indexação.
  NOINDEX: flag('NOINDEX', true),

  // Prefixo de URL dos links gerados (use '/' em *.pages.dev).
  base: process.env.SITE_BASE || '/',

  // Nome do PDF gerado em dist/ (botão de download do site).
  arquivoPdf: 'manual-docnuvem.pdf',

  // Vault (somente leitura).
  vault: 'vaults/Manual DOCNUVEM',
  notaRaiz: 'Docnuvem',

  // Nunca publicados, mesmo que alcançáveis por link.
  pastasExcluidas: ['TODO'],
  notasExcluidas: ['Diretrizes de escrita do manual', 'Diretrizes de geração de manuais'],

  // Seções "## Título" e blockquotes "> **Título:**" que viram avisos (asides do Starlight).
  // Tipos: note | tip | caution | danger
  avisos: {
    'pré-requisito': 'note',
    'importante': 'caution',
    'atenção': 'caution',
    'observação': 'note',
    'nota': 'note',
    'dica': 'tip',
    'resultado esperado': 'tip',
  },
};
