// Divide um sprite SVG da plataforma (vários <symbol id="...">) em um arquivo SVG por ícone,
// calculando o viewBox de cada um e usando currentColor (a cor vem do texto onde o ícone é usado).
// Uso: node scripts/dividir-sprite.mjs <sprite.svg> [pasta-de-saida]
//      (padrão da pasta: src/assets/icones/plataforma)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const [, , arquivo, saida = 'src/assets/icones/plataforma'] = process.argv;
if (!arquivo) { console.error('Uso: node scripts/dividir-sprite.mjs <sprite.svg> [pasta]'); process.exit(1); }
const texto = fs.readFileSync(arquivo, 'utf8');
fs.mkdirSync(saida, { recursive: true });

const navegador = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const pagina = await navegador.newPage();
await pagina.setContent(`<body>${texto.replace(/<\?xml[^>]*\?>/, '')}</body>`);
const icones = await pagina.evaluate(() =>
  [...document.querySelectorAll('symbol')].map((s) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    g.setAttribute('width', '400'); g.setAttribute('height', '400');
    g.innerHTML = s.innerHTML;
    document.body.appendChild(g);
    const caixa = g.getBBox();
    g.remove();
    const vb = s.getAttribute('viewBox');
    return { id: s.id, viewBox: vb || `${+caixa.x.toFixed(2)} ${+caixa.y.toFixed(2)} ${Math.ceil(caixa.width * 100) / 100} ${Math.ceil(caixa.height * 100) / 100}`, interno: s.innerHTML };
  }),
);
await navegador.close();

for (const i of icones) {
  const interno = i.interno.replace(/\s+/g, ' ').replace(/ fill="(?!none)[^"]*"/g, '').trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${i.viewBox}" fill="currentColor">${interno}</svg>\n`;
  fs.writeFileSync(path.join(saida, `${i.id}.svg`), svg);
}
console.log(`[icones] ${icones.length} ícones de ${path.basename(arquivo)} em ${saida}: ${icones.map((i) => i.id).join(', ')}`);
