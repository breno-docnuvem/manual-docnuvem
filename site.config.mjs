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

  // Modo estrito: o build FALHA em link quebrado, seção inexistente ou imagem ausente.
  // Desligado por padrão (o vault ainda tem pendências); use `npm run build:estrito` ou BUILD_ESTRITO=1.
  BUILD_ESTRITO: flag('BUILD_ESTRITO', false),

  // Prefixo de URL dos links gerados (use '/' em *.pages.dev).
  base: process.env.SITE_BASE || '/',

  // Nome do PDF gerado em dist/ (botão de download do site).
  arquivoPdf: 'manual-docnuvem.pdf',

  // Cartões "O que você quer fazer?" da home (design). `nota` = nome da nota do vault.
  cartoesHome: [
    { nome: 'Primeiros passos', desc: 'Acesse o sistema e conheça a tela inicial.', nota: 'Acessando o Sistema', icone: 'M5 21V4M5 4h12l-2 4 2 4H5' },
    { nome: 'Enviar documento para assinatura', desc: 'Peça a assinatura de quem precisa assinar.', nota: 'Como solicitar uma assinatura em um arquivo', icone: 'assinar' },
    { nome: 'Solicitar documentos', desc: 'Peça arquivos a clientes e fornecedores.', nota: 'Como solicitar o envio de documentos', icone: 'M3 13l3-8h12l3 8v6H3v-6zM3 13h5l1 3h6l1-3h5' },
    { nome: 'Configurar usuários', desc: 'Cadastre pessoas e defina permissões.', nota: 'Cadastro de Usuários', icone: 'usuarios' },
    { nome: 'Criar uma tarefa', desc: 'Organize o trabalho no Módulo de Tarefas.', nota: 'Como criar uma tarefa', icone: 'tarefas' },
  ],
  // Ícones dos módulos na grade da home: nome de um ícone da plataforma (src/assets/icones/plataforma/<nome>.svg).
  // Módulo sem ícone na plataforma usa o genérico do design.
  iconesModulos: {
    'Acessando o Sistema': 'perfil-usuario',
    'Dashboard': 'pagina-inicial',
    'Meus documentos': 'meus-documentos-and-modelos-diretorio',
    'Busca avançada': 'busca-avancada',
    'Notificações': 'modulo-notificacoes-inicial',
    'Meus modelos': 'meus-modelos',
    'Meus cadastros': 'meus-cadastros',
    'Tipos cadastrados': 'assinatura-and-tipos-cadastrados',
    'Arquivos': 'arquivos',
    'Relatórios': 'relatorios',
    'Módulo de Tarefas': 'tarefas',
    'Assistente IADoc': 'iadoc',
    'Auditoria': 'auditoria',
    'Lixeira': 'lixeira',
    'Perguntas Frequentes': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.5M12 17h.01',
  },
  iconeGenerico: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5',

  // Vault (somente leitura).
  vault: 'vaults/Manual DOCNUVEM',
  notaRaiz: 'Docnuvem',

  // Área separada do site: a documentação da API tem raiz própria (nota abaixo), menu próprio, endereço /api/
  // e fica fora do menu, da home e do PDF do manual.
  areaApi: { raiz: 'Integração por API', pasta: 'Integração por API', slug: 'api', rotulo: 'API' },

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
