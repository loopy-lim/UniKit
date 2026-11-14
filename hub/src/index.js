/**
 * unikit.ll3.kr → Pages 포털 프록시.
 * 원본: https://unikit-ehv.pages.dev (deploy.yml이 dist를 배포).
 * _redirects(/ui, /scriptca, /rustra 302 · SPA 폴백)는 Pages가 처리하고,
 * 이 워커는 경로·쿼리를 그대로 넘기고 응답(302 포함)을 투명하게 돌려준다.
 */
const ORIGIN = 'https://unikit-ehv.pages.dev';

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const outgoing = new URL(ORIGIN);
    outgoing.pathname = incoming.pathname;
    outgoing.search = incoming.search;

    // host/hop-by-hop/cf-* 헤더는 하위 요청에서 설정 불가 — 걷어낸다.
    const headers = new Headers();
    for (const [key, value] of request.headers) {
      const k = key.toLowerCase();
      if (k === 'host' || k === 'connection' || k === 'content-length' || k.startsWith('cf-') || k.startsWith('x-forwarded')) {
        continue;
      }
      headers.set(key, value);
    }

    // redirect: 'manual' — Pages의 302를 워커가 따라가지 않고 브라우저로 통과.
    return fetch(outgoing, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
      redirect: 'manual',
    });
  },
};
