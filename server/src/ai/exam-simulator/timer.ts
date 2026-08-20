export interface ExamTimerState {
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  timeRemainingSeconds: number;
  totalElapsedSeconds: number;
  isExpired: boolean;
}

export function computeServerExamTimer(startedAt: Date | string, durationMinutes: number): ExamTimerState {
  const startMs = new Date(startedAt).getTime();
  const durationMs = durationMinutes * 60 * 1000;
  const expiresMs = startMs + durationMs;
  const nowMs = Date.now();

  const timeRemainingMs = Math.max(0, expiresMs - nowMs);
  const totalElapsedMs = Math.max(0, nowMs - startMs);

  const isExpired = nowMs >= expiresMs;

  return {
    startedAt: new Date(startMs).toISOString(),
    expiresAt: new Date(expiresMs).toISOString(),
    durationMinutes,
    timeRemainingSeconds: Math.floor(timeRemainingMs / 1000),
    totalElapsedSeconds: Math.floor(totalElapsedMs / 1000),
    isExpired,
  };
}
