import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync, existsSync } from 'node:fs';
import config from './site.config.mjs';

// Gerado por `npm run prepare-content` (scripts/prepare-content.mjs).
const arquivoMenu = new URL('./src/generated/sidebar.json', import.meta.url);
const sidebar = existsSync(arquivoMenu) ? JSON.parse(readFileSync(arquivoMenu, 'utf8')) : [];

export default defineConfig({
  base: config.base,
  integrations: [
    starlight({
      title: config.titulo,
      description: config.descricao,
      defaultLocale: 'root',
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      sidebar,
      customCss: ['./src/styles/tokens.css', './src/styles/manual.css'],
      pagination: true,
      head: config.NOINDEX
        ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }]
        : [],
    }),
  ],
});
