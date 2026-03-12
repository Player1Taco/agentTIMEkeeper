import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { PlusCircle, Clock, AlertCircle, Sparkles } from 'lucide-react';
import type { TimeUnit } from '../types';

export const EstimateForm: React.FC = () => {
  const { agents, addEstimate, getCalibration, estimates } = useStore();
  const [agentId, setAgentId] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('hours');
  const [submitted, setSubmitted] = useState(false);
  const [lastEstimate, setLastEstimate] = useState<{
    estimated: number;
    calibrated: number | null;
    unit: TimeUnit;
    agentName: string;
    ratio: number;
    confidence: number;
  } | null>(null);

  const selectedAgent = agents.find(a => a.id === agentId);
  const calibration = agentId ? getCalibration(agentId) : null;
  const agentEstimates = agentId ? estimates.filter(e => e.agent_id === agentId && e.ratio !== null) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentId || !taskDescription.trim() || !estimatedTime) return;

    const estTime = parseFloat(estimatedTime);
    const calibrated = agentEstimates.length > 0 && calibration
      ? Math.round(estTime * calibration.weighted_ratio * 100) / 100
      : null;

    addEstimate({
      agent_id: agentId,
      task_description: taskDescription.trim(),
      estimated_time: estTime,
      time_unit: timeUnit,
      actual_time: null,
    });

    setLastEstimate({
      estimated: estTime,
      calibrated,
      unit: timeUnit,
      agentName: selectedAgent?.codename || '',
      ratio: calibration?.weighted_ratio || 1,
      confidence: calibration?.confidence || 0,
    });

    setSubmitted(true);
    setTaskDescription('');
    setEstimatedTime('');
  };

  const resetForm = () => {
    setSubmitted(false);
    setLastEstimate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-glow">New Mission</span>
        </h2>
        <p className="text-spy-300 text-sm mt-1">Log a time estimate and receive calibrated prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card-glass p-6 fade-in fade-in-delay-1">
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <PlusCircle size={18} className="text-neon-purple" />
            Mission Parameters
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-text">Assigned Agent</label>
              <select
                value={agentId}
                onChange={(e) => { setAgentId(e.target.value); setSubmitted(false); }}
                className="select-field"
                required
              >
                <option value="">Select an operative...</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.codename} ({a.x_handle})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">Mission Description</label>
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="e.g. Implement user authentication flow"
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-text">Estimated Time</label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="0"
                  min="0.1"
                  step="0.1"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label-text">Time Unit</label>
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                  className="select-field"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Sparkles size={16} />
              Generate Calibrated Prediction
            </button>
          </form>
        </div>

        {/* Calibration Result */}
        <div className="space-y-4">
          {/* Agent Intel */}
          {selectedAgent && calibration && (
            <div className="card-glass p-5 fade-in">
              <h4 className="text-sm font-semibold text-spy-200 mb-3 flex items-center gap-2">
                <Clock size={14} className="text-neon-blue" />
                Agent Intel: {selectedAgent.codename}
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 rounded-lg bg-spy-800/30">
                  <p className="text-[10px] text-spy-400 font-mono">W. RATIO</p>
                  <p className="text-lg font-bold text-neon-purple font-mono">{calibration.weighted_ratio.toFixed(2)}x</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-spy-800/30">
                  <p className="text-[10px] text-spy-400 font-mono">CONFIDENCE</p>
                  <p className="text-lg font-bold text-neon-blue font-mono">{Math.round(calibration.confidence * 100)}%</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-spy-800/30">
                  <p className="text-[10px] text-spy-400 font-mono">SAMPLES</p>
                  <p className="text-lg font-bold text-white font-mono">{calibration.sample_size}</p>
                </div>
              </div>
              {agentEstimates.length === 0 && (
                <div className="mt-3 p-3 rounded-lg bg-neon-amber/5 border border-neon-amber/20 flex items-start gap-2">
                  <AlertCircle size={14} className="text-neon-amber flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-neon-amber">
                    No historical data for this agent. Calibration will be available after completing their first mission.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {submitted && lastEstimate && (
            <div className="card-glass p-6 fade-in border-neon-purple/30 animate-glow">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-neon-purple" />
                Calibration Result
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-spy-800/40">
                  <div>
                    <p className="text-[10px] text-spy-400 font-mono uppercase">Original Estimate</p>
                    <p className="text-2xl font-bold text-white font-mono">
                      {lastEstimate.estimated} <span className="text-sm text-spy-300">{lastEstimate.unit}</span>
                    </p>
                  </div>
                  <div className="text-4xl text-spy-500">→</div>
                  <div className="text-right">
                    <p className="text-[10px] text-neon-purple font-mono uppercase">Calibrated Prediction</p>
                    {lastEstimate.calibrated ? (
                      <p className="text-2xl font-bold text-neon-purple font-mono text-glow">
                        {lastEstimate.calibrated} <span className="text-sm text-neon-purple/70">{lastEstimate.unit}</span>
                      </p>
                    ) : (
                      <p className="text-lg text-spy-400 font-mono">N/A (no data)</p>
                    )}
                  </div>
                </div>

                {lastEstimate.calibrated && (
                  <div className="p-3 rounded-lg bg-spy-800/30 text-center">
                    <p className="text-xs text-spy-300">
                      Based on <span className="text-neon-purple font-mono font-bold">{lastEstimate.ratio.toFixed(2)}x</span> weighted ratio
                      with <span className="text-neon-blue font-mono font-bold">{Math.round(lastEstimate.confidence * 100)}%</span> confidence
                    </p>
                    <p className="text-[10px] text-spy-400 mt-1">
                      {lastEstimate.agentName} typically takes {lastEstimate.ratio.toFixed(2)}x longer than estimated
                    </p>
                  </div>
                )}

                <button onClick={resetForm} className="btn-ghost w-full text-sm text-center">
                  Log Another Mission
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
