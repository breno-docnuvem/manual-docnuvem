# CONTENT-SPEC — contrato entre o vault e o código

Define como o conteúdo do vault é lido e transformado em site e PDF. O chat do **vault** escreve conforme este documento; o chat de **código** lê conforme ele. Mudanças só pelo chat de planejamento (ver `docs/COMUNICACAO-ENTRE-CHATS.md`).

Regras editoriais (tom, estrutura dos textos, nomes de prints) ficam nas notas `Diretrizes de escrita do manual` e `Diretrizes de geração de manuais`, dentro do vault. Este documento cobre só a interface técnica.

## 1. Fonte

- Vault: `vaults/Manual DOCNUVEM/`. O código **só lê**; nunca escreve nele.
- Ponto de partida: `Docnuvem.md` (página inicial e raiz da navegação).
- Sem frontmatter. O build deriva os metadados (seção 7). Se algum dia surgir frontmatter, ele é ignorado.

## 2. O que é publicado

Vai para o site e para o PDF **somente o que é alcançável por links `[[...]]` a partir de `Docnuvem.md`**.

1. Comece em `Docnuvem.md` e siga os links recursivamente.
2. Ignore links dentro de blocos de código (```` ``` ````) e de código inline. As notas de diretrizes têm exemplos assim.
3. **Exclusões fixas**, mesmo que alguém crie um link para elas: a pasta `TODO/`, `Diretrizes de escrita do manual.md` e `Diretrizes de geração de manuais.md`.
4. Notas não alcançadas são ignoradas e listadas no relatório do build (seção 11).

Situação em 2026-10-09: 161 notas distintas, 157 alcançáveis. Ficam de fora as duas diretrizes e `Filtros` e `Significados dos ícones` (ambas em `TODO/`).

## 3. Links

- Formatos: `[[Nota]]`, `[[Nota#Seção]]` e `[[Nota|texto]]` (este último ainda não é usado, mas deve funcionar).
- Resolução pelo nome do arquivo sem extensão, sem diferenciar maiúsculas de minúsculas. Se houver dois arquivos com o mesmo nome, vale o que **não** está em pasta excluída (hoje: `Assistente IADoc.md` na raiz, e não o de `TODO/`).
- Link para nota inexistente ou excluída: **não quebra o build**. Vira texto simples, sem link, e entra no relatório.
- Links quebrados hoje: `[[Base de Conhecimento]]` (em `Docnuvem.md`) e `[[Significado dos ícones]]` (em duas notas de `Meus documentos`; o arquivo existente se chama `Significados dos ícones` e está em `TODO/`). Os pedidos de correção estão com o chat do vault.
- `[[Nota#Seção]]` aponta para o título correspondente; seção inexistente vira link para a nota, com aviso no relatório.

## 4. Estrutura e ordem da navegação

- **Ordem dos módulos:** a ordem dos links na seção `## Sumário` de `Docnuvem.md`.
- **Dentro de um módulo:** a ordem e a hierarquia vêm da lista da seção `## Sumário` da nota do módulo (ex.: `Módulo de Tarefas.md`). Um item recuado é filho do item acima.
- A **nota do módulo** é a página de entrada do grupo no menu. Telas como `Agendamentos` são pais dos guias `Como criar…`, `Como editar…`, `Como excluir…`.
- A seção `## Guias relacionados` (24 notas) não define ordem nem hierarquia. Vira um bloco "Veja também" no fim da página.
- Nota alcançável que não aparece em nenhum `## Sumário` é publicada no fim do módulo de onde foi descoberta, com aviso no relatório.
- Módulo sem notas filhas (hoje: Assistente IADoc, Notificações, Relatórios e Notas de atualização têm só a nota do módulo) é publicado como página simples e aparece no menu com o selo **"em breve"**. Padrão provisório: pode mudar ao apresentar o site.
- Mudar a ordem do menu é editar o sumário no vault. Nunca no código.

## 5. Padrão de artigo

- Título = primeiro `# Título` da nota, igual ao nome do arquivo. O endereço (slug) deriva do caminho, em minúsculas, sem acentos, com hífens (`meus-documentos/como-criar-documentos`).
- Procedimentos em etapas numeradas: `## 1. Título curto`, `## 2. …`.
- Seções fixas que podem aparecer: `## Pré-requisito`, `## Resultado esperado`, `## Guias relacionados`, `## Sumário`. Seguem como títulos normais; o tema pode estilizar `Pré-requisito` e `Resultado esperado`.
- **Avisos** são citações com negrito no início: `> **Importante:** …`, `> **Observação:** …`, `> **Dica:** …`. O build converte em blocos de destaque: Importante → alerta, Observação → nota, Dica → dica. Prefixo desconhecido fica como citação comum.
- Nomes de campos e botões vão em **negrito** (já é a regra editorial). O build não altera.
- Tabelas Markdown, listas e blocos de código seguem o padrão do Markdown.
- A primeira frase do primeiro parágrafo vira a descrição da página (busca e compartilhamento).

## 6. Imagens e legendas

- Arquivos em `images/<módulo>/<nota>/NN-descricao.png`, nomes em minúsculas, sem acento, com hífen e numeração de dois dígitos. Hoje: 45 imagens, todas do Módulo de Tarefas.
- Embed no padrão do Obsidian: `![[caminho]]`. Três formas existem hoje e as três devem funcionar:
  1. com o nome do vault: `![[Manual DOCNUVEM/images/…/01-x.png]]`
  2. sem ele: `![[images/…/01-x.png]]`
  3. só o nome do arquivo: `![[01-x.png]]`
- Resolução: tira o prefixo `Manual DOCNUVEM/`, tenta o caminho a partir da raiz do vault e, se falhar, procura o nome do arquivo em `images/`. Nome ambíguo ou arquivo ausente: aviso no relatório e o embed vira um placeholder (seção 8).
- **Legenda:** a linha logo abaixo do embed no formato `*Figura N. Texto.*` vira a legenda da figura. O texto da legenda também é o texto alternativo da imagem. Sem legenda, o alt vem do nome do arquivo.
- O build copia só as imagens usadas. Os arquivos originais do vault não são alterados. Otimização (tamanho, formato) é decisão do chat de código.

## 7. Metadados derivados

| Campo | Origem |
|---|---|
| Título | primeiro `#` da nota |
| Descrição | primeira frase do primeiro parágrafo |
| Módulo | nota-módulo ancestral na navegação |
| Posição no menu | ordem do `## Sumário` |
| Data de atualização | data do último commit que tocou o arquivo (opcional) |

## 8. Placeholders de print

Formato nas notas (já em uso, 370 ocorrências em 101 notas):

```markdown
[Print sugerido: images/<módulo>/<nota>/NN-descricao.png | Instrução: o que deve aparecer na imagem.]
```

Comportamento, controlado por um único interruptor de build (`SHOW_PRINT_PLACEHOLDERS`):

- **Ligado (valor atual, site provisório):** o placeholder aparece como um bloco visível, com o aviso **"Imagem em breve"** e o texto da instrução. Serve para a equipe saber o que falta.
- **Desligado (ao publicar para clientes, decisão do Breno):** o placeholder some do site e do PDF, sem deixar espaço em branco.
- Se existir um arquivo de imagem no caminho do placeholder, o build mostra a imagem no lugar do bloco e registra no relatório "placeholder com imagem disponível", para o chat do vault trocar o texto pelo embed.
- O texto dos placeholders **não** entra no índice da busca.
- O caminho do placeholder indica onde o print deve ser salvo; o código não cria essas pastas.

## 9. PDF

- Gerado no build a partir do mesmo conteúdo e da mesma ordem do site (seção 4). Ferramenta: a ser proposta pelo chat de código (LaTeX descartado).
- Conteúdo: capa, índice (do menu), numeração de páginas, links internos funcionando, legendas das figuras, avisos destacados.
- Cada módulo começa em página nova. Imagem não se separa da instrução que a antecede; evitar páginas com apenas uma imagem.
- Placeholders seguem o mesmo interruptor do site.
- Entrega: um PDF do manual completo; PDF por módulo é opcional e fica para depois.
- O site oferece o download em destaque. O arquivo gerado não é versionado em `vaults/`.

## 10. Busca e indexação

- Busca no site em português (Pagefind), só sobre o conteúdo publicado.
- Enquanto o site for provisório: `noindex` em todas as páginas.

## 11. Relatório do build

O build imprime (e salva fora do git) um relatório com:

- notas publicadas e notas ignoradas por não serem alcançáveis;
- links quebrados e seções inexistentes;
- imagens não encontradas;
- placeholders restantes (total e por módulo) e placeholders com imagem disponível;
- notas sem `# Título`, nomes duplicados e módulos "em breve".

Tudo isso é **aviso**, não erro. Quando o vault estiver limpo, o chat de código pode adicionar um modo estrito que falhe o build em links quebrados e imagens ausentes, mediante decisão registrada em `DECISIONS.md`.

## 12. Fora do escopo deste contrato

Aparência do site (ver `docs/DESIGN.md`, ainda a criar), hospedagem, domínio e escolha das ferramentas (ver `DECISIONS.md`).
