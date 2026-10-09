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

## 2026-10-09 — Coautoria dos commits: conta brenonunesbatista

**Decisão:** commits feitos pelos chats incluem `Co-authored-by` para a conta GitHub `brenonunesbatista` (e-mail noreply do GitHub, em `CLAUDE.md`). O autor continua sendo "Claude".
**Motivo:** o Breno é o responsável pelo conteúdo e pelo push; ele aparece como colaborador no GitHub. Commits anteriores não foram reescritos.

## 2026-10-09 — Autoria dos commits: Breno autor, Claude coautor

**Decisão:** os commits dos chats usam como autor a conta GitHub `brenonunesbatista` (e-mail noreply em `CLAUDE.md`), e o Claude consta como coautor (`Co-Authored-By`). Nenhum outro coautor é adicionado.
**Motivo:** o Breno é o responsável pelo conteúdo e pelo push; o Claude assiste.
**Substitui:** a entrada anterior ("Coautoria dos commits: conta brenonunesbatista"). Vale a partir do próximo commit; os anteriores não são reescritos.

## 2026-10-09 — Placeholders de print visíveis no site provisório

**Decisão:** enquanto o site for provisório, os placeholders de print aparecem como bloco "Imagem em breve" com a instrução. Há um interruptor de build para ocultá-los; a decisão de ocultar vem ao publicar para clientes. Detalhes em `docs/CONTENT-SPEC.md`, seção 8.
**Motivo:** mostra à equipe o que ainda falta capturar; hoje são 370 placeholders em 101 notas.

## 2026-10-09 — Nota "Base de Conhecimento" descartada

**Decisão:** a nota `Base de Conhecimento` não será criada; o link e a seção "Referência complementar" saíram de `Docnuvem.md`. A nota `Significados dos ícones` ainda será escrita (hoje é rascunho em `TODO/`).

## 2026-10-09 — PDF gerado por Chromium/Playwright a partir de uma página única

**Decisão:** o PDF do manual é gerado no build pela página única `/manual-completo/` (capa, índice numerado e todos os capítulos, com `noindex` e fora da busca), impressa em A4 com Playwright/Chromium em `dist/manual-docnuvem.pdf`. Comando: `npm run build:completo` (site + PDF). Proposta do chat de código, aprovada pelo Breno.
**Motivo:** reaproveita o mesmo conteúdo, a mesma ordem e o mesmo tema do site, sem segunda cadeia de ferramentas. Dependência nova: `playwright` (dev, fixada em 1.56.1), custo zero.
**Limitação conhecida:** o índice do PDF não traz número de página (o Chromium não suporta `target-counter`); há marcadores (bookmarks) e links internos clicáveis.
**Substitui:** a escolha da ferramenta que ficou em aberto em "LaTeX abandonado; PDF gerado no build do site" e em "PDF do manual gerado a partir do Markdown".

## 2026-10-09 — Deploy por GitHub Actions + Cloudflare Pages (Direct Upload)

**Decisão:** o deploy é feito pelo workflow `.github/workflows/deploy.yml`, que constrói site + PDF e envia a pasta `dist/` ao Cloudflare Pages por Direct Upload, a cada push na `main`. O projeto no Cloudflare **não** é criado pelo "Connect to Git". Passos do Breno (conta, token, secrets): `docs/DEPLOY-CLOUDFLARE.md`. Endereço provisório: `manual-docnuvem.pages.dev`.
**Motivo:** o ambiente de build do Cloudflare Pages não tem Chromium, necessário para o PDF. GitHub Actions e Cloudflare Pages continuam gratuitos. O Wrangler roda via `npx` só no CI, sem entrar nas dependências do projeto.
**Complementa:** "Hospedagem provisória: Cloudflare Pages" (continua valendo; muda só o modo de publicar). `noindex` segue ligado até a apresentação; domínio da empresa só depois dela.

## 2026-10-09 — Identidade visual aprovada e fontes hospedadas no site

**Decisão:** identidade aprovada pelo Breno e registrada em `docs/DESIGN.md`: cores da marca `#101820`, `#196bfb`, `#ffffff` e `#f1f1f1`, modo claro e escuro, logos fornecidos por ele. Tipografia: **Plus Jakarta Sans** (títulos) e **Source Sans 3** (texto e interface). As fontes são **hospedadas no próprio site** (`public/fontes/*.woff2`, subconjuntos latin e latin-ext, licença OFL, cerca de 190 KB); site e PDF não dependem do Google Fonts em tempo de execução.
**Motivo:** o Breno reprovou a primeira fonte proposta (Figtree) e aprovou a opção B. Hospedar as fontes dá privacidade, estabilidade e PDF reproduzível, sem custo.
**Substitui:** a proposta inicial com Figtree e a orientação do briefing de design de "preferir Google Fonts". Para atualizar uma fonte, repetir o download dos subconjuntos e registrar aqui.

## 2026-10-09 — Autoria dos commits: Claude autor, Breno coautor

**Decisão:** o autor dos commits feitos pelos chats é o **Claude**, e o Breno consta como **coautor** (`Co-authored-by: brenonunesbatista <256785727+brenonunesbatista@users.noreply.github.com>`, além das linhas de atribuição do Claude). Em pasta local sem identidade de Git, usa-se `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit ...` sem alterar a configuração do Breno. Autorizado por ele; o chat de código ajustou o `CLAUDE.md`.
**Substitui:** "Autoria dos commits: Breno autor, Claude coautor" e "Coautoria dos commits: conta brenonunesbatista". Commits antigos não são reescritos.

## 2026-10-09 — Trabalho direto na `main`

**Decisão:** o trabalho passa a ficar direto na `main`, sem branches de funcionalidade por padrão. Cada push na `main` republica o site pelo GitHub Actions. Regras de push (detalhe no `CLAUDE.md`, seção Git):
- chat que roda na pasta do Breno **não** dá `git push`; o push é dele, pelo GitHub Desktop;
- sessão na nuvem, sem GitHub Desktop, pode dar `git push` direto na `main` (ou na branch de trabalho designada para a sessão), depois de `git pull` e de `npm run build:completo` passando;
- nunca `--force`, `reset --hard`, `clean -fd` nem reescrita de histórico.
**Motivo:** o Breno é a única pessoa revisando; o fluxo mais curto reduz atrito, e o site ainda é provisório (`noindex`).
**Risco aceito:** um erro entra no ar a cada push. A rede de segurança é o build verde antes do push e `git revert` quando for preciso desfazer. Rever esta decisão antes de apresentar o site ao chefe ou de liberar a indexação.
**Substitui:** a orientação anterior de trabalhar em branch com link de prévia.

