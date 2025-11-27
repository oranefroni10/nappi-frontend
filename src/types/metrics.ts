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
