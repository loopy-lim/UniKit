/**
 * unikit.ll3.kr 진입 워커 — dist/ 정적 자산 서빙 + 옛 허브의 경로 alias.
 * 자산 본체는 [assets](wrangler.toml)가, 없는 경로의 SPA 폴백은
 * not_found_handling이 처리한다. 여기선 alias 302만 담당한다.
 */
const ALIASES = {
  '/ui': 'https://ui.ll3.kr',
  '/scriptca': 'https://scriptca.ll3.kr',
  '/rustra': 'https://rustra.ll3.kr',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    for (const [prefix, target] of Object.entries(ALIASES)) {
      if (url.pathname === prefix || url.pathname.startsWith(prefix + '/')) {
        const dest = new URL(target);
        dest.pathname = url.pathname.slice(prefix.length) || '/';
        dest.search = url.search;
        return Response.redirect(dest.toString(), 302);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
