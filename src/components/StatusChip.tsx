import { cn } from '@unikit-bridge/ui';
import type { RunStatus, WorkflowRun } from '../ci';

const DOT_CLASS: Record<RunStatus, string> = {
  success: 'bg-emerald-500',
  failure: 'bg-red-500',
  running: 'bg-amber-500 motion-safe:animate-pulse',
  cancelled: 'bg-zinc-400',
  unknown: 'bg-zinc-300 dark:bg-zinc-600',
};

const LABEL: Record<RunStatus, string> = {
  success: '통과',
  failure: '실패',
  running: '실행 중',
  cancelled: '취소',
  unknown: '알 수 없음',
};

/** 상태 점 + 짧은 라벨. run이 없으면 기록 없음, 로딩 중이면 스켈레톤. */
export function StatusChip({
  run,
  loading = false,
}: {
  run?: WorkflowRun;
  loading?: boolean;
}) {
  if (loading && !run) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="불러오는 중">
        <span className="size-2 rounded-full bg-zinc-200 motion-safe:animate-pulse dark:bg-zinc-700" />
        불러오는 중
      </span>
    );
  }
  if (!run) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className={cn('size-2 rounded-full', DOT_CLASS.unknown)} aria-hidden />
        기록 없음
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn('size-2 rounded-full', DOT_CLASS[run.status])} aria-hidden />
      {LABEL[run.status]}
    </span>
  );
}
