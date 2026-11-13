/** 사이트 전역 상수 — 포털이 안내하는 모든 URL의 단일 출처. */

export const GITHUB_URL = 'https://github.com/loopy-lim/unikit';

export const npmUrl = (pkg: string) => `https://www.npmjs.com/package/${pkg}`;
export const repoUrl = (repo: string) => `https://github.com/${repo}`;
export const actionsUrl = (repo: string) => `https://github.com/${repo}/actions`;

/** CI 상태 칩에 표시할 워크플로우 — path는 .github/workflows/ 아래 파일명. */
export type WorkflowRef = {
  path: string;
  label: string;
  /** 트리거가 막혀 실행 기록이 없는 워크플로우 (android-emulator `if: false`). */
  disabled?: boolean;
};

/** 패키지 — url이 없으면 아직 게시 전(드러냄 칩으로 표시). 2026-11-14 기준
 * npm: ui·rustra 게시됨, scriptca 미게시. crates.io unikit-bridge 미게시. */
export type PackageRef = {
  name: string;
  url?: string;
  registry: 'npm' | 'crates.io';
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  body: string;
  repo: string;
  /** 배포된 사이트 — 없으면 사이트 링크를 생략한다 (rustra는 배포 예정). */
  site?: string;
  siteNote?: string;
  packages: PackageRef[];
  stack: string[];
  /** 허브 경로 alias — 표시용 단일 출처(기능은 public/_redirects가 담당). */
  aliasPath: string;
  aliasTarget: string;
  aliasNote?: string;
  workflows: WorkflowRef[];
};

export const PROJECTS: Project[] = [
  {
    id: 'ui',
    name: 'unikit-ui',
    tagline: '하나의 컴포넌트 소스로 웹과 React Native 동시 렌더',
    body:
      'shadcn new-york-v4 스타일 UI 킷. 같은 className이 웹에서는 Tailwind v4 DOM으로, 네이티브에서는 uniwind 뷰로 렌더됩니다. 61개 컴포넌트와 테마 프리셋을 레지스트리로 배포합니다.',
    repo: 'loopy-lim/unikit-ui',
    site: 'https://ui.ll3.kr',
    packages: [{ name: '@unikit-bridge/ui', url: npmUrl('@unikit-bridge/ui'), registry: 'npm' }],
    stack: ['React 19', 'Tailwind v4', 'React Native', 'shadcn registry'],
    aliasPath: 'unikit.ll3.kr/ui',
    aliasTarget: 'ui.ll3.kr',
    workflows: [
      { path: 'ci.yml', label: 'CI' },
      { path: 'deploy-pages.yml', label: 'Pages 배포' },
      { path: 'deploy-hub.yml', label: 'Hub 배포' },
      { path: 'publish.yml', label: 'npm 게시' },
    ],
  },
  {
    id: 'rustra',
    name: 'rustra',
    tagline: '한 Rust 코어 → Node · Bun · Tauri · React Native 클라이언트',
    body:
      'unikit codegen이 플랫폼별 타입 안전 클라이언트를 만들고, 컴팩트 바이너리 와이어(Frame)로 통신합니다. 계약 해시 게이트(unikit diff)가 스키마 깨짐을 CI에서 차단합니다.',
    repo: 'loopy-lim/unikit-bridge',
    siteNote: 'rustra.ll3.kr 배포 예정',
    packages: [
      { name: '@unikit-bridge/rustra', url: npmUrl('@unikit-bridge/rustra'), registry: 'npm' },
      { name: 'unikit-bridge', registry: 'crates.io' },
    ],
    stack: ['Rust', 'TypeScript', 'Tauri', 'React Native'],
    aliasPath: 'unikit.ll3.kr/rustra',
    aliasTarget: 'github.com/loopy-lim/unikit-bridge',
    aliasNote: '사이트 배포 후 rustra.ll3.kr로 전환',
    workflows: [
      { path: 'ci.yml', label: 'CI · 18-job 게이트' },
      { path: 'release.yml', label: '릴리스' },
      { path: 'bench.yml', label: '벤치마크' },
      { path: 'fuzz.yml', label: 'Fuzz' },
      { path: 'miri.yml', label: 'Miri' },
      { path: 'sanitizer.yml', label: 'Sanitizer' },
      { path: 'tsan.yml', label: 'ThreadSanitizer' },
      { path: 'coverage.yml', label: '커버리지' },
      { path: 'codegen-determinism.yml', label: '코드젠 결정성' },
      { path: 'registry-consumer.yml', label: '레지스트리 소비자' },
    ],
  },
  {
    id: 'scriptca',
    name: 'scriptca',
    tagline: 'TypeScript 코어를 네이티브·WASM으로 컴파일해 모든 호스트로',
    body:
      'Vercel scriptc가 TS 코어를 네이티브 라이브러리(.so/.dylib/.dll)로 컴파일하고, 브라우저에서는 WASM으로 돌아갑니다. 번들러 플러그인이 import를 그대로 가로채 드롭인으로 교체합니다.',
    repo: 'loopy-lim/scriptca',
    site: 'https://scriptca.ll3.kr',
    packages: [{ name: '@unikit-bridge/scriptca', registry: 'npm' }],
    stack: ['TypeScript', 'scriptc', 'WASM', 'zig 0.13'],
    aliasPath: 'unikit.ll3.kr/scriptca',
    aliasTarget: 'scriptca.ll3.kr',
    workflows: [
      { path: 'ci.yml', label: 'CI · 멀티 OS 매트릭스' },
      { path: 'site.yml', label: '사이트 배포' },
      { path: 'release.yml', label: '릴리스' },
      { path: 'android-emulator.yml', label: 'Android 에뮬레이터', disabled: true },
    ],
  },
];
