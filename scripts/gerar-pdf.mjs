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
  await pagina.pdf({ path: SAIDA, preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
} finally {
  await navegador.close();
  servidor.close();
}
const kb = Math.round(fs.statSync(SAIDA).size / 1024);
console.log(`[pdf] ${path.relative(RAIZ, SAIDA)} gerado (${kb} KB)`);
