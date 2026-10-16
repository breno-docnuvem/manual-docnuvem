# Manual Docnuvem

Site-manual do **Docnuvem** (sistema de gestão, armazenamento e assinatura de documentos), voltado aos clientes. É responsivo, tem busca (Pagefind), tema claro/escuro e **download do manual em PDF**. Também publica a documentação da **API de integração** como área separada (`/api/`).

O conteúdo é escrito em um vault do Obsidian que fica neste repositório, e o site estático é gerado a partir dele. Todo o conteúdo está em **português do Brasil**.

- Site provisório: <https://manual-docnuvem.pages.dev> (Cloudflare Pages, com `noindex` até a apresentação)
- Responsável: Breno (setor de implantação)

## Como funciona

```
vaults/Manual DOCNUVEM/   conteúdo (Markdown do Obsidian) — o build só lê, nunca escreve
        │
        ▼  scripts/prepare-content.mjs
src/content/docs/         páginas geradas      src/generated/   menus e ordem do PDF
        │
        ▼  Astro + Starlight (astro build)
dist/                     site estático + busca
        │
        ▼  scripts/gerar-pdf.mjs (Chromium via Playwright)
dist/manual-docnuvem.pdf  manual completo (capa, índice, numeração)
```

- **O que é publicado:** só o que é alcançável por links `[[...]]` a partir de `Docnuvem.md` (manual) e de `Integração por API.md` (API). A pasta `TODO/` e as notas de diretrizes nunca são publicadas.
- **Uma página por tema:** cada módulo vira uma página, e as telas e os guias dele viram seções com âncora (`/modulo/#como-criar-uma-tarefa`).
- **API separada:** `/api/` tem menu próprio (chave Manual | API no menu lateral) e fica fora da home e do PDF do manual.
- Os comentários `<!-- ... -->` do vault são anotações internas e são removidos do site.

## Requisitos

- Node.js 22 ou mais novo
- Para gerar o PDF: Chromium (o Playwright usa o do ambiente; em outra máquina, `CHROMIUM_PATH=/caminho/chrome`)

## Comandos

```bash
npm install
npm run dev              # lê o vault e abre o site local
npm run build            # site em dist/
npm run build:completo   # site + PDF
npm run build:estrito    # falha se houver link quebrado, imagem ausente ou seção inexistente
npm run prepare-content  # só gera as páginas; o relatório fica em .build/relatorio-build.md
```

Depois de qualquer mudança, rode `npm run build:completo` e confira que passou e que o PDF foi gerado (o limite do Cloudflare Pages é 25 MiB por arquivo; o PDF falha acima de 24 MiB).

## Estrutura do repositório

| Caminho | O que é |
| --- | --- |
| `vaults/Manual DOCNUVEM/` | Vault do Obsidian com o conteúdo do manual e da API |
| `scripts/prepare-content.mjs` | Lê o vault e gera páginas, menus, ordem do PDF e o relatório do build |
| `scripts/gerar-pdf.mjs` | Gera o PDF a partir da página `/manual-completo/` |
| `src/components/`, `src/styles/` | Componentes e estilos do design (tokens, fontes, impressão) |
| `src/routeData.ts` | Menu e paginação por área (manual ou API) |
| `site.config.mjs` | Configurações: base, `noindex`, ícones dos módulos, área da API, avisos |
| `public/` | Favicon, fontes, `robots.txt`, `_headers` |
| `.github/workflows/deploy.yml` | Publicação automática no Cloudflare Pages a cada push na `main` |
| `docs/` | Contratos e documentos de planejamento (veja abaixo) |
| `DECISIONS.md` | Decisões do projeto e o motivo de cada uma (só acréscimo) |

## Editando o conteúdo

1. Edite as notas em `vaults/Manual DOCNUVEM/`, seguindo `Diretrizes de escrita do manual.md` e `Diretrizes de geração de manuais.md`.
2. A ordem e a hierarquia do menu vêm da seção `## Sumário` de cada nota de módulo; para mudar a ordem, edite o sumário.
3. Para um tema novo, crie a nota do módulo e adicione o link no `## Sumário` de `Docnuvem.md`.
4. Prints: `[Print sugerido: caminho | Instrução: ...]` vira um aviso "Imagem em breve" até a imagem existir; imagens ficam em `images/` e entram com `![[arquivo.png]]`.
5. Rode `npm run build:estrito` para achar links quebrados e imagens ausentes.

Mensagens de commit seguem `área: o que mudou`, e commits de conteúdo usam o prefixo `conteudo:`.

## Publicação

Cada push na `main` roda o GitHub Actions, que constrói site e PDF (em modo estrito) e envia `dist/` ao Cloudflare Pages. Configuração e limites em [`docs/DEPLOY-CLOUDFLARE.md`](docs/DEPLOY-CLOUDFLARE.md).

Enquanto o site é provisório, `noindex` fica ligado. Para liberar a indexação, use `NOINDEX=0` no build, depois de definir o domínio da empresa.

## Documentação do projeto

- [`CLAUDE.md`](CLAUDE.md): regras de trabalho do projeto (git, commits, handoffs)
- [`DECISIONS.md`](DECISIONS.md): decisões registradas
- [`docs/CONTENT-SPEC.md`](docs/CONTENT-SPEC.md): contrato entre o vault e o código
- [`docs/DESIGN.md`](docs/DESIGN.md): contrato de design
- [`docs/handoffs/`](docs/handoffs/): registro de cada sessão de trabalho

## Stack

[Astro](https://astro.build) 7 com [Starlight](https://starlight.astro.build), Pagefind (busca), Playwright/Chromium (PDF), fontes Plus Jakarta Sans e Source Sans 3 hospedadas no próprio site. Custo zero: não adicione serviço, dependência ou plano pago sem aprovação.
