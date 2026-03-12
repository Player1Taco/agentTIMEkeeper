import { create } from 'zustand';
import type { Agent, Estimate, View, CalibrationData } from '../types';

// Demo seed data
const demoAgents: Agent[] = [
  { id: '1', codename: 'Shadow Fox', x_handle: '@shadowfox_dev', avatar_seed: 'sf1', created_at: '2025-01-15T10:00:00Z', total_estimates: 12, avg_ratio: 1.45 },
  { id: '2', codename: 'Cipher Wolf', x_handle: '@cipherwolf', avatar_seed: 'cw2', created_at: '2025-02-01T08:00:00Z', total_estimates: 8, avg_ratio: 1.82 },
  { id: '3', codename: 'Ghost Byte', x_handle: '@ghostbyte_', avatar_seed: 'gb3', created_at: '2025-02-20T14:00:00Z', total_estimates: 15, avg_ratio: 1.23 },
  { id: '4', codename: 'Neon Viper', x_handle: '@neonviper_x', avatar_seed: 'nv4', created_at: '2025-03-01T09:00:00Z', total_estimates: 5, avg_ratio: 2.1 },
];

const demoEstimates: Estimate[] = [
  { id: 'e1', agent_id: '1', task_description: 'Implement auth flow', estimated_time: 4, time_unit: 'hours', calibrated_prediction: 5.8, actual_time: 6, ratio: 1.5, status: 'completed', created_at: '2025-02-10T10:00:00Z', completed_at: '2025-02-10T16:00:00Z' },
  { id: 'e2', agent_id: '1', task_description: 'Build dashboard UI', estimated_time: 2, time_unit: 'days', calibrated_prediction: 2.9, actual_time: 3, ratio: 1.5, status: 'completed', created_at: '2025-02-15T10:00:00Z', completed_at: '2025-02-18T10:00:00Z' },
  { id: 'e3', agent_id: '1', task_description: 'API integration', estimated_time: 8, time_unit: 'hours', calibrated_prediction: 11.6, actual_time: 10, ratio: 1.25, status: 'completed', created_at: '2025-02-20T10:00:00Z', completed_at: '2025-02-20T20:00:00Z' },
  { id: 'e4', agent_id: '2', task_description: 'Database schema design', estimated_time: 3, time_unit: 'hours', calibrated_prediction: 5.5, actual_time: 6, ratio: 2.0, status: 'completed', created_at: '2025-02-12T10:00:00Z', completed_at: '2025-02-12T16:00:00Z' },
  { id: 'e5', agent_id: '2', task_description: 'Write unit tests', estimated_time: 1, time_unit: 'days', calibrated_prediction: 1.8, actual_time: 2, ratio: 2.0, status: 'completed', created_at: '2025-02-18T10:00:00Z', completed_at: '2025-02-20T10:00:00Z' },
  { id: 'e6', agent_id: '3', task_description: 'Refactor payment module', estimated_time: 6, time_unit: 'hours', calibrated_prediction: 7.4, actual_time: 7, ratio: 1.17, status: 'completed', created_at: '2025-02-22T10:00:00Z', completed_at: '2025-02-22T17:00:00Z' },
  { id: 'e7', agent_id: '3', task_description: 'Deploy to production', estimated_time: 2, time_unit: 'hours', calibrated_prediction: 2.5, actual_time: 3, ratio: 1.5, status: 'completed', created_at: '2025-03-01T10:00:00Z', completed_at: '2025-03-01T13:00:00Z' },
  { id: 'e8', agent_id: '1', task_description: 'Migrate to new ORM', estimated_time: 5, time_unit: 'hours', calibrated_prediction: 7.0, actual_time: null, ratio: null, status: 'calibrated', created_at: '2025-03-10T10:00:00Z', completed_at: null },
  { id: 'e9', agent_id: '4', task_description: 'Setup CI/CD pipeline', estimated_time: 4, time_unit: 'hours', calibrated_prediction: 8.4, actual_time: null, ratio: null, status: 'calibrated', created_at: '2025-03-11T10:00:00Z', completed_at: null },
  { id: 'e10', agent_id: '2', task_description: 'Optimize search queries', estimated_time: 3, time_unit: 'hours', calibrated_prediction: null, actual_time: null, ratio: null, status: 'pending', created_at: '2025-03-12T10:00:00Z', completed_at: null },
];

interface AppState {
  // Auth
  user: { email: string } | null;
  isAuthModalOpen: boolean;
  setUser: (user: { email: string } | null) => void;
  setAuthModalOpen: (open: boolean) => void;

  // Navigation
  currentView: View;
  setView: (view: View) => void;

  // Agents
  agents: Agent[];
  addAgent: (agent: Omit<Agent, 'id' | 'created_at' | 'total_estimates' | 'avg_ratio'>) => void;
  deleteAgent: (id: string) => void;

  // Estimates
  estimates: Estimate[];
  addEstimate: (estimate: Omit<Estimate, 'id' | 'created_at' | 'completed_at' | 'status' | 'calibrated_prediction' | 'ratio'>) => void;
  completeEstimate: (id: string, actualTime: number) => void;
  addBackfillEstimate: (estimate: Omit<Estimate, 'id' | 'status'>) => void;

  // Calibration
  getCalibration: (agentId: string) => CalibrationData;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function calculateWeightedRatio(estimates: Estimate[]): number {
  const completed = estimates.filter(e => e.ratio !== null).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  if (completed.length === 0) return 1.0;

  let totalWeight = 0;
  let weightedSum = 0;
  completed.forEach((est, index) => {
    const weight = Math.pow(0.85, index); // More recent = higher weight
    weightedSum += (est.ratio || 1) * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 1.0;
}

function getTrend(estimates: Estimate[]): 'improving' | 'stable' | 'declining' {
  const completed = estimates.filter(e => e.ratio !== null).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  if (completed.length < 3) return 'stable';

  const recent = completed.slice(0, 3).reduce((sum, e) => sum + (e.ratio || 1), 0) / 3;
  const older = completed.slice(3).reduce((sum, e) => sum + (e.ratio || 1), 0) / Math.max(completed.length - 3, 1);

  const diff = recent - older;
  if (diff < -0.1) return 'improving';
  if (diff > 0.1) return 'declining';
  return 'stable';
}

export const useStore = create<AppState>((set, get) => ({
  user: { email: 'agent@classified.io' },
  isAuthModalOpen: false,
  setUser: (user) => set({ user }),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

  currentView: 'dashboard',
  setView: (view) => set({ currentView: view }),

  agents: demoAgents,
  addAgent: (agentData) => set((state) => ({
    agents: [...state.agents, {
      ...agentData,
      id: generateId(),
      created_at: new Date().toISOString(),
      total_estimates: 0,
      avg_ratio: 1.0,
    }],
  })),
  deleteAgent: (id) => set((state) => ({
    agents: state.agents.filter(a => a.id !== id),
    estimates: state.estimates.filter(e => e.agent_id !== id),
  })),

  estimates: demoEstimates,
  addEstimate: (estimateData) => {
    const state = get();
    const agentEstimates = state.estimates.filter(e => e.agent_id === estimateData.agent_id);
    const weightedRatio = calculateWeightedRatio(agentEstimates);
    const calibrated = estimateData.estimated_time * weightedRatio;

    set((s) => ({
      estimates: [...s.estimates, {
        ...estimateData,
        id: generateId(),
        created_at: new Date().toISOString(),
        completed_at: null,
        status: agentEstimates.length > 0 ? 'calibrated' : 'pending',
        calibrated_prediction: agentEstimates.length > 0 ? Math.round(calibrated * 100) / 100 : null,
        ratio: null,
      }],
    }));
  },
  completeEstimate: (id, actualTime) => set((state) => {
    const est = state.estimates.find(e => e.id === id);
    if (!est) return state;
    const ratio = actualTime / est.estimated_time;
    const updatedEstimates = state.estimates.map(e =>
      e.id === id ? { ...e, actual_time: actualTime, ratio, status: 'completed' as const, completed_at: new Date().toISOString() } : e
    );
    // Update agent stats
    const agentEstimates = updatedEstimates.filter(e => e.agent_id === est.agent_id && e.ratio !== null);
    const avgRatio = agentEstimates.reduce((sum, e) => sum + (e.ratio || 0), 0) / agentEstimates.length;
    const updatedAgents = state.agents.map(a =>
      a.id === est.agent_id ? { ...a, total_estimates: agentEstimates.length, avg_ratio: Math.round(avgRatio * 100) / 100 } : a
    );
    return { estimates: updatedEstimates, agents: updatedAgents };
  }),
  addBackfillEstimate: (estimateData) => set((state) => ({
    estimates: [...state.estimates, {
      ...estimateData,
      id: generateId(),
      status: estimateData.actual_time ? 'completed' : 'pending',
    }],
  })),

  getCalibration: (agentId) => {
    const state = get();
    const agentEstimates = state.estimates.filter(e => e.agent_id === agentId);
    const completed = agentEstimates.filter(e => e.ratio !== null);
    return {
      agent_id: agentId,
      weighted_ratio: calculateWeightedRatio(agentEstimates),
      confidence: Math.min(completed.length / 10, 1),
      sample_size: completed.length,
      trend: getTrend(agentEstimates),
    };
  },

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
