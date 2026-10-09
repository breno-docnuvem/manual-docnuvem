# Deploy provisório no Cloudflare Pages

Por que GitHub Actions e não o build do próprio Cloudflare: o PDF é gerado com Chromium, que não está no ambiente de build do Cloudflare Pages. O Action constrói site + PDF e envia a pasta `dist/` pronta (modo *Direct Upload*). Custo zero (GitHub Actions e Cloudflare Pages gratuitos).

## Passos do Breno (uma vez)
1. Conta no Cloudflare (gratuita). Anote o **Account ID** (painel → Workers & Pages → coluna direita).
2. Criar um **API Token**: Meu perfil → API Tokens → Create Token → *Create Custom Token* com a permissão **Account › Cloudflare Pages › Edit**.
3. No GitHub, repositório → Settings → Secrets and variables → Actions → *New repository secret*:
   - `CLOUDFLARE_API_TOKEN` = token do passo 2
   - `CLOUDFLARE_ACCOUNT_ID` = ID do passo 1
4. Fazer o push do branch `main` pelo GitHub Desktop (ou rodar manualmente: Actions → *Publicar no Cloudflare Pages* → Run workflow).
5. Endereço final: `https://manual-docnuvem.pages.dev` (se o nome já estiver ocupado, o Cloudflare acrescenta um sufixo; ajuste `--project-name` em `.github/workflows/deploy.yml`).

**Não crie o projeto pelo botão "Connect to Git"**: um projeto conectado ao Git não aceita Direct Upload. O Action cria o projeto sozinho. Se você já criou um, apague-o em Workers & Pages → Settings → Delete.

## Provisório
- `noindex` ligado (meta tag, `robots.txt` e `_headers`). Para liberar depois: variável `NOINDEX=0` no build.
- Domínio da empresa: só depois da apresentação (Custom domains no projeto).

## Local
`npm install && npm run build:completo` (gera `dist/` com o PDF). Em máquina com Chromium próprio: `CHROMIUM_PATH=/caminho/chrome npm run pdf`.
