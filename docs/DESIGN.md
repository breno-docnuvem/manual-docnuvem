# DESIGN — contrato design ↔ código

Dono: chat de **design**. Consumidor: chat de **código** (tema do Astro Starlight). Aprovado pelo Breno em 2026-10-09 (direção v1). Protótipos em `design/` (HTML autossuficiente; abrir no navegador). Fonte dos tokens em CSS: `design/tema.css`.

> **Origem das cores:** as quatro cores da marca (`#101820`, `#196bfb`, `#ffffff`, `#f1f1f1`) foram fornecidas pelo Breno. Todas as demais (neutros derivados, avisos, tons do modo escuro) são **propostas do design**, marcadas com ◇ abaixo. Se a marca definir outras, trocar só a tabela de tokens.

## 1. Princípios

Simples de achar, limpo, com bastante espaço em branco; poucos elementos competindo; sem gradiente pesado nem animação chamativa (único gradiente: faixa sutil `surface → bg` no topo da home). Nada depende de o artigo ter imagens. Responsivo de verdade; modo claro e escuro obrigatórios, contraste AA.

## 2. Tokens

Nomes sugeridos como variáveis CSS (`--dn-*` no protótipo usa nomes curtos; prefixar como preferir). Mapeamento Starlight na seção 8.

### Cores

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#101820` | fundo da página |
| `surface` | `#F1F1F1` | `#17212C` ◇ | cartões de módulo, rodapé, hero |
| `surface2` | `#E6E8EB` ◇ | `#1F2B38` ◇ | `code`, barra da figura, linhas-esqueleto |
| `border` | `#D9DCE1` ◇ | `#2D3B4A` ◇ | bordas e divisores |
| `tx` | `#101820` | `#F1F1F1` | texto |
| `muted` | `#4E5A67` ◇ | `#A8B3BF` ◇ | texto secundário (≥4,5:1 sobre `bg`) |
| `accent` | `#196BFB` | `#196BFB` | botão primário, número do passo (fundo) |
| `accent-tx` | `#FFFFFF` | `#FFFFFF` | texto sobre `accent` (4,6:1) |
| `accent-soft` | `#E7F0FF` ◇ | `#15294B` ◇ | item atual do menu, ícone de cartão, destaque de busca |
| `link` | `#1257D1` ◇ | `#7FADFF` ◇ | links, ícones de destaque, item atual |
| Aviso **Importante** `imp-bg/bd/tx` | `#FFF4DF / #E3B14F / #5C3D00` ◇ | `#2B2210 / #B88A2E / #F2D9A0` ◇ | âmbar |
| Aviso **Observação** `obs-bg/bd/tx` | `#EEF2F8 / #8A9BB3 / #2A3A50` ◇ | `#1B2536 / #6C7F9A / #CBD6E4` ◇ | cinza-azulado |
| Aviso **Dica** `dica-bg/bd/tx` | `#E5F6F1 / #3FA58B / #0F4A3B` ◇ | `#0F2A25 / #35967D / #A8E3D2` ◇ | verde-água |

Os avisos se distinguem por ícone, rótulo em negrito **e** luminosidade, não só por matiz.

### Raios, sombra, espaçamento

- Raios: `sm 6px` (tags, kbd, itens de menu), `md 10px` (botões, avisos, figuras, campos pequenos), `lg 16px` (cartões, busca grande), `999px` (selo, número do passo).
- Sombra `shadow` (claro): `0 1px 2px rgba(20,32,46,.06), 0 6px 20px rgba(20,32,46,.07)`; (escuro): `0 1px 2px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.35)`. Usada em busca, figuras e gaveta.
- Espaçamento: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 72` px (`s1…s8`).
- Alvos de toque ≥ 44 px (botões, itens da gaveta com 48 px).

### Tipografia

Família: **Figtree** (Google Fonts, pesos 400/500/600/700), fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`. Código: `ui-monospace, SFMono-Regular, Menlo, monospace` a `.9em`. Corpo do artigo 17 px / 1,7.

| Papel | Desktop | Celular | Peso |
|---|---|---|---|
| Título da home (h1) | 44 / 1,15 | 30 | 700, `letter-spacing -.02em` |
| Título do artigo (h1) | 36 / 1,2 | 28 | 700, `-.02em` |
| Seção (h2) | 23 | 20 | 700 |
| Seção da home (h2) | 22 | 19 | 700 |
| Introdução (lead) | 19, `muted` | 16 | 400 |
| Corpo | 17 | 16 | 400 |
| Avisos | 16 | 16 | 400 (rótulo 700) |
| Legenda | 14,5 itálico `muted` | 13,5 | 400 |
| Menu lateral / TOC | 15 / 14 | 16 (gaveta) | 400, atual 650 |
| Rótulo de grupo | 12, caixa alta, `.06em` | — | 700 |

Largura de leitura do artigo: máx. **720 px**.

### Ícones

Um conjunto só: traço de 1,75 px, cantos arredondados, grade 24, `currentColor` (estilo Lucide; pode-se usar `lucide` via SVG inline, licença ISC). Tamanhos 20 px (padrão) e 16 px (pequeno). Os caminhos usados estão nos protótipos.

### Logo

`design/logos/logo_docnuvem.svg` (tinta `#101820`, para fundo claro) e `design/logos/logo_docnuvem_branca.svg` (para fundo escuro). Altura 30 px no cabeçalho desktop, 24 px no celular; ao lado, o rótulo "Manual" em `muted`, separado por filete vertical. O código copia os arquivos para o site (não referenciar `design/`).

## 3. Componentes

- **Botão primário:** fundo `accent`, texto `accent-tx`, 44 px de altura, raio `md`, peso 600. **Secundário:** transparente, texto `link`, borda `border`.
- **Busca (grande, home):** 56 px, raio `lg`, borda 1,5 px `border`, sombra; ícone lupa, placeholder em `muted`, atalho `Ctrl K` num `kbd`. **Busca pequena (cabeçalho/gaveta):** 44 px, fundo `surface`, sem sombra.
- **Resultados de busca** (`busca.html`): painel com `shadow`, itens com caminho em `muted` 13 px, título 16,5 px/650 e trecho 14,5 px com termo em `mark` (`accent-soft`, peso 600); item selecionado com fundo `accent-soft`; dica de teclado (↑ ↓ Enter Esc) abaixo.
- **Cartão de tarefa:** borda `border`, raio `lg`, padding 24; ícone em quadrado 44 px `accent-soft`; título 17/650; descrição 14,5 `muted`. No celular vira linha única (ícone, título, seta), 64 px.
- **Cartão de módulo:** linha de 64 px, fundo `surface`, borda `border`, raio `md`; ícone em quadrado 36 px (fundo `bg`); nome 15,5/600. Estado "sem conteúdo": opacidade .78 + **selo "em breve"**.
- **Selo "em breve":** pílula, 12 px/600, `muted`, borda `border`, fundo `bg`.
- **Aviso (3 variantes):** ícone + rótulo em negrito ("Importante", "Observação", "Dica") + texto; borda 1 px completa (sem faixa lateral), raio `md`, padding 16.
- **Figura:** moldura com borda `border`, raio `md`, `shadow`; legenda em itálico abaixo ("Figura N. …"). Mesma regra para todas as capturas.
- **Placeholder "Imagem em breve":** borda **tracejada** `border`, fundo `surface`, ícone de imagem, título "Imagem em breve" + a instrução do que será mostrado em `muted`. Sem vermelho e sem ícone de erro. Altura mínima ~80 px para não pesar com 370 ocorrências.
- **Passo numerado:** círculo 32 px `accent` com número + h2 do passo na mesma linha; texto e figuras abaixo. Nomes de botões/campos em **negrito**.
- **Tabela:** borda `border`, cabeçalho `surface`, rolagem horizontal em caixa no celular. **Bloco de código:** fundo `surface2`, raio `sm`, mono. *(Não aparecem nos protótipos; seguir os tokens.)*
- **Trilha de navegação:** 14 px `muted`, atual em `tx`/600, separador seta.
- **Menu lateral:** 280 px; módulo atual aberto em negrito, subgrupos recolhíveis com seta que gira 90°; **estados:** normal (`tx`), atual (`accent-soft` + `link` + 650), recolhido (`muted`, seta →), aberto (seta ↓). Recuo de 16 px com filete `border` à esquerda nos subníveis.
- **Índice da página (TOC):** 232 px à direita; filete de 2 px à esquerda, item atual com filete `accent` e texto `link`.
- **Paginação:** dois cartões (Anterior à esquerda, Próxima à direita, alinhada à direita) com rótulo `muted` e título `link`.
- **"Veja também":** grade de links com ícone de documento, 52 px de altura.
- **Rodapé:** fundo `surface`, borda superior, texto 14 `muted`, link "Baixar manual (PDF)".
- **Botão "Baixar PDF":** secundário no cabeçalho do artigo; primário na home e no rodapé da gaveta (largura total no celular).
- **Gaveta (celular):** 330 px, desliza da esquerda; escurecimento do fundo (`rgba(8,14,24,.45)`); cabeçalho com logo e fechar; busca no topo; lista com itens de 48 px; botão de PDF fixo no rodapé.

## 4. Telas aprovadas

Cada uma existe em **claro e escuro** no mesmo arquivo.

1. **Home** (`design/home.html`, `design/home-celular.html`): cabeçalho (logo + Manual, links Início / Módulos / Perguntas frequentes, alternar tema); hero centralizado "Como podemos ajudar?" com busca grande e botão **Baixar manual (PDF)**; "O que você quer fazer?" com 5 cartões (Primeiros passos, Enviar documento para assinatura, Solicitar documentos, Configurar usuários, Criar uma tarefa); "Módulos do manual" em grade de 4 colunas na ordem do menu do sistema (15 módulos), com "em breve" em Notificações, Relatórios e Assistente IADoc (os que estão vazios hoje); rodapé. Celular: hambúrguer, logo, lupa; cartões em linha única.
2. **Artigo** (`design/artigo.html`): cabeçalho com busca pequena + Baixar PDF; menu lateral | conteúdo (720 px) | TOC; trilha; h1; lead; Pré-requisito; passos 1–3; avisos; figura; placeholder; Resultado esperado; Veja também; Anterior/Próxima; rodapé. Exemplo: "Como criar uma tarefa".
3. **Menu no celular** (`design/menu-celular.html`): gaveta aberta sobre o artigo, ao lado do artigo com menu fechado (trilha, h1, lead, "Nesta página" recolhível, passo 1 com figura).
4. **Busca** (`design/busca.html`): resultados com trecho e termo destacado.

### 4.1 Conformidade da home e do cabeçalho (revisão 2026-10-09, após ver o site publicado)

O site no ar saiu diferente do protótipo em três pontos. O protótipo (`design/home.html`) é a referência:

1. **Hero em faixa de largura total.** A faixa do título + busca + botão PDF vai de borda a borda da janela (sob o cabeçalho), com degradê vertical de `surface` (topo) para `bg` (base), de modo que **não aparece borda nem retângulo**: ela se dissolve no fundo da página. No site ela está confinada à largura da coluna de conteúdo e aparece como um painel retangular mais claro que o fundo. O conteúdo interno continua centralizado (títulos e busca com máx. 640 px; seções abaixo com máx. 1120 px).
2. **Fundo uniforme.** Cabeçalho, página e áreas laterais usam o **mesmo `bg`**; o cabeçalho se separa só por uma borda inferior de 1 px `border`, sem fundo mais claro. No site o cabeçalho e o painel aparecem num tom mais claro que o resto da página (escuro: `#17212C` contra `#101820`).
3. **Cabeçalho da home.** No protótipo da home o cabeçalho é: logo + "Manual", links *Início · Módulos · Perguntas frequentes* e o alternador de tema (ícone de lua/sol). A busca fica só no hero. Nas páginas de artigo o cabeçalho é: logo + "Manual", **busca pequena** (44 px, fundo `surface`), botão secundário **Baixar PDF** e o alternador de tema. Aceita-se usar o cabeçalho nativo do Starlight (busca + Baixar PDF + seletor de tema) **nas duas** desde que, na home, a busca do cabeçalho fique oculta (já existe a busca grande no hero) e o seletor de tema seja só o ícone, sem rótulo "Auto/Escuro".

Medidas da home para conferir: hero com padding vertical 72/48 px; título 44 px; seção "O que você quer fazer?" com 5 cartões em uma linha (≥1120 px de largura); módulos em 4 colunas.

Os blocos "Pré-requisito", "Resultado esperado", Importante, Dica e Observação no exemplo são **ilustrativos** (a nota atual do vault não os tem). As capturas nos protótipos são desenhos de exemplo, não prints reais.

## 5. Responsividade

Quebra desenhada em ~**1024 px** (o Starlight usa 50rem para a gaveta e 72rem para o TOC; aceitar os valores dele): abaixo dela o menu lateral vira gaveta, o TOC some do lado e passa a ser "Nesta página" recolhível no topo do artigo, o cabeçalho mostra hambúrguer / logo / lupa. Grades: tarefas 5 → 2 → 1 coluna; módulos 4 → 2 → 1 (mínimo ~240 px por cartão). Padding lateral 16 px no celular.

## 6. Acessibilidade

Contraste AA (texto ≥4,5:1; `accent` com `accent-tx` 4,6:1). Foco visível em todos os controles (anel 2 px `accent`, a implementar no tema; os protótipos usam o padrão do navegador). Botões e links reais, `aria-label` nos botões só com ícone, `aria-current="page"` no item atual do menu, trilha em `nav`.

## 7. Fora do desenho (para o código decidir)

Estado de foco/hover, transições do menu, comportamento do `Ctrl K`, aparência da barra de rolagem, página 404, impressão. O PDF (capa, índice) terá design próprio, pedido em separado se o Breno quiser.

## 8. Mapeamento sugerido para o Starlight

`--sl-color-accent` = `accent`; `--sl-color-accent-high` = `link`; `--sl-color-accent-low` = `accent-soft`; `--sl-color-white` = `tx`; `--sl-color-bg` = `bg`; `--sl-color-bg-nav`/`bg-sidebar` = `bg`; `--sl-color-hairline` = `border`; `--sl-color-gray-*` a partir de `muted`/`surface`/`surface2`; `--sl-font` = Figtree; `--sl-content-width` ≈ 720 px. Avisos do Markdown (`:::note|tip|caution`) mapeiam para Observação, Dica e Importante. Os componentes da home (cartões, selo) são componentes Astro próprios.

## 9. Pontos em aberto

- Cores/logo oficiais além das quatro fornecidas (confirmar com a marca se há paleta secundária).
- Se o Breno quiser as capturas reais com moldura de navegador ou sem.
- Seletor de tema: automático (preferência do sistema) com botão manual — recomendado.
