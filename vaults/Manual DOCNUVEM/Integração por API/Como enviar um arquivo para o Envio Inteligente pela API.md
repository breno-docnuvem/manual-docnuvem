# Como enviar um arquivo para o Envio Inteligente pela API

Este guia mostra como enviar um arquivo ao Docnuvem para que o Envio Inteligente trate o documento, sem escolher a pasta de destino na chamada.

## 1. Entender o que muda

Nesta importação, a chamada não informa pasta nem tipo de documento. É o próprio Envio Inteligente que classifica o documento e define a pasta depois, conforme as regras configuradas. Veja como funcionam as regras em [[Como configurar regras de Envio Inteligente]].

Por isso, a resposta não traz o `diretorioId`.

## 2. Montar o endereço da chamada

Use o método `POST` no recurso `/enviarParaEnvioInteligente`, com os parâmetros abaixo na URL:

| Parâmetro | Obrigatório | Descrição |
| --- | --- | --- |
| `instancia` | Sim | Identificador da instância do Docnuvem. |
| `nomeArquivo` | Sim | Nome do arquivo, como ele ficará no Docnuvem. |

## 3. Enviar o arquivo

Envie a chamada com o token no cabeçalho `Authorization` e o arquivo no campo `file`. Exemplo usando `curl`:

```bash
curl -X POST "http://docnuvem-1325424578.sa-east-1.elb.amazonaws.com:8083/enviarParaEnvioInteligente?instancia=SUA_INSTANCIA&nomeArquivo=nota-fiscal.pdf" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@nota-fiscal.pdf"
```

## 4. Conferir a resposta

Se o envio der certo, a resposta traz o link de visualização (`retorno`) e o `documentoId`. Em caso de erro, o código é `400` (não foi possível importar) ou `401` (token ausente ou inválido).

## Resultado esperado

O documento é recebido pelo Docnuvem e segue para o tratamento do Envio Inteligente, que o classifica e o organiza em uma pasta.

## Relacionados

- [[Integração por API]]
- [[Como importar um arquivo pela API]]
