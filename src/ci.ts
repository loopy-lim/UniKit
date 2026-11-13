/**
 * GitHub Actions 라이브 상태 — 퍼블릭 API(무인증, IP당 60회/시간)로
 * main 브랜치의 최근 실행을 워크플로우별로 묶어 최신 것만 보여준다.
 * 세 저장소 요청 3회로 끝나며, sessionStorage 캐시(3분)로 재방문 시
 * API를 치지 않는다.
 */
import { useEffect, useState } from 'react';
import type { Project } from './site';

export type RunStatus = 'success' | 'failure' | 'running' | 'cancelled' | 'unknown';

export type WorkflowRun = {
  /** workflows 내 파일명 (ci.yml …) */
  path: string;
  status: RunStatus;
  createdAt: string;
  url: string;
};

export type ProjectRunsState =
  | { state: 'loading' }
  | { state: 'error' }
  | { state: 'ok'; runs: Map<string, WorkflowRun> };

type GithubRun = {
  path: string;
  status: string;
  conclusion: string | null;
  created_at: string;
  html_url: string;
};

const CACHE_KEY = 'unikit-ci-cache-v1';
const CACHE_TTL_MS = 3 * 60 * 1000;

/** 캐시 저장 값 — `at`는 마지막 성공 저장 시각, runs는 repo별 결과.
 * 부분 실패한 저장도 그대로 두되, 아래 isFresh가 "모든 프로젝트가 있는
 * 캐시"만 유효하게 판정하므로 빈/불완전 캐시는 다시 요청하게 된다. */
type CacheShape = { at: number; runs: Record<string, [string, WorkflowRun][]> };

function toStatus(run: GithubRun): RunStatus {
  if (run.status === 'in_progress' || run.status === 'queued' || run.status === 'waiting') {
    return 'running';
  }
  switch (run.conclusion) {
    case 'success':
      return 'success';
    case 'failure':
    case 'timed_out':
    case 'startup_failure':
      return 'failure';
    case 'cancelled':
    case 'skipped':
      return 'cancelled';
    default:
      return 'unknown';
  }
}

function basename(path: string): string {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? path : path.slice(idx + 1);
}

async function fetchProjectRuns(repo: string): Promise<Map<string, WorkflowRun>> {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/actions/runs?branch=main&per_page=100`,
    {
      headers: { Accept: 'application/vnd.github+json' },
      // 캐시 우회 — sessionStorage가 우리 캐시 계층이다.
      cache: 'no-store',
    },
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = (await res.json()) as { workflow_runs: GithubRun[] };
  const latest = new Map<string, WorkflowRun>();
  // API는 created_at 내림차순 — 처음 만난 실행이 해당 워크플로우의 최신.
  for (const run of data.workflow_runs ?? []) {
    const path = basename(run.path);
    if (latest.has(path)) continue;
    latest.set(path, {
      path,
      status: toStatus(run),
      createdAt: run.created_at,
      url: run.html_url,
    });
  }
  return latest;
}

function readCache(): CacheShape | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CacheShape;
  } catch {
    return null;
  }
}

/** 캐시 전체가 TTL 안에 있고, 요청할 모든 repo가 들어 있을 때만 재사용. */
function isFresh(cache: CacheShape | null, repos: string[]): cache is CacheShape {
  if (!cache) return false;
  if (Date.now() - cache.at >= CACHE_TTL_MS) return false;
  return repos.every((repo) => Array.isArray(cache.runs[repo]));
}

/** 프로젝트별 최신 실행 맵. 마운트 시 1회 요청한다. */
export function useCiRuns(projects: Project[]): Record<string, ProjectRunsState> {
  const [states, setStates] = useState<Record<string, ProjectRunsState>>(() =>
    Object.fromEntries(projects.map((p) => [p.id, { state: 'loading' as const }])),
  );

  useEffect(() => {
    let cancelled = false;
    const cached = readCache();
    if (isFresh(cached, projects.map((p) => p.repo))) {
      setStates(
        Object.fromEntries(
          projects.map((p) => [p.id, { state: 'ok' as const, runs: new Map(cached.runs[p.repo]) }]),
        ),
      );
      return;
    }

    const next: Record<string, ProjectRunsState> = {};
    const store: CacheShape = { at: Date.now(), runs: {} };
    (async () => {
      await Promise.all(
        projects.map(async (p) => {
          try {
            const runs = await fetchProjectRuns(p.repo);
            store.runs[p.repo] = [...runs.entries()];
            if (!cancelled) next[p.id] = { state: 'ok', runs };
          } catch {
            if (!cancelled) next[p.id] = { state: 'error' };
          }
        }),
      );
      if (cancelled) return;
      setStates({ ...next });
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(store));
      } catch {
        // storage 불가 환경 — 캐시 없이 진행
      }
    })();

    return () => {
      cancelled = true;
    };
    // projects는 모듈 상수 — 최초 1회만 요청한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return states;
}

/** 한국어 상대 시간 — 방금 전 / N분 전 / N시간 전 / N일 전 / 날짜. */
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '방금 전';
  if (min < 60) return `${min}분 전`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}시간 전`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}일 전`;
  return new Date(then).toISOString().slice(0, 10);
}
