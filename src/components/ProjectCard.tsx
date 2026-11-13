import { ArrowUpRight } from 'lucide-react';
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cn } from '@unikit-bridge/ui';
import { repoUrl, type Project } from '../site';
import { StatusChip } from './StatusChip';
import type { ProjectRunsState } from '../ci';

const linkBtn =
  'site-focusable inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent';

/** 게시 전 패키지/사이트 — 링크가 아니라 상태를 말하는 칩. */
const pendingChip =
  'inline-flex h-8 cursor-default items-center rounded-md border border-dashed border-border px-3 text-sm text-muted-foreground';

/** 제품 카드 — 이름/한줄소개/스택/링크. 사이트가 없는 프로젝트(rustra)는
 * 사이트 링크를 생략하고 siteNote로 상태를 말한다. */
export function ProjectCard({ project, runs }: { project: Project; runs?: ProjectRunsState }) {
  const ciRun = runs?.state === 'ok' ? runs.runs.get('ci.yml') : undefined;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="site-mono text-base font-medium">{project.name}</CardTitle>
          <StatusChip run={ciRun} loading={runs?.state === 'loading'} />
        </div>
        <CardDescription className="pt-1.5 text-sm leading-relaxed">{project.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{project.body}</p>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>
        <p className="site-mono text-xs text-muted-foreground">
          {project.aliasPath.replace('unikit.ll3.kr', '')} → {project.aliasTarget.replace('https://', '')}
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {project.site ? (
          <a href={project.site} target="_blank" rel="noreferrer" className={linkBtn}>
            사이트 <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        ) : (
          <span className={pendingChip}>{project.siteNote}</span>
        )}
        <a href={repoUrl(project.repo)} target="_blank" rel="noreferrer" className={linkBtn}>
          GitHub <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
        {project.packages.map((pkg) =>
          pkg.url ? (
            <a key={pkg.name} href={pkg.url} target="_blank" rel="noreferrer" className={cn(linkBtn, 'site-mono')}>
              {pkg.name} <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          ) : (
            <span key={pkg.name} className={cn(pendingChip, 'site-mono')} title={`${pkg.registry} 게시 예정`}>
              {pkg.name} · {pkg.registry} 게시 예정
            </span>
          ),
        )}
      </CardFooter>
    </Card>
  );
}
