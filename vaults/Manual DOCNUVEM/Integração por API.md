# Integração por API

A API do Docnuvem permite que outro sistema da empresa envie arquivos, gere documentos, solicite assinaturas e consulte o andamento de tudo isso automaticamente, sem passar pelas telas do Docnuvem. É indicada para integrações, por exemplo, quando um sistema gera contratos e precisa guardá-los e colher as assinaturas no Docnuvem.

Este módulo é voltado à equipe de TI. Esta nota apresenta o que é necessário para usar a API e como interpretar as respostas. Os passos de cada recurso estão nos guias do sumário.

## Pré-requisito

Antes de usar a API, a equipe de TI precisa ter em mãos:

- **O endereço da API do Docnuvem.** Nos exemplos deste manual, ele aparece como `https://URL_DA_API`.
- **O identificador da instância**, informado em todas as chamadas no parâmetro `instancia`.
- **Um token de acesso (Bearer Token)**, enviado no cabeçalho `Authorization`.

<!-- TODO: confirmar com Breno (a) o endereço da API que o cliente deve usar; (b) onde o cliente obtém o identificador da instância e o token (a aba Token, em Configurações do sistema?); (c) a API é liberada para todos os clientes ou precisa ser contratada/habilitada? O endereço de teste da API não deve aparecer no manual público. -->

> **Importante:** o token dá acesso aos documentos da instância. Guarde-o em local seguro e não o compartilhe nem o inclua em arquivos de código compartilhados.

## Como as chamadas são feitas

Em todas as chamadas, o token vai no cabeçalho `Authorization`, neste formato:

```text
Authorization: Bearer SEU_TOKEN
```

O parâmetro `instancia` é obrigatório em todas as chamadas e vai na própria URL.

- Os recursos que **enviam arquivos** usam `POST` com o corpo em `multipart/form-data`, no campo `file`.
- Os recursos que **criam documentos e solicitações** usam `POST` com o corpo em JSON.
- Os recursos de **consulta** usam `GET`, e o de **cancelamento** usa `DELETE`.

## Recursos disponíveis

| Recurso | O que faz | Guia |
| --- | --- | --- |
| `POST /importar` | Envia um arquivo para uma pasta. | [[Como importar um arquivo pela API]] |
| `POST /enviarParaEnvioInteligente` | Envia um arquivo para o Envio Inteligente. | [[Como enviar um arquivo para o Envio Inteligente pela API]] |
| `GET /api/diretorios` | Lista as pastas. | [[Como listar as pastas pela API]] |
| `GET /api/documentos` | Lista documentos, com filtros. | [[Como listar documentos pela API]] |
| `GET /api/documento/{documentoId}/download` | Gera o link para baixar um documento. | [[Como baixar um documento pela API]] |
| `GET /api/modelos` | Lista os modelos de documento e suas variáveis. | [[Como consultar os modelos de documento pela API]] |
| `POST /api/documento/from-template` | Gera um documento a partir de um modelo. | [[Como gerar um documento a partir de um modelo pela API]] |
| `POST /api/assinatura` | Cria uma solicitação de assinatura. | [[Como criar uma solicitação de assinatura pela API]] |
| `GET /api/documento/{documentoId}/status` | Consulta a situação da assinatura. | [[Como consultar a situação da assinatura pela API]] |
| `DELETE /api/assinatura/{assinaturaId}` | Cancela uma solicitação de assinatura. | [[Como cancelar uma solicitação de assinatura pela API]] |

## Respostas e erros

Quando uma chamada dá certo, a API responde com código `200` e os dados em JSON. Os campos de cada resposta estão descritos no guia do recurso.

Os códigos de erro mais comuns são:

| Código | Significado |
| --- | --- |
| `400` | Os dados enviados não são válidos. A resposta traz a mensagem do erro. |
| `401` | O token está ausente ou é inválido. |
| `404` | O documento, a pasta, o modelo ou a solicitação não foi encontrado. |
| `409` | A operação não pode ser feita no estado atual da solicitação. |

## Sumário

- [[Como importar um arquivo pela API]]
- [[Como enviar um arquivo para o Envio Inteligente pela API]]
- [[Como listar as pastas pela API]]
- [[Como listar documentos pela API]]
- [[Como baixar um documento pela API]]
- [[Como consultar os modelos de documento pela API]]
- [[Como gerar um documento a partir de um modelo pela API]]
- [[Como criar uma solicitação de assinatura pela API]]
- [[Como consultar a situação da assinatura pela API]]
- [[Como cancelar uma solicitação de assinatura pela API]]
