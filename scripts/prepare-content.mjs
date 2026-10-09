// Lê o vault (somente leitura) e gera:
//   src/content/docs/*.md      páginas do site
//   public/imagens/**          imagens usadas pelas páginas publicadas
//   src/generated/sidebar.json menu lateral, a partir dos sumários
//   src/generated/manual.json  ordem e metadados (usado pelo PDF)
//   .build/relatorio-build.md  relatório do build (fora do git)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../site.config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VAULT = path.join(RAIZ, config.vault);
const SAIDA_DOCS = path.join(RAIZ, 'src/content/docs');
const SAIDA_IMG = path.join(RAIZ, 'public/imagens');
const SAIDA_GEN = path.join(RAIZ, 'src/generated');
const SAIDA_REL = path.join(RAIZ, '.build');

const nfc = (s) => s.normalize('NFC');
const chave = (s) => nfc(s).trim().toLowerCase();
const semAcento = (s) => nfc(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const slugify = (s) =>
  semAcento(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
// Mesma regra de âncora do Starlight (github-slugger).
const slugHeading = (s) =>
  nfc(s).toLowerCase().replace(/[^\p{L}\p{N}\p{M}_ -]/gu, '').replace(/ /g, '-');
const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inlineHtml = (s) =>
  escHtml(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

const rel = {
  excluidas: [], quebrados: new Map(), imagensAusentes: [], imagensAmbiguas: [],
  placeholders: new Map(), placeholdersComImagem: [], foraDoMenu: [], vazias: [],
  duplicadasNoMenu: [], emBreve: [], secoesInexistentes: [], colisoesSlug: [], semTitulo: [], avisosConvertidos: 0,
};
const somar = (mapa, k, n = 1) => mapa.set(k, (mapa.get(k) || 0) + n);
const empurrar = (mapa, k, v) => { if (!mapa.has(k)) mapa.set(k, []); mapa.get(k).push(v); };

// ---------- 1. Varredura do vault ----------
function varrer(dir, lista = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) varrer(p, lista);
    else lista.push(p);
  }
  return lista;
}
if (!fs.existsSync(path.join(VAULT, `${config.notaRaiz}.md`))) {
  console.error(`ERRO: nota raiz não encontrada: ${config.notaRaiz}.md em ${config.vault}`);
  process.exit(1);
}
const arquivos = varrer(VAULT);
const relVault = (p) => nfc(path.relative(VAULT, p).split(path.sep).join('/'));

const ehExcluida = (r) =>
  config.pastasExcluidas.some((d) => r.startsWith(nfc(d) + '/')) ||
  config.notasExcluidas.some((n) => r === nfc(n) + '.md');

const notas = new Map(); // chave -> { nome, rel, texto }
for (const f of arquivos.filter((f) => f.endsWith('.md'))) {
  const r = relVault(f);
  if (ehExcluida(r)) { rel.excluidas.push(r); continue; }
  const nome = path.basename(r, '.md');
  const k = chave(nome);
  if (notas.has(k)) { rel.colisoesSlug.push(`Nome de nota repetido: "${r}" e "${notas.get(k).rel}" (vale a primeira)`); continue; }
  const texto = fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  notas.set(k, { nome, rel: r, texto });
}
const imagens = arquivos
  .filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
  .map((f) => ({ rel: relVault(f), nome: path.basename(f) }));

// ---------- 2. Wikilinks ----------
const RE_WIKI = /(!?)\[\[([^\]\n]+)\]\]/g;
function parseWiki(conteudo) {
  const [alvoBruto, ...resto] = conteudo.split('|');
  const alias = resto.length ? resto.join('|').trim() : null;
  const [alvo, ...sec] = alvoBruto.split('#');
  return { alvo: alvo.trim(), secao: sec.length ? sec.join('#').trim() : null, alias };
}
// Aplica fn só ao texto fora de blocos (```) e de código inline (`).
const fora = (t, fn) => t.split(/(```[\s\S]*?```|`[^`\n]*`)/g).map((parte, i) => (i % 2 ? parte : fn(parte))).join('');
const resolverNota = (alvo) => notas.get(chave(alvo.replace(/\.md$/i, '').split('/').pop()));

// ---------- 3. Alcance a partir da raiz ----------
const raiz = notas.get(chave(config.notaRaiz));
const alcancadas = []; // ordem DFS
const vistas = new Set();
const descobertaPor = new Map(); // rel -> nota que a descobriu
function visitar(nota) {
  if (vistas.has(nota.rel)) return;
  vistas.add(nota.rel);
  alcancadas.push(nota);
  const textoSemCodigo = fora(nota.texto, (x) => x).split(/(```[\s\S]*?```|`[^`\n]*`)/g).filter((_, i) => i % 2 === 0).join('\n');
  for (const m of textoSemCodigo.matchAll(RE_WIKI)) {
    if (m[1]) continue; // embed
    const { alvo } = parseWiki(m[2]);
    if (!alvo) continue;
    const dest = resolverNota(alvo);
    if (dest) { if (!vistas.has(dest.rel)) descobertaPor.set(dest.rel, nota); visitar(dest); }
  }
}
visitar(raiz);

// ---------- 4. Slugs ----------
const slugs = new Map(); // rel -> slug
const usados = new Set(['index']);
for (const n of alcancadas) {
  if (n === raiz) { slugs.set(n.rel, 'index'); continue; }
  let s = n.rel.replace(/\.md$/, '').split('/').map(slugify).filter(Boolean).join('/') || 'pagina';
  if (usados.has(s)) { let i = 2; while (usados.has(`${s}-${i}`)) i++; rel.colisoesSlug.push(`Slug repetido "${s}" para "${n.rel}" → "${s}-${i}"`); s = `${s}-${i}`; }
  usados.add(s);
  slugs.set(n.rel, s);
}
const base = config.base.replace(/\/?$/, '/');
const slugsDeTitulos = new Map(); // rel -> Set de âncoras
const ancorasDe = (nota) => {
  if (!slugsDeTitulos.has(nota.rel)) {
    const set = new Set();
    for (const l of nota.texto.split('\n')) { const m = l.match(/^#{1,6}\s+(.+?)\s*$/); if (m) set.add(slugHeading(m[1])); }
    slugsDeTitulos.set(nota.rel, set);
  }
  return slugsDeTitulos.get(nota.rel);
};
const urlDe = (nota) => (nota === raiz ? base : `${base}${slugs.get(nota.rel)}/`);

// ---------- 5. Menu a partir dos sumários ----------
function secao(texto, titulo) {
  const linhas = texto.split('\n');
  const ini = linhas.findIndex((l) => /^##\s+/.test(l) && chave(l.replace(/^##\s+/, '')) === chave(titulo));
  if (ini < 0) return null;
  let fim = linhas.length;
  for (let i = ini + 1; i < linhas.length; i++) if (/^#{1,2}\s+/.test(linhas[i])) { fim = i; break; }
  return linhas.slice(ini + 1, fim);
}
function itensSumario(nota) {
  const linhas = secao(nota.texto, 'Sumário');
  if (!linhas) return [];
  const itens = [];
  const pilha = [{ nivel: -1, filhos: itens }];
  for (const l of linhas) {
    const m = l.match(/^(\s*)[-*]\s+(.*)$/);
    if (!m) continue;
    const nivel = m[1].replace(/\t/g, '  ').length;
    const w = [...m[2].matchAll(/\[\[([^\]]+)\]\]/g)][0];
    if (!w) continue;
    const dest = resolverNota(parseWiki(w[1]).alvo);
    if (!dest) { empurrar(rel.quebrados, nota.rel, `${parseWiki(w[1]).alvo} (no sumário)`); continue; }
    const item = { nota: dest, filhos: [] };
    while (pilha[pilha.length - 1].nivel >= nivel) pilha.pop();
    pilha[pilha.length - 1].filhos.push(item);
    pilha.push({ nivel, filhos: item.filhos });
  }
  return itens;
}
const noMenu = new Map(); // rel -> vezes
function arvore(item, ancestrais) {
  somar(noMenu, item.nota.rel);
  const proprios = ancestrais.has(item.nota.rel) ? [] : itensSumario(item.nota);
  const vistosFilhos = new Set(item.filhos.map((f) => f.nota.rel));
  const todos = [...item.filhos, ...proprios.filter((p) => !vistosFilhos.has(p.nota.rel))];
  const prox = new Set([...ancestrais, item.nota.rel]);
  return { nota: item.nota, filhos: todos.filter((f) => !prox.has(f.nota.rel)).map((f) => arvore(f, prox)) };
}
const topo = itensSumario(raiz).map((i) => arvore(i, new Set([raiz.rel])));
const tituloDe = (nota) => (nota.texto.match(/^#\s+(.+)$/m)?.[1] || nota.nome).trim();
function itemSidebar(no) {
  const link = urlDe(no.nota);
  if (!no.filhos.length) return { label: tituloDe(no.nota), link };
  return {
    label: tituloDe(no.nota),
    collapsed: true,
    items: [{ label: 'Visão geral', link }, ...no.filhos.map(itemSidebar)],
  };
}
// Nota alcançável fora de qualquer sumário: vai para o fim do módulo de onde foi descoberta.
const modulos = topo;
const noDeNota = (nos, rel_) => { for (const n of nos) { if (n.nota.rel === rel_) return n; const f = noDeNota(n.filhos, rel_); if (f) return f; } return null; };
const moduloDe = (rel_) => modulos.find((m) => m.nota.rel === rel_ || noDeNota(m.filhos, rel_));
for (const n of alcancadas) {
  if (n === raiz || noMenu.has(n.rel)) continue;
  let origem = descobertaPor.get(n.rel);
  let mod = null;
  while (origem && !(mod = moduloDe(origem.rel))) origem = descobertaPor.get(origem.rel);
  if (mod) { mod.filhos.push({ nota: n, filhos: [] }); noMenu.set(n.rel, 1); rel.foraDoMenu.push(`${n.rel} (anexada ao módulo "${mod.nota.nome}")`); }
}
const sidebar = [
  { label: 'Início', link: base },
  ...topo.map((no) => {
    const item = itemSidebar(no);
    if (!no.filhos.length && /\(Aguardando cadastro de notas\)/.test(no.nota.texto)) {
      item.badge = { text: 'em breve', variant: 'caution' };
      rel.emBreve.push(no.nota.rel);
    }
    return item;
  }),
];
for (const [r, n] of noMenu) if (n > 1) rel.duplicadasNoMenu.push(`${r} (${n}x)`);
for (const n of alcancadas) if (n !== raiz && !noMenu.has(n.rel)) rel.foraDoMenu.push(`${n.rel} (sem módulo de origem)`);

// ---------- 6. Imagens ----------
const imagensUsadas = new Map(); // rel -> true
function resolverImagem(ref, nota) {
  const limpo = nfc(ref.trim()).replace(/^\/+/, '');
  const semRaiz = limpo.replace(new RegExp(`^${nfc(path.basename(VAULT)).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`), '');
  const exato = imagens.find((i) => i.rel === semRaiz);
  if (exato) return exato;
  const nome = semRaiz.split('/').pop();
  const cands = imagens.filter((i) => chave(i.nome) === chave(nome));
  if (cands.length === 1) return cands[0];
  if (cands.length > 1) {
    const pref = cands.find((i) => i.rel.split('/').slice(-2, -1)[0] === slugify(nota.nome));
    if (pref) return pref;
    rel.imagensAmbiguas.push(`${nota.rel}: "${ref}" casa com ${cands.length} arquivos; usado ${cands[0].rel}`);
    return cands[0];
  }
  return null;
}
const urlImagem = (i) =>
  base + 'imagens/' + i.rel.replace(/^images\//, '').split('/').map(encodeURIComponent).join('/');

// ---------- 7. Transformação do texto ----------
const TIPOS_ROTULO = config.avisos;
function transformar(nota) {
  let t = nota.texto;
  // remove o H1 (o título vai no frontmatter)
  t = t.replace(/^\s*#\s+.+\n/, '');

  // figuras com legenda: embed + "*Figura N. ...*"
  t = t.replace(/^!\[\[([^\]|\n]+)(?:\|[^\]\n]*)?\]\]\s*\n(?:[ \t]*\n)?\*(Figura[^\n]*?)\*[ \t]*$/gm, (_, ref, legenda) => figura(ref, legenda, nota));
  // embeds soltos
  t = t.replace(/^!\[\[([^\]|\n]+)(?:\|[^\]\n]*)?\]\][ \t]*$/gm, (_, ref) => figura(ref, null, nota));

  // placeholders de print (podem ter ou não "Instrução")
  t = t.replace(/^\[Print sugerido:\s*([^|\]\n]+?)\s*(?:\|\s*Instrução:\s*([^\]\n]*?))?\s*\]\s*$/gm, (_, caminho, instrucao) => placeholder(caminho, instrucao, nota));

  // wikilinks (fora de código)
  t = fora(t, (trecho) => trecho.replace(RE_WIKI, (inteiro, bang, conteudo) => {
    if (bang) return inteiro;
    const { alvo, secao: sec, alias } = parseWiki(conteudo);
    const texto = alias || (sec ? `${alvo} › ${sec}` : alvo);
    const dest = alvo ? resolverNota(alvo) : nota;
    if (!dest) { empurrar(rel.quebrados, nota.rel, alvo + (sec ? `#${sec}` : '')); return texto; }
    let ancora = '';
    if (sec) {
      if (ancorasDe(dest).has(slugHeading(sec))) ancora = `#${slugHeading(sec)}`;
      else rel.secoesInexistentes.push(`${nota.rel}: [[${alvo}#${sec}]]`);
    }
    return `[${texto}](${urlDe(dest)}${ancora})`;
  }));

  // avisos em blockquote: "> **Importante:** texto"
  t = t.replace(/^((?:>[^\n]*\n?)+)/gm, (bloco) => {
    const corpo = bloco.replace(/\n$/, '').split('\n').map((l) => l.replace(/^>\s?/, '')).join('\n');
    const m = corpo.match(/^\*\*([^*:]+):\*\*\s*([\s\S]*)$/);
    const tipo = m && TIPOS_ROTULO[chave(m[1])];
    if (!tipo) return bloco;
    rel.avisosConvertidos++;
    return `:::${tipo}[${m[1].trim()}]\n${m[2].trim()}\n:::\n`;
  });

  // "## 1. Título" vira passo numerado (design: círculo com o número)
  t = t.replace(/^##\s+(\d+)\.\s+(.+)$/gm, '## <span class="passo">$1</span> $2');

  // "## Guias relacionados" vira "## Veja também", no fim da página
  const linhas = t.split('\n');
  const ini = linhas.findIndex((l) => /^##\s+Guias relacionados\s*$/.test(l));
  if (ini >= 0) {
    let fim = linhas.length;
    for (let k = ini + 1; k < linhas.length; k++) if (/^#{1,2}\s+/.test(linhas[k])) { fim = k; break; }
    const bloco = linhas.splice(ini, fim - ini);
    bloco[0] = '## Veja também';
    // links viram a grade "Veja também" do design (ícone de documento + título)
    const doc = '<svg class="ic ic-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5zM14 3v5h5"></path></svg>';
    const links = bloco.slice(1).map((l) => l.match(/^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*$/)).filter(Boolean);
    const corpoVeja = links.length === bloco.slice(1).filter((l) => l.trim()).length && links.length
      ? [`<div class="dn-see">${links.map((m) => `<a href="${m[2]}">${doc}${escHtml(m[1])}</a>`).join('')}</div>`]
      : bloco.slice(1);
    linhas.push('', bloco[0], '', ...corpoVeja);
  }
  return linhas.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function figura(ref, legenda, nota) {
  const img = resolverImagem(ref, nota);
  if (!img) {
    rel.imagensAusentes.push(`${nota.rel}: ${ref}`);
    return `\n<figure class="manual-figura manual-figura--ausente"><p>Imagem indisponível</p>${legenda ? `<figcaption>${inlineHtml(legenda)}</figcaption>` : ''}</figure>\n`;
  }
  imagensUsadas.set(img.rel, true);
  const alt = legenda ? legenda.replace(/\*+/g, '') : img.nome;
  return `\n<figure class="manual-figura"><img src="${urlImagem(img)}" alt="${escHtml(alt)}" loading="lazy" />${legenda ? `<figcaption>${inlineHtml(legenda)}</figcaption>` : ''}</figure>\n`;
}

function placeholder(caminho, instrucao, nota) {
  somar(rel.placeholders, nota.rel);
  if (imagens.some((i) => i.rel === nfc(caminho.trim()))) {
    rel.placeholdersComImagem.push(`${nota.rel}: ${caminho}`);
    return figura(caminho, null, nota);
  }
  if (!config.SHOW_PRINT_PLACEHOLDERS) return '';
  return `\n<figure class="print-placeholder" data-pagefind-ignore data-print="${escHtml(caminho)}"><span class="print-placeholder__tag">Imagem em breve</span>${instrucao ? `<p>${inlineHtml(instrucao)}</p>` : ''}<figcaption>${escHtml(caminho)}</figcaption></figure>\n`;
}

function descricao(corpo) {
  for (const par of corpo.split(/\n\s*\n/)) {
    const p = par.trim();
    if (!p || /^(#|:::|<|[-*]\s|\||!)/.test(p)) continue;
    let limpo = p.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ');
    const fim = limpo.search(/[.!?](\s|$)/);
    if (fim > 0) limpo = limpo.slice(0, fim + 1);
    return limpo.length > 160 ? limpo.slice(0, 157).trimEnd() + '…' : limpo;
  }
  return config.descricao;
}

// ---------- 8. Escrita ----------
fs.rmSync(SAIDA_DOCS, { recursive: true, force: true });
fs.rmSync(SAIDA_IMG, { recursive: true, force: true });
fs.mkdirSync(SAIDA_DOCS, { recursive: true });
fs.mkdirSync(SAIDA_GEN, { recursive: true });
fs.mkdirSync(SAIDA_REL, { recursive: true });

function paginaInicial(corpo) {
  // Home do design: hero com busca + cartões por tarefa + grade de módulos; o sumário do hub sai (a grade o substitui).
  const semSumario = corpo.replace(/^## Sumário\n[\s\S]*?(?=^## |(?![\s\S]))/m, '');
  const icone = (d) => `<span class="ib"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"></path></svg></span>`;
  const cartoes = config.cartoesHome.map((c) => {
    const dest = resolverNota(c.nota);
    if (!dest || !slugs.has(dest.rel)) { rel.quebrados.set('(cartões da home)', [...(rel.quebrados.get('(cartões da home)') || []), c.nota]); return ''; }
    return `<a class="dn-card" href="${urlDe(dest)}">${icone(c.icone)}<b>${escHtml(c.nome)}</b><span class="d">${escHtml(c.desc)}</span></a>`;
  }).join('');
  const modulos = topo.map((no) => {
    const breve = !no.filhos.length && /\(Aguardando cadastro de notas\)/.test(no.nota.texto);
    const t = tituloDe(no.nota);
    return `<a class="dn-mod${breve ? ' off' : ''}" href="${urlDe(no.nota)}">${icone(config.iconesModulos[t] || config.iconeGenerico).replace('class="ib"', 'class="ib sm"')}<span>${escHtml(t)}</span>${breve ? '<span class="dn-soon">em breve</span>' : ''}</a>`;
  }).join('');
  const pdf = `${base}${config.arquivoPdf}`;
  const hero = `<div class="dn-hero"><h1>Como podemos ajudar?</h1><p>Encontre o passo a passo de qualquer função do Docnuvem.</p><div class="box"><button type="button" class="dn-search" data-abrir-busca aria-label="Buscar no manual"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"></path></svg><span class="ph">Busque por assinatura, tarefa, permissão…</span><span class="dn-kbd">Ctrl K</span></button><a class="dn-btn" href="${pdf}" download><svg class="ic ic-sm" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"></path></svg>Baixar manual (PDF)</a></div></div>`;
  return `\n${hero}\n\n<div class="dn-sec"><h2>O que você quer fazer?</h2><div class="dn-grid dn-grid--5">${cartoes}</div></div>\n\n<div class="dn-sec" id="modulos"><h2>Módulos do manual</h2><div class="dn-grid dn-grid--4">${modulos}</div></div>\n\n${semSumario}`;
}

const manual = [];
for (const nota of alcancadas) {
  let corpo = transformar(nota);
  if (nota === raiz) corpo = paginaInicial(corpo);
  const titulo = tituloDe(nota);
  if (!/^#\s+/m.test(nota.texto)) rel.semTitulo.push(nota.rel);
  const semConteudo = corpo.replace(/:::|\s/g, '') === '' ||
    /\(Aguardando cadastro de notas\)/.test(corpo);
  if (semConteudo) rel.vazias.push(nota.rel);
  const slug = slugs.get(nota.rel);
  const fm = ['---', `title: ${JSON.stringify(titulo)}`, `description: ${JSON.stringify(descricao(corpo))}`, `editUrl: false`];
  if (nota === raiz) fm.push('tableOfContents: false', 'template: splash');
  fm.push('---', '');
  const destino = path.join(SAIDA_DOCS, `${slug}.md`);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, fm.join('\n') + corpo);
  manual.push({ slug, titulo, origem: nota.rel });
}
for (const r of imagensUsadas.keys()) {
  const dest = path.join(SAIDA_IMG, r.replace(/^images\//, ''));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(VAULT, r), dest);
}
// Página 404 (o Starlight a exige; texto fixo do site, não vem do vault)
fs.writeFileSync(path.join(SAIDA_DOCS, '404.md'), `---\ntitle: "Página não encontrada"\ndescription: "Esta página não existe ou mudou de endereço."\ntemplate: splash\neditUrl: false\n---\n\nNão encontramos essa página. Ela pode ter mudado de endereço.\n\n[Voltar ao início](${base}) ou use a busca no topo da página.\n`);
const orfas = imagens.filter((i) => !imagensUsadas.has(i.rel)).map((i) => i.rel);

fs.writeFileSync(path.join(SAIDA_GEN, 'sidebar.json'), JSON.stringify(sidebar, null, 2));
// Ordem e numeração do manual (usadas pela página de impressão /manual-completo/ e pelo PDF).
const ordem = [{ slug: 'index', titulo: tituloDe(raiz), numero: '', nivel: 0 }];
(function achatar(nos, prefixo, nivel) {
  nos.forEach((n, i) => {
    const numero = prefixo ? `${prefixo}.${i + 1}` : `${i + 1}`;
    ordem.push({ slug: slugs.get(n.nota.rel), titulo: tituloDe(n.nota), numero, nivel });
    achatar(n.filhos, numero, nivel + 1);
  });
})(topo, '', 1);
fs.writeFileSync(path.join(SAIDA_GEN, 'manual.json'), JSON.stringify({
  titulo: config.titulo, base, geradoEm: new Date().toISOString(), ordem,
}, null, 2));

// ---------- 9. Relatório ----------
const lista = (arr) => (arr.length ? arr.map((x) => `- ${x}`).join('\n') : '_nenhum_');
const totalQuebrados = [...rel.quebrados.values()].reduce((a, v) => a + v.length, 0);
const totalPH = [...rel.placeholders.values()].reduce((a, v) => a + v, 0);
const relatorio = `# Relatório do build

Gerado em ${new Date().toISOString()} · SHOW_PRINT_PLACEHOLDERS=${config.SHOW_PRINT_PLACEHOLDERS} · NOINDEX=${config.NOINDEX}

## Resumo
- Notas no vault (.md): ${notas.size + rel.excluidas.length}
- Publicadas (alcançáveis a partir de ${config.notaRaiz}.md): ${alcancadas.length}
- Excluídas por regra (TODO/ e diretrizes): ${rel.excluidas.length}
- Notas do vault não alcançadas e não excluídas: ${notas.size - alcancadas.length}
- Links quebrados: ${totalQuebrados}
- Imagens: ${imagensUsadas.size} publicadas, ${rel.imagensAusentes.length} ausentes, ${orfas.length} sem uso
- Placeholders de print: ${totalPH} (em ${rel.placeholders.size} notas)
- Avisos convertidos: ${rel.avisosConvertidos}

## Links quebrados (viram texto simples)
${rel.quebrados.size ? [...rel.quebrados].map(([n, l]) => `- ${n}: ${[...new Set(l)].join(', ')}`).join('\n') : '_nenhum_'}

## Imagens referenciadas que não existem
${lista(rel.imagensAusentes)}

## Imagens ambíguas (mesmo nome em mais de uma pasta)
${lista(rel.imagensAmbiguas)}

## Imagens no vault que nenhuma página publicada usa
${lista(orfas)}

## Placeholders cuja imagem já existe no vault (trocar por embed)
${lista(rel.placeholdersComImagem)}

## Páginas vazias ou "aguardando cadastro"
${lista(rel.vazias)}

## Publicadas mas fora de qualquer sumário (anexadas ao módulo de origem)
${lista(rel.foraDoMenu)}

## Módulos "em breve" (só a nota do módulo, selo no menu)
${lista(rel.emBreve)}

## Seções "[[Nota#Seção]]" inexistentes (link vai para a nota)
${lista(rel.secoesInexistentes)}

## Notas que aparecem mais de uma vez no menu
${lista(rel.duplicadasNoMenu)}

## Notas do vault não alcançadas (não publicadas)
${lista([...notas.values()].filter((n) => !vistas.has(n.rel)).map((n) => n.rel))}

## Excluídas por regra
${lista(rel.excluidas)}

## Colisões de nome/slug
${lista(rel.colisoesSlug)}

## Notas sem título (# ...)
${lista(rel.semTitulo)}

## Placeholders por nota
${rel.placeholders.size ? [...rel.placeholders].map(([n, c]) => `- ${n}: ${c}`).join('\n') : '_nenhum_'}
`;
fs.writeFileSync(path.join(SAIDA_REL, 'relatorio-build.md'), relatorio);

console.log(
  `[vault] ${alcancadas.length} páginas publicadas · ${rel.excluidas.length} excluídas · ${totalQuebrados} links quebrados · ` +
  `${imagensUsadas.size} imagens (${rel.imagensAusentes.length} ausentes) · ${totalPH} placeholders (${config.SHOW_PRINT_PLACEHOLDERS ? 'visíveis' : 'ocultos'})`,
);
console.log('[vault] relatório: .build/relatorio-build.md');
