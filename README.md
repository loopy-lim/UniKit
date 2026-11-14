# unikit.ll3.kr — UniKit 패밀리 포털

ll3.kr 툴체인 패밀리를 안내하는 정적 사이트. 세 프로젝트의 소개·배포
사이트·패키지 링크와 **GitHub Actions CI 상태**(main 브랜드 최신 실행,
라이브)를 한 곳에 보여준다.

| 프로젝트    | 저장소                                          | 사이트                    | 패키지                         |
| ----------- | ----------------------------------------------- | ------------------------- | ------------------------------ |
| unikit-ui   | [loopy-lim/unikit-ui](https://github.com/loopy-lim/unikit-ui)   | ui.ll3.kr        | `@unikit-bridge/ui`       |
| rustra      | [loopy-lim/unikit-bridge](https://github.com/loopy-lim/unikit-bridge) | (rustra.ll3.kr 배포 예정) | `@unikit-bridge/rustra` · crates.io `unikit-bridge` |
| scriptca    | [loopy-lim/scriptca](https://github.com/loopy-lim/scriptca)     | scriptca.ll3.kr  | `@unikit-bridge/scriptca` |

UI는 패밀리 제품인 `@unikit-bridge/ui`(zinc 프리셋)를 직접 쓴다 — 포털
스스로가 UI 킷의 소비자다. 디자인 언어(Syne · Public Sans · IBM Plex Mono,
grid canvas)는 apps/web·rustra 사이트를 계승한다.

## 구조

- React 19 + Vite 6 + Tailwind v4, 빌드 없음 수준의 가벼운 정적 배포
- `src/site.ts` — 프로젝트 카탈로그(단일 출처). 저장소·워크플로우 추가는 여기만 고친다.
- `src/ci.ts` — GitHub Actions 라이브 상태(무인증 퍼블릭 API, sessionStorage 3분 캐시)
- `public/_redirects` — 허브 단축 경로(`/ui`, `/scriptca`, `/rustra`).
  이전 허브 워커(unikit-ui apps/hub)를 대체한다.
- `hub/` — unikit.ll3.kr 진입 워커(`unikit-hub`). Pages 배포(unikit-ehv.pages.dev)로
  투명 프록시하는 얇은 워커로, 기존 허브가 맡던 자리를 이어받았다.

## 배포

`.github/workflows/deploy.yml` — push to main → typecheck + build →
Cloudflare Pages 프로젝트 `unikit` 배포 → 허브 워커 재배포. `unikit.ll3.kr`은
워커의 Workers Custom Domain(라우트 `custom_domain = true`)이 DNS·인증서를
관리한다. 시크릿: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

## 로컬 개발

```sh
bun install
bun run dev        # http://localhost:5173
bun run typecheck
bun run build      # dist/
```
