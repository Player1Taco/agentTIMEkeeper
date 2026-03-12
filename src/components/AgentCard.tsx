import React from 'react';
import { useStore } from '../store/useStore';
import { Trash2, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Agent } from '../types';

const agentAvatars = ['🦊', '🐺', '👻', '🐍', '🦅', '🐆', '🦇', '🐙', '🦎', '🐲'];

export const AgentCard: React.FC<{ agent: Agent; index: number }> = ({ agent, index }) => {
  const { deleteAgent, getCalibration } = useStore();
  const calibration = getCalibration(agent.id);
  const avatar = agentAvatars[index % agentAvatars.length];

  const getRatioColor = (ratio: number) => {
    if (ratio <= 1.2) return 'text-neon-green';
    if (ratio <= 1.5) return 'text-neon-amber';
    return 'text-neon-red';
  };

  const getConfidenceBar = (confidence: number) => {
    const width = Math.round(confidence * 100);
    return (
      <div className="w-full h-1.5 bg-spy-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-purple to-neon-blue rounded-full transition-all duration-1000"
          style={{ width: `${width}%` }}
        />
      </div>
    );
  };

  const getTrendIcon = () => {
    switch (calibration.trend) {
      case 'improving': return <TrendingDown size={14} className="text-neon-green" />;
      case 'declining': return <TrendingUp size={14} className="text-neon-red" />;
      default: return <Minus size={14} className="text-neon-amber" />;
    }
  };

  return (
    <div className="card-glass-hover p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-spy-600/30 flex items-center justify-center text-2xl border border-spy-500/20">
            {avatar}
          </div>
          <div>
            <h3 className="text-white font-semibold">{agent.codename}</h3>
            <a
              href={`https://x.com/${agent.x_handle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neon-blue hover:text-neon-blue/80 font-mono flex items-center gap-1 transition-colors"
            >
              {agent.x_handle} <ExternalLink size={10} />
            </a>
          </div>
        </div>
        <button
          onClick={() => {
            if (confirm(`Delete agent "${agent.codename}"? This will also remove all their estimates.`)) {
              deleteAgent(agent.id);
            }
          }}
          className="opacity-0 group-hover:opacity-100 text-spy-400 hover:text-neon-red transition-all duration-200 p-1.5 rounded-lg hover:bg-neon-red/10"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-spy-800/30">
          <p className="text-[10px] text-spy-400 font-mono uppercase">Missions</p>
          <p className="text-lg font-bold text-white font-mono">{agent.total_estimates}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-spy-800/30">
          <p className="text-[10px] text-spy-400 font-mono uppercase">Ratio</p>
          <p className={`text-lg font-bold font-mono ${getRatioColor(agent.avg_ratio)}`}>
            {agent.avg_ratio.toFixed(2)}x
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-spy-800/30">
          <p className="text-[10px] text-spy-400 font-mono uppercase">Trend</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {getTrendIcon()}
            <span className="text-xs text-spy-300 capitalize">{calibration.trend}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-spy-400 font-mono uppercase">Confidence</span>
          <span className="text-[10px] text-spy-300 font-mono">{Math.round(calibration.confidence * 100)}%</span>
        </div>
        {getConfidenceBar(calibration.confidence)}
      </div>

      <p className="text-[10px] text-spy-500 font-mono mt-3">
        Recruited {new Date(agent.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  );
};
