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
      favicon: '/favicon.svg',
      logo: { light: './src/assets/logo-claro.svg', dark: './src/assets/logo-escuro.svg', alt: 'Docnuvem', replacesTitle: true },
      defaultLocale: 'root',
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      sidebar,
      customCss: ['./src/styles/fontes.css', './src/styles/tokens.css', './src/styles/manual.css'],
      pagination: true,
      components: {
        ThemeProvider: './src/components/ThemeProvider.astro',
        ThemeSelect: './src/components/ThemeSelect.astro',
        Sidebar: './src/components/Sidebar.astro',
        MobileMenuFooter: './src/components/MobileMenuFooter.astro',
        PageTitle: './src/components/PageTitle.astro',
        SocialIcons: './src/components/SocialIcons.astro',
        Footer: './src/components/Footer.astro',
      },
      head: [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${config.base.replace(/\/?$/, '/')}favicon-32.png` } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: `${config.base.replace(/\/?$/, '/')}apple-touch-icon.png` } },
        ...(config.NOINDEX ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }] : []),
      ],
    }),
  ],
});
