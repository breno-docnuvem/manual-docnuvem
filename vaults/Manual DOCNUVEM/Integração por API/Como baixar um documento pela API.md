# Como baixar um documento pela API

Este guia mostra como gerar o link para baixar um documento. Depois de assinado, o arquivo baixado é o PDF assinado.

## 1. Montar o endereço da chamada

Use o método `GET` no recurso `/api/documento/{documentoId}/download`, trocando `{documentoId}` pelo identificador do documento, devolvido na importação ou na listagem de documentos. O parâmetro `instancia` é obrigatório.

## 2. Enviar a chamada

Exemplo usando `curl`:

```bash
curl "https://URL_DA_API/api/documento/48213/download?instancia=SUA_INSTANCIA" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 3. Conferir a resposta

| Campo | Descrição |
| --- | --- |
| `documentoId`, `nomeArquivo`, `extensao`, `contentType`, `tamanho` | Dados do arquivo. |
| `urlDownload` | Link temporário para baixar a versão atual do documento. |
| `expiraEm` | Data e hora em que o link deixa de valer. |
| `statusAssinatura` | Situação da assinatura do documento. |
| `urlDownloadComRelatorio` | Link do documento com a página de relatório de assinatura anexada. Aparece somente em instâncias que usam o EasySign e quando o arquivo existe. |
| `relatorioAssinatura` | Dados e link do relatório de assinatura, quando ele existe também como documento separado na instância. |

> **Importante:** o link de download vale por 15 minutos e não pode ser cancelado depois de gerado. Trate-o como uma credencial: gere o link só na hora de baixar e não o guarde nem o repasse.

## 4. Entender onde está o relatório de assinatura

O relatório de assinatura, que registra a trilha de auditoria, depende do assinador usado pela instância:

- **No assinador anterior**, o relatório vem dentro do próprio PDF assinado, como uma página final. O `urlDownload` já entrega tudo.
- **No EasySign**, são dois arquivos: o `urlDownload` traz o documento assinado, e o `urlDownloadComRelatorio` traz o mesmo documento com o relatório anexado. A presença desse segundo campo indica qual dos dois casos se aplica à instância.

Se o documento não for encontrado ou estiver na lixeira, a API responde com erro `404`.

## Resultado esperado

Você obtém um link temporário para baixar o documento, ou o PDF assinado quando o fluxo de assinatura foi concluído.

## Relacionados

- [[Integração por API]]
- [[Como listar documentos pela API]]
- [[Como consultar a situação da assinatura pela API]]
