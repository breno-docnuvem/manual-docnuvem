# Briefing de design — manual-docnuvem

Para o chat de **design** (Artifacts). Entrega: protótipos aprovados pelo Breno em `design/` e o contrato `docs/DESIGN.md`.

## 1. O produto

O **Docnuvem** é um SaaS brasileiro de gestão, armazenamento e assinatura de documentos (um GED). O site-manual ensina clientes a usar o sistema: documentos e diretórios, busca avançada, cadastros, modelos, tipos de documento, módulo de tarefas (Kanban), assinatura, auditoria, lixeira, dashboard e perguntas frequentes.

Hoje são cerca de 160 notas, 12 módulos e muitos guias curtos do tipo "Como criar/editar/excluir…". O manual vai crescer.

## 2. Quem usa

- **Cliente do Docnuvem** (principal): usuário de empresa, nem sempre técnico, que chega com uma tarefa na cabeça ("como peço uma assinatura?"). Acessa pelo computador, mas também por celular e tablet. Pode baixar o manual em PDF.
- **Equipe interna** (secundário): suporte e implantação consultam durante atendimento.

## 3. O problema que o design resolve

O site anterior (https://breno-docnuvem.github.io/docnuvem-base/) é difícil de navegar, os itens são difíceis de achar e a aparência é pesada. O novo precisa ser:

- **simples de usar:** achar uma resposta em poucos cliques ou uma busca;
- **agradável aos olhos, sem ser carregado:** limpo, bastante espaço em branco, poucos elementos competindo;
- **responsivo de verdade**, com o menu funcionando bem no celular;
- **coerente com a marca Docnuvem** (confiável, corporativo, direto; tom de benefício e segurança).

## 4. Antes de desenhar

Peça ao Breno: o **logo** (SVG/PNG) e as **cores e fontes da marca**. O site institucional (docnuvem.com.br) usa a metáfora de nuvem e mostra capturas do sistema; não deu para extrair as cores de lá. Se ele não tiver um guia, proponha uma paleta e avise que é proposta.

## 5. As três telas obrigatórias

Desenhe cada uma em **claro e escuro**, no **desktop e no celular** (a terceira é o próprio celular).

### 5.1 Página inicial (home)
- Título curto, **caixa de busca em destaque** (com atalho `Ctrl+K` indicado) e botão **Baixar manual (PDF)**.
- **Cartões por tarefa**, não lista de módulos: por exemplo "Primeiros passos", "Enviar documento para assinatura", "Solicitar documentos", "Configurar usuários", "Criar uma tarefa". Abaixo, a grade dos módulos na **ordem do menu do sistema**: Acessando o Sistema, Dashboard, Meus documentos, Busca avançada, Notificações, Meus modelos, Meus cadastros, Tipos cadastrados, Arquivos, Relatórios, Módulo de Tarefas, Assistente IADoc, Auditoria, Lixeira, Perguntas Frequentes.
- Módulos ainda sem conteúdo aparecem com o selo **"em breve"**.

### 5.2 Página de artigo
Use como exemplo "Como criar uma tarefa" (Módulo de Tarefas). Precisa mostrar:
- **Trilha de navegação** (breadcrumb) e **menu lateral** por módulo, com a página atual destacada e subgrupos recolhíveis (ex.: Tarefas > Como criar / editar / excluir).
- **Índice da própria página** (à direita no desktop) e botões **Anterior / Próxima**.
- Título, parágrafo de abertura, seções como `Pré-requisito` e `Resultado esperado`.
- **Passos numerados** (`1. Acessar a listagem`, `2. …`), com **nomes de botões e campos em negrito**.
- **Avisos:** Importante, Observação e Dica, cada um com um estilo próprio e discreto.
- **Figuras:** captura de tela com borda e sombra **consistentes**, e legenda em itálico abaixo ("Figura 1. …").
- **Placeholder de imagem:** bloco visível "**Imagem em breve**" com a instrução do que será mostrado (hoje há 370 placeholders; precisa ser claro sem parecer erro).
- Bloco **"Veja também"** com guias relacionados.

### 5.3 Menu no celular
- Menu em gaveta (abrir/fechar), busca acessível no topo, navegação por módulo e submódulo, alvos de toque confortáveis, e o botão de download do PDF alcançável.
- Mostrar o menu **aberto** e a página de artigo **fechada** no celular.

## 6. Componentes que o contrato precisa cobrir

Botão primário/secundário, campo de busca e resultados (com trecho encontrado), cartão de tarefa, cartão de módulo, selo "em breve", aviso (3 variantes), figura com legenda, placeholder de imagem, tabela, bloco de código, trilha de navegação, menu lateral (estados: normal, atual, aberto, recolhido), paginação anterior/próxima, rodapé, botão "Baixar PDF".

## 7. Restrições técnicas (o site é Astro Starlight)

- O tema vira variáveis CSS e componentes do Starlight; **tokens** em nomes claros (cor de destaque, superfícies, texto, bordas, raios, sombras, escala de espaçamento, escala de tipografia).
- **Modo claro e escuro** obrigatórios, com contraste legível (padrão AA).
- Fontes: preferir fontes do Google Fonts ou do sistema; sem fontes pagas (custo zero).
- Sem bibliotecas de componentes pesadas; o conteúdo é texto e capturas de tela.
- Ícones simples e consistentes (um conjunto só).

## 8. O que NÃO fazer

Nada de visual carregado (gradientes pesados, muitas cores, animações chamativas), imitação de outro produto, nem layout que dependa do conteúdo ter imagens (muitas páginas ainda não têm).

## 9. Entregas

1. Protótipos em HTML autossuficiente das três telas, em `design/` (arquivos `home.html`, `artigo.html`, `menu-celular.html` ou equivalentes).
2. `docs/DESIGN.md`: tokens (claro e escuro), tipografia, espaçamentos, descrição de cada componente e das três telas aprovadas, logo e onde ficam os arquivos.
3. Handoff em `docs/handoffs/` com decisões, o que o chat de código precisa fazer e pontos em aberto.

Itere com o Breno: apresente uma direção, ajuste, e só grave `docs/DESIGN.md` depois da aprovação dele.
