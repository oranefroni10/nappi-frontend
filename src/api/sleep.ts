import { api } from './client';
import type { LastSleepSummary } from '../types/metrics';

export async function fetchLastSleepSummary(): Promise<LastSleepSummary> {
  const res = await api.get<LastSleepSummary>('/sleep/latest');
  return res.data;
}
