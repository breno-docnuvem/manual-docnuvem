# Como gerar um documento a partir de um modelo pela API

Este guia mostra como preencher as variáveis de um modelo já cadastrado e arquivar o PDF resultante em uma pasta. A resposta traz o `documentoId`, que é usado em seguida para [[Como criar uma solicitação de assinatura pela API]].

## 1. Descobrir o modelo e as variáveis

Antes de gerar o documento, consulte o código do modelo e as chaves das variáveis, conforme [[Como consultar os modelos de documento pela API]].

## 2. Montar o corpo da chamada

Use o método `POST` no recurso `/api/documento/from-template`, com o parâmetro `instancia` na URL e o corpo em JSON:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `modelo` | Sim | Código do modelo, ou o identificador numérico dele. Prefira o código, porque o identificador é diferente entre homologação e produção. |
| `nomePasta` | Sim | Pasta onde o documento será arquivado. **A pasta precisa existir.** |
| `nomePastaPai` | Não | Pasta pai, quando o nome da pasta sozinho não é único. |
| `nomeArquivo` | Não | Nome do arquivo gerado. A extensão `.pdf` é opcional, porque o documento sai sempre em PDF. |
| `variaveis` | Sim, quando o modelo tem variáveis | Valores das variáveis do modelo, por chave. |
| `referenciaExterna` | Não | Identificador livre do seu sistema, devolvido sem alteração na resposta. |
| `loginSolicitante` | Não | Login do usuário do Docnuvem registrado como autor do documento. |

> **Importante:** diferente da importação de arquivos, este recurso **não cria a pasta**. Se a pasta não existir, a chamada falha. Para conferir as pastas, veja [[Como listar as pastas pela API]].

## 3. Preencher as variáveis

O campo `variaveis` é um mapa em que cada chave recebe um valor em texto:

- A chave casa com o marcador do campo ignorando acentos, pontuação e maiúsculas: `nomeCliente` casa com `[NOMECLIENTE]`.
- O valor é convertido para o tipo com que o campo foi cadastrado:
  - **Data:** formato `dd/MM/aaaa`.
  - **Numérico:** formato `1.234,56`, sem símbolo de moeda.
  - **Caixa de seleção:** `sim` ou `não`.
  - **Lista de opções:** um dos valores cadastrados.
- Toda variável do modelo precisa de um valor. Variáveis a mais no corpo da chamada são ignoradas, o que permite usar o mesmo conteúdo em modelos diferentes.
- Os campos de endereço e de seleção múltipla ainda não são preenchidos por API. Os campos marcados como preenchidos pelo destinatário não devem ser enviados.

## 4. Enviar a chamada

Exemplo usando `curl`:

```bash
curl -X POST "http://docnuvem-1325424578.sa-east-1.elb.amazonaws.com:8083/api/documento/from-template?instancia=SUA_INSTANCIA" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "modelo": "contrato_locacao_v1",
    "nomeArquivo": "Contrato_ClienteX.pdf",
    "nomePasta": "Contratos",
    "nomePastaPai": "Clientes/Cliente Exemplo",
    "referenciaExterna": "card_98765",
    "variaveis": {
      "razaoSocial": "Cliente Exemplo LTDA",
      "dataInicio": "03/09/2026"
    }
  }'
```

## 5. Conferir a resposta

Se o documento for gerado, a resposta traz:

| Campo | Descrição |
| --- | --- |
| `documentoId` | Identificador do documento gerado. |
| `nomeArquivo` | Nome do arquivo como ficou gravado. |
| `diretorioId` | Pasta em que o documento foi arquivado. |
| `referenciaExterna` | O mesmo valor enviado na chamada. |

Os erros possíveis são:

- `400`: os dados não fecham com o modelo. Quando faltam variáveis, a resposta traz a lista delas em `variaveisFaltantes`.
- `401`: token ausente ou inválido.
- `404`: o modelo ou a pasta não foram encontrados.

## Resultado esperado

O documento gerado, em PDF, é arquivado na pasta indicada e pode ser enviado para assinatura com o `documentoId` devolvido.

## Relacionados

- [[Integração por API]]
- [[Como consultar os modelos de documento pela API]]
- [[Como criar uma solicitação de assinatura pela API]]
