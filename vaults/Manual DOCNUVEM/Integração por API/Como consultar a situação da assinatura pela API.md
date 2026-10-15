# Como consultar a situação da assinatura pela API

Este guia mostra como consultar o andamento do fluxo de assinatura de um documento e o detalhe de cada signatário.

## 1. Montar o endereço da chamada

Use o método `GET` no recurso `/api/documento/{documentoId}/status`, trocando `{documentoId}` pelo identificador do documento. O parâmetro `instancia` é obrigatório.

## 2. Enviar a chamada

Exemplo usando `curl`:

```bash
curl "http://docnuvem-1325424578.sa-east-1.elb.amazonaws.com:8083/api/documento/48213/status?instancia=SUA_INSTANCIA" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 3. Conferir a resposta

Os principais campos da resposta são:

| Campo | Descrição |
| --- | --- |
| `documentoId` e `nomeArquivo` | Identificação do documento. |
| `assinaturaId` | Identificador da solicitação de assinatura. |
| `status` e `statusDescricao` | Situação do fluxo. |
| `dataSolicitacao`, `dataValidade` e `dataUltimaAlteracao` | Datas da solicitação. |
| `consideraOrdem` | Indica se os signatários assinam em ordem. |
| `lembretes` e `dataUltimoLembrete` | Lembretes configurados e a data do último enviado. |
| `referenciaExterna` | O identificador do seu sistema, devolvido sem alteração. |
| `conviteEnviado` | Indica se o convite foi enviado pelo Docnuvem. |
| `signatarios` | Detalhe de cada signatário. |

Valores possíveis de `status`:

| Valor | Significado |
| --- | --- |
| `pendente` | O fluxo está em andamento. |
| `assinado` | Todos os signatários assinaram. |
| `expirado` | O prazo acabou antes da assinatura. |
| `cancelado` | O fluxo foi cancelado. |
| `sem_assinatura` | O documento foi importado sem solicitação de assinatura. |

A situação `recusado` não existe hoje no Docnuvem: o signatário assina ou deixa o prazo vencer.

Cada signatário em `signatarios` traz `nome`, `email`, `telefone`, `cpf` ou `cnpj`, `ordem`, `status`, `statusDescricao`, `dataAssinatura`, `visualizou`, `dataVisualizacao` e `linkAssinatura`. O `linkAssinatura` só vem para os signatários que ainda estão pendentes.

Quando um documento é reenviado para assinatura, ele ganha um fluxo novo. A consulta devolve sempre o fluxo mais recente.

Se o documento não for encontrado ou estiver na lixeira, a API responde com erro `404`.

## Resultado esperado

Você sabe se o documento já foi assinado e quem ainda está pendente.

## Relacionados

- [[Integração por API]]
- [[Como criar uma solicitação de assinatura pela API]]
- [[Como listar documentos pela API]]
- [[Como baixar um documento pela API]]
