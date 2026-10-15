# Como listar as pastas pela API

Este guia mostra como consultar as pastas da instância e obter o identificador (`diretorioId`) e o caminho de cada uma. O caminho devolvido pode ser usado no parâmetro `nomePastaPai` da importação.

## 1. Montar o endereço da chamada

Use o método `GET` no recurso `/api/diretorios`. Somente `instancia` é obrigatório. Os demais filtros são opcionais e podem ser combinados:

| Parâmetro | Descrição |
| --- | --- |
| `instancia` | Identificador da instância do Docnuvem. |
| `diretorioPaiId` | Lista somente as subpastas imediatas desta pasta. |
| `nome` | Parte do nome da pasta, sem diferenciar maiúsculas de minúsculas. |
| `caminho` | Parte do caminho completo da pasta, sem diferenciar maiúsculas de minúsculas. `caminho=CONTRATOS` traz a pasta CONTRATOS e tudo que está abaixo dela. |
| `pagina` | Número da página, começando em `0`. |
| `tamanho` | Itens por página. O padrão é `50` e o máximo é `200`. |

As pastas que estão na lixeira não aparecem na lista. As pastas vêm em ordem de caminho.

## 2. Enviar a chamada

Exemplo usando `curl`:

```bash
curl "https://URL_DA_API/api/diretorios?instancia=SUA_INSTANCIA&nome=CONTRATOS" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 3. Conferir a resposta

A resposta é dividida em páginas:

| Campo | Descrição |
| --- | --- |
| `total` | Quantidade total de pastas encontradas. |
| `pagina` | Número da página devolvida. |
| `tamanho` | Quantidade de itens por página. |
| `temMais` | Indica se vale pedir a próxima página. |
| `diretorios` | Lista de pastas, com `diretorioId`, `nome`, `caminho` e `diretorioPaiId`. |

O `caminho` de cada pasta começa em `/Meus documentos`.

## Resultado esperado

Você obtém a lista de pastas da instância, com os identificadores que outros recursos da API pedem, como a listagem de documentos.

## Relacionados

- [[Integração por API]]
- [[Como importar um arquivo pela API]]
- [[Como listar documentos pela API]]
