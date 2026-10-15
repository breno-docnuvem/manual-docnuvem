// Gera dist/<arquivoPdf> a partir da página /manual-completo/ do site já construído (dist/).
// Uso: npm run build && npm run pdf
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import config from '../site.config.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(RAIZ, 'dist');
const SAIDA = path.join(DIST, config.arquivoPdf);
const TIPOS = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };

if (!fs.existsSync(path.join(DIST, 'manual-completo/index.html'))) {
  console.error('ERRO: dist/manual-completo/ não existe. Rode `npm run build` antes.');
  process.exit(1);
}

const base = config.base.replace(/\/?$/, '/');
const servidor = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.startsWith(base)) p = '/' + p.slice(base.length);
  let arq = path.join(DIST, p);
  if (!arq.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(arq) && fs.statSync(arq).isDirectory()) arq = path.join(arq, 'index.html');
  if (!fs.existsSync(arq)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(arq)] || 'application/octet-stream' });
  fs.createReadStream(arq).pipe(res);
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const porta = servidor.address().port;

const navegador = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox'],
});
try {
  const pagina = await navegador.newPage();
  await pagina.goto(`http://127.0.0.1:${porta}${base}manual-completo/`, { waitUntil: 'networkidle' });
  await pagina.waitForFunction(() => [...document.images].every((i) => i.complete));
  // Peso: os prints são PNG grandes (até 1900 px). Só para o PDF, recodifica em JPEG (qualidade 0,8, largura máx. 1100 px (~160 dpi na página A4)).
  // O site continua servindo os PNG originais. Sem dependência nova: usa o próprio Chromium.
  await pagina.evaluate(async ({ larguraMax, qualidade }) => {
    const imgs = [...document.images].filter((i) => /\/imagens\//.test(i.src) && i.naturalWidth > 0);
    for (const img of imgs) {
      const esc = Math.min(1, larguraMax / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * esc);
      c.height = Math.round(img.naturalHeight * esc);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, c.width, c.height);
      img.removeAttribute('loading');
      img.src = c.toDataURL('image/jpeg', qualidade);
      await img.decode().catch(() => {});
    }
  }, { larguraMax: 1100, qualidade: 0.8 });
  await pagina.pdf({ path: SAIDA, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
} finally {
  await navegador.close();
  servidor.close();
}
const bytes = fs.statSync(SAIDA).size;
console.log(`[pdf] ${path.relative(RAIZ, SAIDA)} gerado (${(bytes / 1048576).toFixed(1)} MiB)`);
// O Cloudflare Pages recusa arquivos acima de 25 MiB: falhar aqui, antes do deploy
if (bytes > 24 * 1048576) {
  console.error('ERRO: o PDF passou de 24 MiB e o Cloudflare Pages não aceita arquivos acima de 25 MiB. Reduza as imagens.');
  process.exit(1);
}
