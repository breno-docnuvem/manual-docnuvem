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

  // Cartões "O que você quer fazer?" da home (design). `nota` = nome da nota do vault.
  cartoesHome: [
    { nome: 'Primeiros passos', desc: 'Acesse o sistema e conheça a tela inicial.', nota: 'Acessando o Sistema', icone: 'M5 21V4M5 4h12l-2 4 2 4H5' },
    { nome: 'Enviar documento para assinatura', desc: 'Peça a assinatura de quem precisa assinar.', nota: 'Como solicitar uma assinatura em um arquivo', icone: 'M3 21l3-1 12-12-2-2L4 18l-1 3zM14 6l2 2' },
    { nome: 'Solicitar documentos', desc: 'Peça arquivos a clientes e fornecedores.', nota: 'Como solicitar o envio de documentos', icone: 'M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 3h6l1-3h5' },
    { nome: 'Configurar usuários', desc: 'Cadastre pessoas e defina permissões.', nota: 'Cadastro de Usuários', icone: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' },
    { nome: 'Criar uma tarefa', desc: 'Organize o trabalho no Módulo de Tarefas.', nota: 'Como criar uma tarefa', icone: 'M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9' },
  ],
  // Ícones dos módulos na grade da home (design). Módulo sem ícone usa o genérico.
  iconesModulos: {
    'Acessando o Sistema': 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
    'Dashboard': 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
    'Meus documentos': 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5',
    'Busca avançada': 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    'Notificações': 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
    'Meus modelos': 'M8 8h12v12H8zM4 16V4h12',
    'Meus cadastros': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'Tipos cadastrados': 'M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01',
    'Arquivos': 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z',
    'Relatórios': 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    'Módulo de Tarefas': 'M3 4h6v16H3zM15 4h6v10h-6z',
    'Assistente IADoc': 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z',
    'Auditoria': 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4',
    'Lixeira': 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
    'Perguntas Frequentes': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5M12 17h.01',
  },
  iconeGenerico: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5',

  // Vault (somente leitura).
  vault: 'vaults/Manual DOCNUVEM',
  notaRaiz: 'Docnuvem',

  // Nunca publicados, mesmo que alcançáveis por link.
  pastasExcluidas: ['TODO'],
  notasExcluidas: ['Diretrizes de escrita do manual', 'Diretrizes de geração de manuais'],

  // Avisos: citações "> **Importante:** ..." viram blocos de destaque (CONTENT-SPEC, seção 5).
  // Tipos do Starlight: note | tip | caution | danger. Prefixo desconhecido fica como citação.
  avisos: {
    'importante': 'caution',
    'observação': 'note',
    'dica': 'tip',
  },
};
