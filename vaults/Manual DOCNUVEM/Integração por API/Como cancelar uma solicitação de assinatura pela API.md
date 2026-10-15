# Como cancelar uma solicitação de assinatura pela API

Este guia mostra como cancelar uma solicitação de assinatura, por exemplo, quando o contrato foi desistido ou o prazo estourou.

## 1. Entender o efeito do cancelamento

O cancelamento derruba o fluxo inteiro:

- A solicitação passa para `cancelado`.
- **Todos** os signatários passam a `cancelado`, inclusive quem já tinha assinado.
- Os links de assinatura deixam de funcionar.

Ele vale para solicitações em andamento e para solicitações vencidas.

> **Importante:** quando alguém já assinou, o arquivo volta à versão anterior às assinaturas, porque elas ficam dentro do PDF. O `hash` do documento é regravado, e a auditoria registra qual versão passou a valer. Nada é apagado: a versão assinada continua guardada.

## 2. Montar o endereço da chamada

Use o método `DELETE` no recurso `/api/assinatura/{assinaturaId}`, trocando `{assinaturaId}` pelo identificador da solicitação, devolvido na criação e na consulta de situação.

| Parâmetro | Obrigatório | Descrição |
| --- | --- | --- |
| `instancia` | Sim | Identificador da instância do Docnuvem. |
| `motivo` | Não | Motivo do cancelamento, registrado na solicitação e na auditoria. |

## 3. Enviar a chamada

Exemplo usando `curl`:

```bash
curl -X DELETE "https://URL_DA_API/api/assinatura/731?instancia=SUA_INSTANCIA&motivo=Contrato%20desistido" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 4. Conferir a resposta

A resposta tem o mesmo formato da consulta de situação, descrita em [[Como consultar a situação da assinatura pela API]], com a solicitação já cancelada.

Os erros possíveis são:

- `401`: token ausente ou inválido.
- `404`: solicitação não encontrada.
- `409`: a solicitação não pode ser cancelada neste estado. Isso também acontece em fluxos antigos em que não é possível identificar com segurança qual versão do arquivo restaurar, para não restaurar a versão errada. Nesse caso, cancele pela tela do Docnuvem.

## Resultado esperado

A solicitação fica como `cancelada`, e o documento fica livre para uma nova solicitação de assinatura.

## Relacionados

- [[Integração por API]]
- [[Como criar uma solicitação de assinatura pela API]]
- [[Como cancelar um fluxo de assinatura]]
