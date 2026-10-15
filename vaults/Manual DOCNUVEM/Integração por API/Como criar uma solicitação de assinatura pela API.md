# Como criar uma solicitação de assinatura pela API

Este guia mostra como criar o fluxo de assinatura de um documento que já está no Docnuvem, seja importado ou gerado a partir de um modelo. A resposta traz o link de assinatura de cada signatário.

Um documento só pode ter um fluxo de assinatura em andamento por vez. Para abrir outro, cancele o atual antes, conforme [[Como cancelar uma solicitação de assinatura pela API]].

## 1. Montar a chamada

Use o método `POST` no recurso `/api/assinatura`, com o parâmetro `instancia` na URL e o corpo em JSON:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `documentoId` | Sim | Identificador do documento, devolvido na importação ou na geração. |
| `signatarios` | Sim | Lista de signatários. Veja a etapa 2. |
| `consideraOrdem` | Não | Com o valor `true`, cada signatário só assina depois do anterior. |
| `prazoDias` | Não | Prazo, em dias a partir de hoje. |
| `dataValidade` | Não | Último dia em que o documento pode ser assinado. Alternativa ao `prazoDias`. |
| `metodos` | Não | Métodos de assinatura oferecidos: `eletronica`, `digital` ou `birdid`. O padrão é `eletronica`, indicada para signatários externos. `digital` e `birdid` exigem certificado do signatário. |
| `textoEmail` | Não | Texto que acompanha a solicitação e aparece para o signatário. |
| `enviarConvite` | Não | Pede que o Docnuvem envie o convite aos signatários. Veja a etapa 4. |
| `lembretes` | Não | Dias após a solicitação em que os signatários pendentes recebem lembrete por e-mail. Veja a etapa 5. |
| `referenciaExterna` | Não | Identificador livre do seu sistema, com até 64 caracteres. É devolvido sem alteração nas consultas. |
| `loginSolicitante` | Não | Login do usuário do Docnuvem registrado como solicitante. |

## 2. Informar os signatários

Cada item de `signatarios` tem os campos:

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `nome` | Sim | Nome do signatário. |
| `email` | Sim | E-mail do signatário. |
| `cpf` ou `cnpj` | Sim, um dos dois | Documento do signatário, com ou sem máscara. Use `cnpj` quando quem assina é a pessoa jurídica. Nunca envie os dois. |
| `telefone` | Não | Telefone ou WhatsApp do signatário. |
| `ordem` | Quando `consideraOrdem` é `true` | Posição na fila de assinatura, começando em `0`. |
| `posicao` | Não | Onde o carimbo da assinatura fica no documento. Veja a etapa 3. |
| `semCarimbo` | Não | Com o valor `true`, o signatário assina sem carimbo desenhado no documento. Não pode ser usado junto com `posicao`. |
| `solicitarSelfie` | Não | Com o valor `true`, exige uma selfie antes da assinatura. |
| `otp` | Não | Exige um código de uso único antes da assinatura, enviado por `email`, `sms` ou `whatsapp`. Só existe em instâncias com EasySign. |

Regras importantes:

- O CPF ou o CNPJ é obrigatório e validado pelo dígito verificador. Se estiver ausente, inválido ou repetido, a API responde com erro `400` informando qual signatário tem o problema. A página pública de assinatura confirma a identidade por um desses documentos.
- Com `consideraOrdem` igual a `true`, a `ordem` precisa começar em `0` e seguir sem lacunas (0, 1, 2…), uma para cada signatário.
- A selfie e o código de uso único são opcionais e valem por signatário: é possível exigir de um e não de outro na mesma solicitação.

## 3. Definir a posição do carimbo (opcional)

Por padrão, o carimbo de cada signatário fica no rodapé da última página. Para escolher o lugar, envie `posicao` no signatário, com valores em fração da página, de `0` a `1`, a partir do canto superior esquerdo:

| Campo | Descrição |
| --- | --- |
| `pagina` | Página do documento, começando em `1`. O padrão é a última página. |
| `x` | Distância da borda esquerda. |
| `y` | Distância da borda superior. |
| `largura` e `altura` | Tamanho do carimbo. Os padrões são `0.284` e `0.081`. |

Por exemplo, `{"pagina": 1, "x": 0.1, "y": 0.85}` coloca o carimbo a 10% da borda esquerda e a 85% do topo da primeira página. Como a posição é uma fração, ela vale para qualquer tamanho de página. A posição pode ser ajustada depois pela tela do Docnuvem, enquanto ninguém tiver assinado.

## 4. Decidir quem avisa os signatários

Por padrão, a API **não envia e-mail**. Quem avisa os signatários é o seu sistema, usando o link que vem na resposta.

Para o Docnuvem avisar no seu lugar, envie `enviarConvite` com o valor `true`. Sai o mesmo convite da tela: e-mail com o botão de acesso e, quando a instância tem o adicional de WhatsApp contratado, um aparelho conectado e o `telefone` do signatário, também a mensagem de WhatsApp. Se faltar qualquer um desses três itens, sai só o e-mail. O texto é o `textoEmail` da chamada ou, se ele não vier, o modelo configurado na instância. Com `consideraOrdem`, só o primeiro da fila recebe o convite, e os seguintes são avisados conforme cada um assina. A resposta traz `conviteEnviado`, que informa se o envio foi aceito.

## 5. Configurar lembretes (opcional)

Com `lembretes` igual a `[1, 7]`, o Docnuvem cobra por e-mail, um dia e sete dias depois da solicitação, somente os signatários que ainda não assinaram. Sem essa lista, nenhum lembrete é enviado. Cada dia precisa caber no prazo da solicitação. O envio ocorre pela rotina diária do Docnuvem, então o lembrete sai ao longo do dia, e não na hora exata.

## 6. Entender o efeito do assinador da instância

Quem decide o motor de assinatura é a configuração da empresa, e não a chamada, para que a solicitação criada pela API se comporte como a criada pela tela:

- **Em instâncias com EasySign:** o convite ao signatário sempre é enviado e `enviarConvite` não se aplica. O prazo é limitado a 90 dias e o campo `otp` fica disponível.
- **Nas demais instâncias:** vale o assinador anterior. O `enviarConvite` controla o convite, o `otp` é recusado e o prazo é livre.

O `linkAssinatura` da resposta já vem no formato certo para cada caso.

## 7. Enviar a chamada

Exemplo usando `curl`:

```bash
curl -X POST "https://URL_DA_API/api/assinatura?instancia=SUA_INSTANCIA" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentoId": 48213,
    "consideraOrdem": false,
    "prazoDias": 15,
    "enviarConvite": true,
    "lembretes": [1, 7],
    "referenciaExterna": "card_98765",
    "signatarios": [
      {
        "nome": "Fulano de Tal",
        "email": "fulano@cliente.com.br",
        "cpf": "12345678901",
        "telefone": "31999998888"
      }
    ]
  }'
```

## 8. Conferir a resposta

A resposta tem o mesmo formato da consulta de situação, descrita em [[Como consultar a situação da assinatura pela API]]. Guarde o `assinaturaId`, usado para cancelar a solicitação, e o `linkAssinatura` de cada signatário.

Os erros possíveis são:

- `400`: dados inválidos, como documento do signatário ausente.
- `401`: token ausente ou inválido.
- `404`: documento não encontrado.
- `409`: o documento já tem uma solicitação de assinatura em andamento.

## Resultado esperado

A solicitação de assinatura é criada, e cada signatário recebe um link para assinar, enviado por você ou pelo Docnuvem.

## Relacionados

- [[Integração por API]]
- [[Como gerar um documento a partir de um modelo pela API]]
- [[Como consultar a situação da assinatura pela API]]
- [[Como cancelar uma solicitação de assinatura pela API]]
- [[Como solicitar uma assinatura em um arquivo]]
