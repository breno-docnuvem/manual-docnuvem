# Diretrizes de geração de manuais

Esta nota define como o manual do Docnuvem deve ser organizado no Obsidian para ser publicado no site e gerado em PDF.

## Estrutura no Obsidian

O manual deve ser organizado a partir da nota principal [[Docnuvem]].

A nota [[Docnuvem]] DEVE conter um sumário com os módulos da plataforma, **respeitando estritamente a ordem do menu do sistema**:
1. [[Acessando o Sistema]] / [[Dashboard]] (Página Inicial)
2. [[Meus documentos]]
3. [[Busca avançada]]
4. [[Notificações]]
5. [[Meus cadastros]]
6. [[Meus modelos]]
7. [[Tipos cadastrados]]
8. [[Relatórios]]
9. [[Módulo de Tarefas]]
10. [[Assistente IADoc]]
11. [[Auditoria]]
12. [[Lixeira]]

Cada módulo deve ter uma nota própria na raiz do manual e uma pasta com o mesmo nome para abrigar suas notas filhas.

## Notas de módulo e Curva de Aprendizado

A nota principal de cada módulo deve conter:
- Título do módulo.
- Texto curto de apresentação.
- Sumário com links internos do Obsidian para as telas e guias daquele módulo.

O sumário do módulo define a ordem em que as notas da pasta do módulo devem ser usadas na geração do PDF.

**Regra de Ordenação dos Sumários de Módulo**:
As notas de cada módulo devem ser organizadas seguindo uma **curva de aprendizado pedagógica** (do mais elementar/básico ao mais complexo e avançado):
1. Telas de acesso, navegação e visualização básica.
2. Procedimentos de gerenciamento, criação e importação.
3. Fluxos avançados (formulários, requisições, assinaturas, agendamentos recorrentes e configurações).

## Notas individuais

As notas dentro da pasta do módulo devem ser curtas e especializadas.

Cada nota deve tratar de uma tela, funcionalidade ou procedimento específico.

Exemplo:

- Uma nota para a tela de Agendamentos.
- Uma nota para criar um agendamento.
- Uma nota para editar um agendamento.
- Uma nota para excluir um agendamento.

## Publicação no site e PDF

O site e o PDF são gerados a partir do vault pelo build do repositório. O vault não guarda arquivos gerados.

- **O que é publicado:** apenas as notas alcançáveis, por links `[[...]]`, a partir de [[Docnuvem]]. Nota que não está no sumário de nenhum módulo não vai para o site nem para o PDF.
- **Nunca publicados:** a pasta `TODO` e as notas de diretrizes (esta e a [[Diretrizes de escrita do manual]]).
- **Ordem:** a ordem dos links no sumário de [[Docnuvem]] e no sumário de cada módulo define a ordem no site e no PDF.
- **Manual de um módulo:** o PDF de uma parte do manual segue o mesmo princípio, a partir da nota do módulo ou da tela desejada.
- **Links:** os links `[[Nome da nota]]` e `[[Nome da nota#Título da seção]]` viram links internos no site e no PDF.
- Não crie uma nota consolidada intermediária no Obsidian.

## Prints

Quando uma nota tiver instruções de print, essa instrução deve ser mantida como placeholder no PDF até que o print real seja adicionado.

Quando o print real existir, ele é salvo na pasta `images` do vault, no caminho indicado no placeholder, e o placeholder é trocado pelo embed da imagem.

Os placeholders de prints devem indicar o caminho sugerido do arquivo de imagem.

Formato recomendado para placeholders:

```markdown
[Print sugerido: images/<modulo>/<nota>/<numero-descricao>.png | Instrução: descrever o que deve aparecer no print.]
```

Estrutura de pastas recomendada:

```text
images/<modulo>/<nota>/<numero-descricao>.png
```

Exemplo:

```text
images/modulo-de-tarefas/como-criar-um-agendamento/01-listagem-cadastrar-novo-agendamento.png
```

Regras de nomenclatura:

- Usar letras minúsculas.
- Remover acentos.
- Trocar espaços por hífen.
- Usar numeração com dois dígitos, como `01`, `02`, `03`.
- Usar nomes curtos e descritivos.
- Usar a extensão `.png`.

## Diretriz geral

A nota [[Docnuvem]] é a fonte principal de ordem e organização do manual.

As notas dos módulos e suas pastas são a fonte principal de conteúdo.
