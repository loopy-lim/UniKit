import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@unikit-bridge/ui';
import { actionsUrl, repoUrl, type Project } from '../site';
import { relativeTime, type ProjectRunsState, type WorkflowRun } from '../ci';
import { StatusChip } from './StatusChip';

/** CI 상태 섹션 — 프로젝트별 카드에 워크플로우 행(상태·실행 시각·링크)을 나열.
 * 로딩은 스켈레톤, 실패는 안내 문구로 — 가짜 상태를 그리지 않는다. */
export function CiSection({
  project,
  runsState,
}: {
  project: Project;
  runsState: ProjectRunsState;
}) {
  const loading = runsState.state === 'loading';
  const error = runsState.state === 'error';
  const runs = runsState.state === 'ok' ? runsState.runs : undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <CardTitle className="site-mono text-base font-medium">{project.name}</CardTitle>
          <a
            href={actionsUrl(project.repo)}
            target="_blank"
            rel="noreferrer"
            className="site-focusable inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Actions <ArrowUpRight className="size-3" aria-hidden />
          </a>
        </div>
        <CardDescription className="site-mono pt-1 text-xs">{repoUrl(project.repo).replace('https://', '')}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="rounded-md border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
            GitHub API에서 상태를 가져오지 못했습니다.{' '}
            <a
              href={actionsUrl(project.repo)}
              target="_blank"
              rel="noreferrer"
              className="site-focusable underline underline-offset-4 hover:text-foreground"
            >
              Actions 페이지
            </a>
            에서 직접 확인할 수 있습니다.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {project.workflows.map((wf) => (
              <li key={wf.path}>
                <WorkflowRow workflow={wf} run={runs?.get(wf.path)} loading={loading} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function WorkflowRow({
  workflow,
  run,
  loading,
}: {
  workflow: { path: string; label: string; disabled?: boolean };
  run?: WorkflowRun;
  loading: boolean;
}) {
  const body = (
    <>
      <span className="truncate text-sm">{workflow.label}</span>
      <span className="ml-auto flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
        {workflow.disabled ? (
          <span className="text-xs">일시 중단</span>
        ) : (
          <>
            <StatusChip run={run} loading={loading} />
            {run && <span className="hidden sm:inline">{relativeTime(run.createdAt)}</span>}
          </>
        )}
      </span>
    </>
  );

  if (workflow.disabled || !run) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border/70 px-3 py-2 text-muted-foreground">
        {body}
      </div>
    );
  }
  return (
    <a
      href={run.url}
      target="_blank"
      rel="noreferrer"
      className="site-focusable flex items-center gap-3 rounded-md border border-border/70 px-3 py-2 transition-colors hover:bg-accent"
    >
      {body}
    </a>
  );
}
