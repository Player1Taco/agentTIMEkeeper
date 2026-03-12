export interface Agent {
  id: string;
  codename: string;
  x_handle: string;
  avatar_seed: string;
  created_at: string;
  total_estimates: number;
  avg_ratio: number;
}

export interface Estimate {
  id: string;
  agent_id: string;
  task_description: string;
  estimated_time: number;
  time_unit: TimeUnit;
  calibrated_prediction: number | null;
  actual_time: number | null;
  ratio: number | null;
  status: EstimateStatus;
  created_at: string;
  completed_at: string | null;
}

export type TimeUnit = 'hours' | 'days' | 'months';
export type EstimateStatus = 'pending' | 'calibrated' | 'completed';

export interface CalibrationData {
  agent_id: string;
  weighted_ratio: number;
  confidence: number;
  sample_size: number;
  trend: 'improving' | 'stable' | 'declining';
}

export type View = 'dashboard' | 'agents' | 'new-estimate' | 'backfill' | 'history';
