# Como importar um arquivo pela API

Este guia mostra como enviar um arquivo para uma pasta específica do Docnuvem usando a API.

## 1. Montar o endereço da chamada

Use o método `POST` no recurso `/importar`, informando os dados do arquivo e da pasta de destino como parâmetros na URL:

| Parâmetro | Obrigatório | Descrição |
| --- | --- | --- |
| `instancia` | Sim | Identificador da instância do Docnuvem. |
| `nomeArquivo` | Sim | Nome do arquivo, como ele ficará no Docnuvem. |
| `nomePasta` | Sim | Nome da pasta de destino. |
| `nomePastaPai` | Não | Caminho completo da pasta onde está a pasta de destino, começando em `/Meus documentos`. |
| `tipo` | Não | Tipo de documento do Docnuvem, pelo nome ou pelo identificador. |

A pasta de destino é a combinação de `nomePastaPai` e `nomePasta`. Se a pasta não existir, o Docnuvem a cria, inclusive toda a sequência de pastas do caminho.

Para descobrir os caminhos das pastas existentes, veja [[Como listar as pastas pela API]].

## 2. Informar o tipo de documento (opcional)

Se o parâmetro `tipo` for informado, o documento já entra classificado no Tipo de Documento indicado e não passa pela fila do Envio Inteligente, que serve para descobrir o tipo automaticamente.

Observações sobre o tipo:

- Se o tipo informado não existir, a API responde com erro `400`.
- Se houver mais de um tipo com o mesmo nome, informe o identificador do tipo.
- Vincular o tipo pela API não dispara as automações configuradas nele, como solicitação de assinatura ou envio por e-mail.

## 3. Enviar o arquivo

Envie a chamada com o token no cabeçalho `Authorization` e o arquivo no campo `file`. Exemplo usando `curl`:

```bash
curl -X POST "https://URL_DA_API/importar?instancia=SUA_INSTANCIA&nomeArquivo=contrato.pdf&nomePasta=Contratos&nomePastaPai=/Meus%20documentos/Clientes&tipo=Contrato" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@contrato.pdf"
```

Nesse exemplo, o arquivo `contrato.pdf` é gravado na pasta **Contratos**, dentro de **Clientes**, e vinculado ao tipo **Contrato**.

## 4. Conferir a resposta

Se a importação der certo, a resposta traz estes campos:

| Campo | Descrição |
| --- | --- |
| `retorno` | Link para visualizar o documento importado. |
| `documentoId` | Identificador do documento no Docnuvem. Guarde-o: ele é usado nos outros recursos da API. |
| `diretorioId` | Identificador da pasta onde o documento foi gravado. |

```json
{
  "retorno": "https://minhaempresa.docnuvem.com.br/sistema/publico/VisualizarDocumentoEmail?hash=...",
  "documentoId": 48213,
  "diretorioId": 1907
}
```

Em caso de erro, o código é `400` (não foi possível importar; o campo `retorno` traz a mensagem) ou `401` (token ausente ou inválido).

## Resultado esperado

O arquivo passa a constar na pasta indicada, na tela **Meus documentos**, e pode ser aberto pelo link devolvido na resposta.

## Relacionados

- [[Integração por API]]
- [[Importando documentos]]
- [[Tipo de documento]]
