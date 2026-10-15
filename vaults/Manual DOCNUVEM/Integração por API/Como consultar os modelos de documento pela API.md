# Como consultar os modelos de documento pela API

Este guia mostra como listar os modelos de documento cadastrados na instância e as variáveis que cada um espera. Essa consulta é o primeiro passo para [[Como gerar um documento a partir de um modelo pela API]].

Os modelos são cadastrados pela tela do Docnuvem. A API não cria nem edita modelos. Veja [[Meus modelos]].

## 1. Enviar a chamada

Use o método `GET` no recurso `/api/modelos`, com o parâmetro `instancia`. Exemplo usando `curl`:

```bash
curl "http://docnuvem-1325424578.sa-east-1.elb.amazonaws.com:8083/api/modelos?instancia=SUA_INSTANCIA" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 2. Conferir os modelos

A resposta traz a lista `modelos`, com os modelos ativos da instância. Cada modelo tem:

| Campo | Descrição |
| --- | --- |
| `id` | Identificador numérico do modelo. É diferente entre homologação e produção. |
| `codigo` | Código cadastrado no modelo. É o identificador que vale em todos os ambientes. Pode estar vazio em modelos sem código. |
| `nome` e `descricao` | Nome e descrição do modelo. |
| `geravelPorApi` | Indica se o modelo pode ser gerado por API. É `false` nos modelos que usam o editor Syncfusion. |
| `variaveis` | Variáveis que o modelo espera. |

## 3. Conferir as variáveis

Cada variável traz:

| Campo | Descrição |
| --- | --- |
| `chave` | Chave a usar no campo `variaveis` ao gerar o documento. |
| `rotulo` | Nome do campo, como aparece na tela do Docnuvem. |
| `tipo` | Tipo do campo: `TEXTO`, `TEXTO_LONGO`, `PARAGRAFO`, `DATA`, `DATA_VENCIMENTO`, `NUMERICO`, `CHECKBOX` e `SELECT`, além de outros que a API ainda não preenche. |
| `obrigatorio` | Indica se o campo é obrigatório no cadastro do modelo. |
| `aceitaPorApi` | Indica se a API sabe preencher esse tipo de campo. É `false` nos campos de endereço e de seleção múltipla. |
| `preenchidoPeloDestinatario` | Indica que o campo é preenchido depois pelo destinatário, na página pública. Esse campo não deve ser enviado. |
| `opcoes` | Valores aceitos, quando o campo é uma lista de opções. |

O identificador da variável é o marcador do modelo, e não o rótulo mostrado na tela. Por isso, use sempre a `chave` devolvida por esta consulta.

## Resultado esperado

Você sabe o código do modelo e as chaves que precisa enviar para gerar um documento.

## Relacionados

- [[Integração por API]]
- [[Como gerar um documento a partir de um modelo pela API]]
- [[Meus modelos]]
