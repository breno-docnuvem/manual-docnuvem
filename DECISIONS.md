# DECISIONS — log de decisões

Arquivo **apenas de acréscimo**: não edite nem apague entradas antigas. Para mudar uma decisão, adicione uma nova entrada que a substitui e cite a anterior. Quem escreve: o chat de planejamento (outros chats propõem via handoff).

Formato: `## AAAA-MM-DD — Título` + **Decisão**, **Motivo**, **Substitui** (se houver).

## 2026-10-09 — Gerador do site: Astro Starlight

**Decisão:** usar Astro Starlight, lendo o conteúdo do vault do Obsidian.
**Motivo:** feito para documentação; busca embutida (Pagefind) em português, menu lateral, modo escuro e responsividade prontos; tema customizável a partir do design. Alternativas descartadas: Quartz (perfil de "jardim digital") e MkDocs Material (em modo de manutenção, até onde se sabe).

## 2026-10-09 — Hospedagem provisória: Cloudflare Pages

**Decisão:** publicar em `*.pages.dev` com `noindex`. O subdomínio `docnuvem.com.br` só será solicitado depois da apresentação ao chefe.
**Motivo:** custo zero, uso comercial permitido, domínio próprio depois sem refazer nada. Vercel Hobby descartada (termos proíbem uso comercial).

## 2026-10-09 — PDF do manual gerado a partir do Markdown

**Decisão:** gerar o PDF no build (Pandoc, Typst ou página única impressa com Chromium/Playwright — a definir pelo chat de código) e oferecer botão de download no site.
**Motivo:** o PDF não depende do site, permite capa, índice e numeração.

## 2026-10-09 — Separação cliente x interno

**Decisão:** apenas conteúdo marcado como publicável vai para o site. Material interno fica fora do site público.
**Motivo:** o endereço provisório é público para quem tiver o link.

## 2026-10-09 — Comunicação entre chats por arquivos, com handoff automático

**Decisão:** os chats se comunicam por arquivos neste repositório, cada um dono de uma área; handoffs são escritos automaticamente. Ver `docs/COMUNICACAO-ENTRE-CHATS.md`.
**Motivo:** chats não enxergam o trabalho uns dos outros; arquivos versionados evitam que um desfaça o que o outro fez.

## 2026-10-09 — Vault dentro do repositório

**Decisão:** o vault do manual fica em `vaults/Manual DOCNUVEM/` neste repositório (feito pelo Breno). O chat do vault edita só `vaults/`; os demais só leem.
**Motivo:** versiona o conteúdo junto com o site, dá ponto de retorno para edições de IA e deixa o build ler o conteúdo sem sincronização manual.
**Substitui:** a premissa anterior de vault fora do repositório.

## 2026-10-09 — PDF: fluxo LaTeX existente ainda a avaliar (em aberto)

**Situação:** o vault já documenta um fluxo de PDF em LaTeX (repositório `doc_manuals`, estilo `settings.cls`, links internos, placeholders de prints). A entrada "PDF do manual gerado a partir do Markdown" não escolheu a ferramenta. Fica em aberto: reaproveitar o LaTeX existente ou gerar o PDF no build do site. Decisão do Breno, com proposta do chat de código. Até lá, ninguém remove nem altera o fluxo existente.

## 2026-10-09 — Regra de publicação: o que é alcançável a partir de Docnuvem.md

**Decisão:** vai para o site e para o PDF somente o que for alcançável por links a partir de `vaults/Manual DOCNUVEM/Docnuvem.md`. A pasta `TODO/` e as notas de diretrizes ficam de fora. Não é necessário frontmatter nas notas.
**Motivo:** o hub já define ordem e escopo do manual; evita editar as 165 notas. O detalhe técnico vai para o `CONTENT-SPEC.md`.

## 2026-10-09 — LaTeX abandonado; PDF gerado no build do site

**Decisão:** o fluxo de PDF em LaTeX (`doc_manuals`, `settings.cls`) não será mais usado, e as menções a ele foram removidas do vault. O PDF é gerado no build do site; a ferramenta (Pandoc, Typst ou página única impressa via Chromium/Playwright) será proposta pelo chat de código.
**Substitui:** a entrada "PDF: fluxo LaTeX existente ainda a avaliar (em aberto)".

## 2026-10-09 — Histórico de trabalho migrado para os handoffs

**Decisão:** o histórico antes mantido no Google Drive (`historico-manual-docnuvem.txt`) passa a ser registrado em `docs/handoffs/`.
**Motivo:** um único lugar, versionado, lido por todos os chats.

