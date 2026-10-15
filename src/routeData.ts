// Duas áreas no site: o manual do usuário e a documentação da API (endereços /api/...).
// Cada área mostra só o seu menu lateral e a sua paginação; a API não aparece no menu do manual.
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

const ROTULO_API = 'API';

export const onRequest = defineRouteMiddleware((context) => {
  const rota = context.locals.starlightRoute;
  const ehApi = rota.id === 'api' || rota.id.startsWith('api/');
  const grupoApi = rota.sidebar.find((e) => e.type === 'group' && e.label === ROTULO_API);

  if (ehApi && grupoApi && grupoApi.type === 'group') {
    rota.sidebar = grupoApi.entries;
  } else {
    rota.sidebar = rota.sidebar.filter((e) => !(e.type === 'group' && e.label === ROTULO_API));
  }

  // A paginação não atravessa de uma área para a outra
  const naMesmaArea = (href: string | undefined) => {
    if (!href) return true;
    const caminho = href.replace(/^https?:\/\/[^/]+/, '');
    const apiHref = /\/api(\/|$)/.test(caminho);
    return apiHref === ehApi;
  };
  if (rota.pagination.next && !naMesmaArea(rota.pagination.next.href)) rota.pagination.next = undefined;
  if (rota.pagination.prev && !naMesmaArea(rota.pagination.prev.href)) rota.pagination.prev = undefined;
});
