import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { History, CheckCircle2, Clock, Target, ChevronDown, ChevronUp } from 'lucide-react';

export const EstimateTable: React.FC = () => {
  const { estimates, agents, completeEstimate } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'calibrated' | 'completed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actualTimeInput, setActualTimeInput] = useState('');

  const filtered = estimates
    .filter(e => filter === 'all' || e.status === filter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleComplete = (id: string) => {
    const time = parseFloat(actualTimeInput);
    if (isNaN(time) || time <= 0) return;
    completeEstimate(id, time);
    setExpandedId(null);
    setActualTimeInput('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">COMPLETED</span>;
      case 'calibrated':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">CALIBRATED</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-amber/10 text-neon-amber border border-neon-amber/20">PENDING</span>;
    }
  };

  const getRatioColor = (ratio: number) => {
    if (ratio <= 1.2) return 'text-neon-green';
    if (ratio <= 1.5) return 'text-neon-amber';
    return 'text-neon-red';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-glow">Mission Log</span>
            <span className="text-xs font-mono text-spy-400 bg-spy-700/50 px-2 py-1 rounded-md border border-spy-500/20">
              {estimates.length} RECORDS
            </span>
          </h2>
          <p className="text-spy-300 text-sm mt-1">Complete history of all operations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 fade-in fade-in-delay-1">
        {(['all', 'pending', 'calibrated', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? 'bg-neon-purple/15 text-neon-purple border border-neon-purple/30'
                : 'text-spy-300 hover:text-white hover:bg-spy-600/30 border border-transparent'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-[10px] font-mono opacity-60">
              ({f === 'all' ? estimates.length : estimates.filter(e => e.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden fade-in fade-in-delay-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-spy-500/20">
                <th className="text-left text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Agent</th>
                <th className="text-left text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Mission</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Estimated</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Calibrated</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Actual</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Ratio</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-center text-[10px] font-mono text-spy-400 uppercase tracking-wider px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((est) => {
                const agent = agents.find(a => a.id === est.agent_id);
                const isExpanded = expandedId === est.id;
                return (
                  <React.Fragment key={est.id}>
                    <tr className="border-b border-spy-500/10 hover:bg-spy-700/20 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-sm text-white font-medium">{agent?.codename || '—'}</p>
                        <p className="text-[10px] text-spy-400 font-mono">{agent?.x_handle}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-spy-100 max-w-[200px] truncate">{est.task_description}</p>
                        <p className="text-[10px] text-spy-500 font-mono">
                          {new Date(est.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className="text-sm text-white font-mono">{est.estimated_time}{est.time_unit[0]}</span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        {est.calibrated_prediction ? (
                          <span className="text-sm text-neon-purple font-mono font-bold">{est.calibrated_prediction}{est.time_unit[0]}</span>
                        ) : (
                          <span className="text-sm text-spy-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {est.actual_time ? (
                          <span className="text-sm text-white font-mono">{est.actual_time}{est.time_unit[0]}</span>
                        ) : (
                          <span className="text-sm text-spy-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {est.ratio ? (
                          <span className={`text-sm font-mono font-bold ${getRatioColor(est.ratio)}`}>
                            {est.ratio.toFixed(2)}x
                          </span>
                        ) : (
                          <span className="text-sm text-spy-500">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {getStatusBadge(est.status)}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {est.status !== 'completed' && (
                          <button
                            onClick={() => {
                              setExpandedId(isExpanded ? null : est.id);
                              setActualTimeInput('');
                            }}
                            className="text-xs text-neon-green hover:text-neon-green/80 font-mono flex items-center gap-1 mx-auto transition-colors"
                          >
                            Complete {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-spy-700/20">
                        <td colSpan={8} className="px-5 py-4">
                          <div className="flex items-center gap-4 max-w-md">
                            <div className="flex-1">
                              <label className="text-[10px] text-spy-400 font-mono uppercase block mb-1">
                                Actual Time ({est.time_unit})
                              </label>
                              <input
                                type="number"
                                value={actualTimeInput}
                                onChange={(e) => setActualTimeInput(e.target.value)}
                                placeholder="0"
                                min="0.1"
                                step="0.1"
                                className="input-field text-sm py-2"
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => handleComplete(est.id)}
                              className="btn-primary text-sm mt-5 flex items-center gap-1"
                            >
                              <CheckCircle2 size={14} />
                              Confirm
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <History size={48} className="text-spy-500 mx-auto mb-4" />
            <p className="text-spy-300 text-lg">No missions found</p>
            <p className="text-spy-400 text-sm mt-1">
              {filter !== 'all' ? 'Try changing the filter' : 'Start by logging a new mission'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
