# Como listar documentos pela API

Este guia mostra como consultar os documentos da instância, com filtros de pasta, situação da assinatura e período.

## 1. Montar o endereço da chamada

Use o método `GET` no recurso `/api/documentos`. Somente `instancia` é obrigatório. Os demais filtros são opcionais e podem ser combinados:

| Parâmetro | Descrição |
| --- | --- |
| `instancia` | Identificador da instância do Docnuvem. |
| `diretorioId` | Restringe a lista a uma pasta. |
| `incluirSubpastas` | Com o valor `true`, inclui também as subpastas da pasta informada. O padrão é `false`. |
| `status` | Situação da assinatura: `pendente`, `assinado`, `expirado`, `cancelado` ou `sem_assinatura`. Vale sempre para a solicitação de assinatura mais recente do documento. |
| `dataInicio` | Data de envio inicial, inclusive, no formato `aaaa-mm-dd`. |
| `dataFim` | Data de envio final, inclusive, no formato `aaaa-mm-dd`. |
| `pagina` | Número da página, começando em `0`. |
| `tamanho` | Itens por página. O padrão é `50` e o máximo é `200`. |

Os documentos vêm do mais recente para o mais antigo, pela data de envio. Documentos na lixeira, ou em pastas na lixeira, não aparecem na lista.

## 2. Enviar a chamada

Exemplo usando `curl`, para listar os documentos pendentes de assinatura em agosto de 2026:

```bash
curl "http://docnuvem-1325424578.sa-east-1.elb.amazonaws.com:8083/api/documentos?instancia=SUA_INSTANCIA&status=pendente&dataInicio=2026-08-01&dataFim=2026-08-31" \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 3. Conferir a resposta

A resposta é dividida em páginas:

| Campo | Descrição |
| --- | --- |
| `total` | Quantidade total de documentos encontrados. |
| `pagina` | Número da página devolvida. |
| `tamanho` | Quantidade de itens por página. |
| `temMais` | Indica se vale pedir a próxima página. |
| `documentos` | Lista de documentos. |

Cada documento da lista traz `documentoId`, `nomeArquivo`, `extensao`, `tamanho`, `diretorioId`, `dataEnvio`, `statusAssinatura` e `referenciaExterna`.

Se algum filtro for inválido, a API responde com erro `400`.

## Resultado esperado

Você obtém os documentos que atendem aos filtros, prontos para consultar a situação da assinatura ou gerar o link de download.

## Relacionados

- [[Integração por API]]
- [[Como listar as pastas pela API]]
- [[Como consultar a situação da assinatura pela API]]
- [[Como baixar um documento pela API]]
