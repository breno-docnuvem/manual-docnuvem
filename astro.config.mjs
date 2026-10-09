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
      logo: { light: './src/assets/logo-claro.svg', dark: './src/assets/logo-escuro.svg', alt: 'Docnuvem', replacesTitle: true },
      defaultLocale: 'root',
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      sidebar,
      customCss: ['./src/styles/tokens.css', './src/styles/manual.css'],
      pagination: true,
      components: {
        SocialIcons: './src/components/SocialIcons.astro',
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap' } },
        ...(config.NOINDEX ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }] : []),
      ],
    }),
  ],
});
