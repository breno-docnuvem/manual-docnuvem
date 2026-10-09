# Comunicação entre chats

Este projeto é tocado por vários chats do Claude. **Chats não enxergam o trabalho uns dos outros**; tudo o que um precisa saber do outro precisa estar em **arquivos neste repositório**. Este documento define quem é dono de quê e como passar o bastão sem desfazer o trabalho alheio.

Todo chat deve ler este documento antes de começar (o `CLAUDE.md` da raiz manda fazer isso).

## 1. Os chats e suas áreas

| Chat | É dono de | Entrega | Nunca edita |
|---|---|---|---|
| **Vault** (Obsidian) | Conteúdo do manual: notas, imagens, estrutura de pastas do vault | Notas no formato do `CONTENT-SPEC.md` | Código, tema, `DESIGN.md` |
| **Design** (artifacts) | Identidade visual | `docs/DESIGN.md` (tokens, telas aprovadas) e protótipos em `design/` | Conteúdo, código do site |
| **Claude Code** | Código do site: tema, configuração, build, PDF, deploy | Site funcionando e PDF gerado | Notas do vault, `DESIGN.md` |
| **Planejamento** | Decisões e contratos | `DECISIONS.md`, `docs/CONTENT-SPEC.md`, este documento, `CLAUDE.md`, briefings | Código e notas do vault |

Regras de fronteira:

- O fluxo é de **mão única**: vault → build → site; design → tokens → tema. O código lê o vault, mas nunca escreve nele.
- Se um chat precisa de uma mudança na área de outro, **ele não faz a mudança**: escreve um **pedido** no seu handoff, endereçado ao dono.
- Mudanças em `docs/CONTENT-SPEC.md` passam pelo chat de planejamento, porque afetam vault e código ao mesmo tempo.
- O vault fica fora deste repositório. O caminho dele e o que é publicável são definidos no `CONTENT-SPEC.md`. Os chats de vault e de planejamento precisam ter **esta pasta do repositório conectada** para poder gravar seus handoffs aqui.

## 2. Os arquivos que ligam os chats

| Arquivo | Para quê | Quem escreve |
|---|---|---|
| `CLAUDE.md` | Regras gerais; primeira leitura de todo chat | Planejamento |
| `DECISIONS.md` | Log só de acréscimo: data, decisão, motivo | Planejamento |
| `docs/CONTENT-SPEC.md` | Contrato vault ↔ código: pastas, propriedades das notas, padrão de artigo, callouts, imagens, o que é publicável *(a criar)* | Planejamento |
| `docs/DESIGN.md` | Contrato design ↔ código: tokens e telas aprovadas *(a criar)* | Design |
| `docs/handoffs/` | Passagens de bastão (seção 3) | Cada chat, o seu |

Arquivo que ainda não existe não bloqueia ninguém: o chat segue o que está em `DECISIONS.md` e deixa um pedido de criação no handoff.

## 3. Handoffs automáticos

**O handoff é responsabilidade do chat, não do Breno.** O chat escreve e atualiza o handoff por conta própria, sem esperar que alguém peça. O Breno não deve precisar lembrar nem pedir "faça o handoff".

### Quando escrever

Não dá para saber quando uma conversa vai acabar, então o handoff é mantido **durante** o trabalho, não só no fim:

1. **Ao começar** uma sessão de trabalho que vai alterar arquivos: crie o arquivo do handoff da sessão com o objetivo e o estado inicial.
2. **Depois de cada bloco de trabalho concluído** (uma funcionalidade, um lote de notas, uma decisão de design) e **antes de qualquer commit**: atualize o handoff.
3. **Sempre que criar uma dependência para outro chat** (pedido, mudança de contrato, arquivo novo que outro precisa ler): registre na hora.
4. **Ao perceber que a conversa está longa ou o contexto está acabando**, ou quando o Breno der sinais de encerrar ("por hoje é isso", "valeu"): feche o handoff com o estado final.

Em qualquer momento, o handoff do chat deve refletir o estado real: se a conversa parar de repente, o próximo chat consegue continuar.

### Onde e com que nome

`docs/handoffs/AAAA-MM-DD-HHMM-<chat>.md`, onde `<chat>` é `vault`, `design`, `codigo` ou `planejamento`. Um arquivo por sessão; **atualize o mesmo arquivo** durante a sessão em vez de criar vários. Os nomes ordenam por data, então o último em ordem alfabética é o mais recente. Handoffs antigos não são apagados nem editados por outros chats.

### Formato

```markdown
---
chat: vault | design | codigo | planejamento
inicio: AAAA-MM-DD HH:MM
atualizado: AAAA-MM-DD HH:MM
estado: em-andamento | concluido
---

## Resumo
Uma ou duas frases: o que esta sessão se propôs a fazer e onde parou.

## O que mudou
- `caminho/do/arquivo` — o que foi feito (um item por arquivo ou grupo de arquivos)

## Pendências
- O que ficou por fazer e por quê (inclua erros conhecidos e o último comando que falhou)

## Pedidos para outros chats
- **Para: codigo** — o que precisa ser feito, em que arquivo, e o critério de pronto
- **Para: vault** — ...

## Decisões e riscos
- Decisões tomadas (as definitivas vão para `DECISIONS.md` via planejamento) e riscos que o próximo chat deve saber

## Como retomar
Um comando ou uma instrução curta para continuar de onde parou.
```

Regras de escrita: máximo de uns 40 linhas, fatos e caminhos de arquivo em vez de narrativa, nada que dependa da conversa para ser entendido. Omita seções vazias, exceto *Resumo* e *Como retomar*.

### Como ler

No início de toda sessão, o chat lê os **3 handoffs mais recentes** de `docs/handoffs/` e procura os itens *Pedidos para outros chats* endereçados a ele. Pedido atendido é registrado no **seu próprio** handoff ("Atendido: pedido de `<arquivo>`"); o chat nunca edita o handoff de outro para marcar a baixa.

## 4. Git e convivência na mesma pasta

Os chats compartilham a mesma cópia local do repositório, então o cuidado é para não pisar uns nos outros:

- O Breno faz o `push` pelo GitHub Desktop. **Nenhum chat roda `git push`.**
- Commits pequenos e frequentes, com `git add` **por caminho**, nunca `git add -A` ou `git add .`.
- Mensagem no formato `área: o que mudou`.
- Antes de começar, `git status`: alterações que não são suas pertencem a outro chat (ou ao Breno) e ficam fora do seu commit.
- Nada de `--force`, `reset --hard`, `clean -fd` ou reescrita de histórico. Para desfazer algo, use `git revert` e explique no handoff.
- Antes de uma operação grande no vault ou no código, faça um commit de ponto de retorno.

## 5. Conflitos e dúvidas

- **Dois chats querem mexer no mesmo arquivo:** vale o dono da tabela da seção 1. O outro escreve um pedido.
- **Contrato ambíguo ou furado** (por exemplo, o `CONTENT-SPEC.md` não cobre um caso): não improvise em silêncio. Escolha a opção mais conservadora, registre a escolha no handoff e peça a revisão do contrato ao planejamento.
- **Decisão que parece errada:** não a desfaça; proponha a mudança em um handoff para o planejamento.
- **Algo que só o Breno pode decidir** (domínio, orçamento, o que é publicável, aprovação do chefe): o chat deixa a pergunta registrada em *Pendências* e pergunta ao Breno na conversa.

## 6. Abertura de chat novo

A primeira instrução de qualquer chat novo do projeto é, em essência: *"Leia `CLAUDE.md`, `docs/COMUNICACAO-ENTRE-CHATS.md`, `DECISIONS.md` e os 3 últimos handoffs. Você é o chat de `<vault|design|codigo|planejamento>`. Trabalhe só na sua área e mantenha o handoff atualizado automaticamente."*
