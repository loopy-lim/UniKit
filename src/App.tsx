import { ArrowUpRight } from 'lucide-react';
import { Badge, buttonVariants, cn } from '@unikit-bridge/ui';
import { GITHUB_URL, PROJECTS } from './site';
import { useCiRuns } from './ci';
import { ProjectCard } from './components/ProjectCard';
import { CiSection } from './components/CiSection';
import { ThemeToggle } from './components/site-theme';

const SHELL = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

function SiteNav() {
  return (
    <header className="border-b border-border/80">
      <div className={`${SHELL} flex h-16 items-center justify-between gap-4`}>
        <a href="#top" className="site-focusable flex items-center gap-2.5">
          <img src="/favicon.svg" alt="" className="size-7 rounded-md" aria-hidden />
          <span className="site-display text-lg font-bold tracking-tight">UniKit</span>
        </a>
        <nav className="flex items-center gap-2.5 text-sm sm:gap-3">
          <a href="#projects" className="site-focusable text-muted-foreground transition-colors hover:text-foreground">
            제품
          </a>
          <a href="#ci" className="site-focusable text-muted-foreground transition-colors hover:text-foreground">
            CI 상태
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="site-focusable hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="site-canvas border-b border-border/60">
      <div className={`${SHELL} py-16 sm:py-20 lg:py-24`}>
        <Badge variant="secondary" className="site-mono w-fit text-xs font-normal">
          ll3.kr 툴체인 패밀리
        </Badge>
        <h1 className="site-display mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          UniKit
        </h1>
        <p className="mt-4 max-w-2xl text-xl font-medium leading-snug tracking-tight sm:text-2xl">
          네이티브 코어와 범용 UI를 잇는 툴체인 패밀리.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          세 프로젝트는 각자의 저장소에서 CI를 돌리고, 이 사이트가 제품·배포·CI
          상태를 한 곳에서 안내합니다. 모든 제품은 <code className="site-mono text-[0.95em]">@unikit-bridge</code>{' '}
          스코프로 발행됩니다.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#projects" className={cn('site-focusable', buttonVariants())}>
            제품 둘러보기
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={cn('site-focusable', buttonVariants({ variant: 'outline' }))}
          >
            GitHub <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ runsById }: { runsById: Record<string, ReturnType<typeof useCiRuns>[string]> }) {
  return (
    <section id="projects" className="scroll-mt-20 border-b border-border/60 py-14 sm:py-16 lg:py-20">
      <div className={SHELL}>
        <h2 className="site-display text-2xl font-bold tracking-tight sm:text-3xl">제품</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          UI 킷부터 Rust·TypeScript 코어 브리지까지, 같은 설계 원칙(한 번 정의,
          어디서나 호출)을 공유하는 세 프로젝트입니다.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} runs={runsById[p.id]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CiStatusSection({ runsById }: { runsById: Record<string, ReturnType<typeof useCiRuns>[string]> }) {
  return (
    <section id="ci" className="scroll-mt-20 border-b border-border/60 py-14 sm:py-16 lg:py-20">
      <div className={SHELL}>
        <h2 className="site-display text-2xl font-bold tracking-tight sm:text-3xl">CI 상태</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          각 저장소 main 브랜치의 최신 실행을 GitHub Actions에서 실시간으로
          가져옵니다. 행을 누르면 해당 실행으로 이동합니다.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          {PROJECTS.map((p) => (
            <CiSection key={p.id} project={p} runsState={runsById[p.id]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AliasesSection() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className={SHELL}>
        <h2 className="site-display text-2xl font-bold tracking-tight sm:text-3xl">경로 alias</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          이전 허브 워커가 맡았던 단축 경로입니다. Cloudflare Pages{" "}
          <code className="site-mono text-[0.95em]">_redirects</code>가 이어받아
          redirection합니다.
        </p>
        <ul className="mt-8 flex flex-col gap-2">
          {PROJECTS.map((p) => (
            <AliasRow key={p.id} from={p.aliasPath} to={p.aliasTarget} note={p.aliasNote} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function AliasRow({ from, to, note }: { from: string; to: string; note?: string }) {
  return (
    <li className="flex flex-col gap-1 rounded-md border border-border/70 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="site-mono text-sm">{from}</span>
      <span className="hidden text-muted-foreground sm:inline" aria-hidden>
        →
      </span>
      <span className="site-mono text-sm text-muted-foreground">{to.replace('https://', '')}</span>
      {note && <span className="text-xs text-muted-foreground sm:ml-auto">{note}</span>}
    </li>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/80 py-10">
      <div className={`${SHELL} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}>
        <div>
          <p className="site-display text-sm font-bold">UniKit</p>
          <p className="mt-1 text-sm text-muted-foreground">ll3.kr 툴체인 패밀리 안내 사이트</p>
        </div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <a href="https://ui.ll3.kr" target="_blank" rel="noreferrer" className="site-focusable transition-colors hover:text-foreground">
            ui.ll3.kr
          </a>
          <a href="https://scriptca.ll3.kr" target="_blank" rel="noreferrer" className="site-focusable transition-colors hover:text-foreground">
            scriptca.ll3.kr
          </a>
          <a href="https://github.com/loopy-lim/unikit-bridge" target="_blank" rel="noreferrer" className="site-focusable transition-colors hover:text-foreground">
            rustra
          </a>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="site-focusable transition-colors hover:text-foreground">
            GitHub
          </a>
          <span className="site-mono text-xs">unikit.ll3.kr</span>
        </nav>
      </div>
    </footer>
  );
}

export default function App() {
  const runsById = useCiRuns(PROJECTS);
  return (
    <div className="min-h-dvh">
      <SiteNav />
      <main>
        <Hero />
        <ProjectsSection runsById={runsById} />
        <CiStatusSection runsById={runsById} />
        <AliasesSection />
      </main>
      <Footer />
    </div>
  );
}
