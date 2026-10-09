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
