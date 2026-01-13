import { api } from './client';
import type {
  SensorStatsResponse,
  SleepPatternsResponse,
  DailySleepResponse,
  InsightsResponse,
} from '../types/metrics';

/**
 * Fetch sensor data averages over a time range for graphing.
 * Data comes from daily_summary table (one point per day).
 */
export async function fetchSensorStats(
  babyId: number,
  sensor: 'temperature' | 'humidity' | 'noise',
  startDate: string,
  endDate: string
): Promise<SensorStatsResponse> {
  const res = await api.get<SensorStatsResponse>('/stats/sensors', {
    params: {
      baby_id: babyId,
      sensor,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return res.data;
}

/**
 * Fetch sleep time patterns for a specific month.
 * Returns clustered sleep time windows with averaged start/end times.
 */
export async function fetchSleepPatterns(
  babyId: number,
  month?: number,
  year?: number
): Promise<SleepPatternsResponse> {
  const params: Record<string, number> = { baby_id: babyId };
  if (month !== undefined) params.month = month;
  if (year !== undefined) params.year = year;

  const res = await api.get<SleepPatternsResponse>('/stats/sleep-patterns', {
    params,
  });
  return res.data;
}

/**
 * Fetch total sleep hours per day over a time range.
 * Returns daily sleep totals and session counts for graphing.
 */
export async function fetchDailySleep(
  babyId: number,
  startDate: string,
  endDate: string
): Promise<DailySleepResponse> {
  const res = await api.get<DailySleepResponse>('/stats/daily-sleep', {
    params: {
      baby_id: babyId,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return res.data;
}

/**
 * Fetch AI-powered insights about a baby's sleep/awakening.
 * Analyzes environmental factors and provides actionable tips.
 */
export async function fetchInsights(
  babyId: number,
  eventId?: number
): Promise<InsightsResponse> {
  const params: Record<string, number> = { baby_id: babyId };
  if (eventId !== undefined) params.event_id = eventId;

  const res = await api.get<InsightsResponse>('/stats/insights', {
    params,
  });
  return res.data;
}
