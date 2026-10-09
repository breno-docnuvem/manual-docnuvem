# CLAUDE.md — manual-docnuvem

Site-manual do sistema **Docnuvem** (SaaS de gestão, armazenamento e assinatura de documentos). Público final: **clientes**. Responsivo, com busca forte e **download do manual em PDF**. O conteúdo nasce em um vault do Obsidian, que fica **dentro deste repositório** em `vaults/Manual DOCNUVEM/`, e é publicado por um site estático.

Responsável pelo projeto: Breno (setor de implantação). Idioma de trabalho e de todo o conteúdo: **português do Brasil**.

## Stack e decisões

- Site: **Astro Starlight**. Hospedagem provisória: **Cloudflare Pages** (`*.pages.dev`), com `noindex` enquanto for provisório. Subdomínio da empresa só será pedido depois da apresentação ao chefe.
- PDF gerado no build a partir do mesmo Markdown (capa, índice, numeração). **LaTeX não é mais usado.**
- Publica-se apenas o que é alcançável por links a partir de `Docnuvem.md`; `TODO/` e as notas de diretrizes nunca são publicadas.
- Custo zero: não adicionar serviço, dependência ou plano pago sem aprovação do Breno.
- Decisões completas e o motivo de cada uma: `DECISIONS.md`.
- O vault já tem regras editoriais próprias (tom, estrutura das notas, prints, ordem dos módulos) em `vaults/Manual DOCNUVEM/Diretrizes de escrita do manual.md` e `Diretrizes de geração de manuais.md`. Elas continuam valendo para o conteúdo e **não são publicadas** no site.

## Antes de qualquer trabalho (obrigatório)

1. Leia `docs/COMUNICACAO-ENTRE-CHATS.md`. Ele define quem é dono de quê e como fazer handoffs.
2. Leia `DECISIONS.md` e os **3 handoffs mais recentes** em `docs/handoffs/` (ordem alfabética; o último é o mais novo). Atenda os pedidos endereçados ao seu chat.
3. Leia os contratos que afetam sua área: `docs/CONTENT-SPEC.md` (vault ↔ código) e `docs/DESIGN.md` (design ↔ código), quando já existirem.
4. Rode `git status`. Se houver alterações que não são suas, não as sobrescreva nem as inclua no seu commit.

## Regras que valem para todo chat

- **Cada chat só edita a sua área** (tabela em `docs/COMUNICACAO-ENTRE-CHATS.md`). Se precisar de mudança em outra área, escreva um pedido no seu handoff; não faça a mudança.
- O código **lê** o vault (`vaults/`), **nunca escreve** nele. Só o chat do vault edita `vaults/`.
- Não reabra decisão registrada em `DECISIONS.md`. Se achar que está errada, proponha a mudança em um handoff para o chat de planejamento.
- **Handoff é automático**: escreva e atualize o handoff sem que o Breno peça. Detalhes no documento de comunicação.
- Conteúdo interno (macros de suporte, processos de implantação) **nunca** entra no site público. Só vai para o site o que estiver marcado como publicável conforme o `CONTENT-SPEC.md`.

## Git

- O Breno faz o **push** pelo GitHub Desktop; chats rodando na pasta dele **nunca rodam `git push`**. Exceção (autorizada pelo Breno em 2026-10-09): sessão na nuvem, sem acesso ao GitHub Desktop, pode dar `git push` na branch de trabalho da sessão e também **direto na `main`** (o trabalho passa a ficar na `main`; cada push republica o site). Antes de cada push na `main`: `git pull` para integrar o que for novo, rodar `npm run build:completo` e conferir que passou. Em qualquer caso, nunca use `--force`, `reset --hard`, `clean -fd` ou reescrita de histórico.
- Faça commits pequenos e frequentes na branch atual. Adicione arquivos **por caminho** (`git add caminho/arquivo`); não use `git add -A` nem `git add .`, para não levar junto o trabalho de outro chat.
- Mensagens de commit em português, no formato `área: o que mudou` (ex.: `docs: adiciona CONTENT-SPEC inicial`). Áreas: `docs`, `design`, `site`, `pdf`, `build`, `conteudo`.
- Antes de uma operação grande ou arriscada, faça um commit de ponto de retorno.
- **Autoria (atualizada em 2026-10-09 por autorização do Breno):** o autor dos commits feitos por chats é o **Claude**, e o Breno consta como coautor. Sessões na nuvem já vêm com a identidade do Claude; em pasta local sem identidade, use `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit ...`, sem alterar a configuração dele. Commits antigos não são reescritos.
- **Coautoria:** termine toda mensagem de commit com as linhas de atribuição do Claude (`Co-Authored-By: Claude ...`) e, em linha própria, com:

  ```
  Co-authored-by: brenonunesbatista <256785727+brenonunesbatista@users.noreply.github.com>
  ```
- Inclua o handoff atualizado no mesmo commit do trabalho a que ele se refere, ou em um commit `docs: handoff ...` logo em seguida.

## Código (chat do Claude Code)

- Antes de dar uma tarefa por concluída, rode o build e confira que passou. Se houver PDF, confira que foi gerado.
- Não adicione dependências sem registrar a razão em `DECISIONS.md`.
- Não deixe segredos, tokens ou dados de cliente no repositório.
- Mensagens de erro e mudanças de comportamento relevantes vão no handoff.
