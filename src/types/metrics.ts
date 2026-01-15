export type SleepStage = 'light' | 'deep' | 'rem' | string;

export interface SleepStageMetric {
  stage: SleepStage;
  start_time: string;
  end_time: string;
}

export interface LastSleepSummary {
  baby_name: string;
  started_at: string;
  ended_at: string;
  total_sleep_minutes: number;
  awakenings_count: number;
  sleep_quality_score: number;
  stages: SleepStageMetric[];
}

export interface RoomMetrics {
  temperature_c: number;
  humidity_percent: number;
  noise_db: number;
  light_lux: number;
  measured_at: string;
  notes?: string | null;
}

// ========== Statistics API Types ==========

export interface SensorDataPoint {
  date: string;
  value: number;
}

export interface SensorStatsResponse {
  baby_id: number;
  sensor: 'temperature' | 'humidity' | 'noise';
  start_date: string;
  end_date: string;
  data: SensorDataPoint[];
}

export interface SleepPattern {
  cluster_id: number;
  label: string;
  avg_start: string;
  avg_end: string;
  avg_duration_hours: number;
  session_count: number;
  earliest_start: string;
  latest_end: string;
}

export interface SleepPatternsResponse {
  baby_id: number;
  month: number;
  year: number;
  total_sessions: number;
  patterns: SleepPattern[];
}

export interface DailySleepPoint {
  date: string;
  total_hours: number;
  sessions_count: number;
}

export interface DailySleepResponse {
  baby_id: number;
  start_date: string;
  end_date: string;
  data: DailySleepPoint[];
}

export interface EnvironmentalChange {
  start_value: number;
  end_value: number;
  change_percent: number;
  direction: 'increase' | 'decrease';
}

export interface InsightsResponse {
  baby_id: number;
  event_id: number;
  awakened_at: string;
  sleep_duration_minutes: number;
  environmental_changes: Record<string, EnvironmentalChange>;
  insights: string;
  correlation_id: number;
}

export interface OptimalStatsResponse {
  baby_id: number;
  temperature: number | null;
  humidity: number | null;
  noise: number | null;
  has_data: boolean;
}
