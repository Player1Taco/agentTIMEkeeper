import React from 'react';
import { useStore } from '../store/useStore';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Users,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Timer,
  Zap,
} from 'lucide-react';

const StatCard: React.FC<{
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}> = ({ label, value, subtitle, icon, color, delay = 0 }) => (
  <div className={`card-glass p-5 fade-in`} style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className="text-[10px] font-mono text-spy-400 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-2xl font-bold text-white font-mono count-up">{value}</p>
    {subtitle && <p className="text-xs text-spy-300 mt-1">{subtitle}</p>}
  </div>
);

export const Dashboard: React.FC = () => {
  const { agents, estimates, getCalibration } = useStore();

  const totalEstimates = estimates.length;
  const completedEstimates = estimates.filter(e => e.status === 'completed').length;
  const pendingEstimates = estimates.filter(e => e.status !== 'completed').length;
  const avgRatio = agents.length > 0
    ? agents.reduce((sum, a) => sum + a.avg_ratio, 0) / agents.length
    : 1.0;

  // Best and worst agents
  const sortedAgents = [...agents].sort((a, b) => Math.abs(1 - a.avg_ratio) - Math.abs(1 - b.avg_ratio));
  const bestAgent = sortedAgents[0];
  const worstAgent = sortedAgents[sortedAgents.length - 1];

  // Recent activity
  const recentEstimates = [...estimates]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown size={14} className="text-neon-green" />;
      case 'declining': return <TrendingUp size={14} className="text-neon-red" />;
      default: return <Minus size={14} className="text-neon-amber" />;
    }
  };

  const getRatioColor = (ratio: number) => {
    if (ratio <= 1.2) return 'text-neon-green';
    if (ratio <= 1.5) return 'text-neon-amber';
    return 'text-neon-red';
  };

  const getRatioBg = (ratio: number) => {
    if (ratio <= 1.2) return 'bg-neon-green/10 border-neon-green/20';
    if (ratio <= 1.5) return 'bg-neon-amber/10 border-neon-amber/20';
    return 'bg-neon-red/10 border-neon-red/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-glow">Command Center</span>
          <span className="text-[10px] font-mono text-spy-400 bg-spy-700/50 px-2 py-1 rounded-md border border-spy-500/20">
            LIVE
          </span>
        </h2>
        <p className="text-spy-300 text-sm mt-1">Real-time calibration intelligence overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Agents"
          value={agents.length}
          subtitle="Active operatives"
          icon={<Users size={20} className="text-neon-purple" />}
          color="bg-neon-purple/15"
          delay={100}
        />
        <StatCard
          label="Missions"
          value={totalEstimates}
          subtitle={`${completedEstimates} completed`}
          icon={<Target size={20} className="text-neon-blue" />}
          color="bg-neon-blue/15"
          delay={200}
        />
        <StatCard
          label="Avg Ratio"
          value={avgRatio.toFixed(2) + 'x'}
          subtitle={avgRatio <= 1.3 ? 'Good accuracy' : 'Needs calibration'}
          icon={<Activity size={20} className="text-neon-green" />}
          color="bg-neon-green/15"
          delay={300}
        />
        <StatCard
          label="Pending"
          value={pendingEstimates}
          subtitle="Awaiting completion"
          icon={<Timer size={20} className="text-neon-amber" />}
          color="bg-neon-amber/15"
          delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Leaderboard */}
        <div className="card-glass p-6 fade-in fade-in-delay-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap size={18} className="text-neon-purple" />
            Agent Calibration Leaderboard
          </h3>
          <div className="space-y-3">
            {sortedAgents.map((agent, index) => {
              const calibration = getCalibration(agent.id);
              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-spy-800/30 border border-spy-500/10 hover:border-spy-500/30 transition-all duration-200"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-mono ${
                    index === 0 ? 'bg-neon-green/20 text-neon-green' :
                    index === sortedAgents.length - 1 ? 'bg-neon-red/20 text-neon-red' :
                    'bg-spy-600/30 text-spy-300'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{agent.codename}</p>
                    <p className="text-[10px] text-spy-400 font-mono">{agent.x_handle}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold font-mono ${getRatioColor(agent.avg_ratio)}`}>
                      {agent.avg_ratio.toFixed(2)}x
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {getTrendIcon(calibration.trend)}
                      <span className="text-[10px] text-spy-400">{calibration.sample_size} missions</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-glass p-6 fade-in fade-in-delay-3">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-neon-blue" />
            Recent Operations
          </h3>
          <div className="space-y-3">
            {recentEstimates.map((est) => {
              const agent = agents.find(a => a.id === est.agent_id);
              return (
                <div
                  key={est.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-spy-800/30 border border-spy-500/10"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    est.status === 'completed' ? 'bg-neon-green/15' :
                    est.status === 'calibrated' ? 'bg-neon-blue/15' :
                    'bg-neon-amber/15'
                  }`}>
                    {est.status === 'completed' ? <CheckCircle2 size={16} className="text-neon-green" /> :
                     est.status === 'calibrated' ? <Target size={16} className="text-neon-blue" /> :
                     <AlertTriangle size={16} className="text-neon-amber" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{est.task_description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-spy-400 font-mono">{agent?.codename || 'Unknown'}</span>
                      <span className="text-spy-500">•</span>
                      <span className="text-[10px] text-spy-400 font-mono">
                        Est: {est.estimated_time}{est.time_unit[0]}
                        {est.actual_time && ` → Act: ${est.actual_time}${est.time_unit[0]}`}
                      </span>
                    </div>
                  </div>
                  {est.ratio && (
                    <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border ${getRatioBg(est.ratio)} ${getRatioColor(est.ratio)}`}>
                      {est.ratio.toFixed(2)}x
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calibration Insight */}
      {bestAgent && worstAgent && agents.length > 1 && (
        <div className="card-glass p-6 fade-in fade-in-delay-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={18} className="text-neon-pink" />
            Intelligence Brief
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
              <p className="text-[10px] text-neon-green font-mono uppercase tracking-wider mb-2">Most Accurate</p>
              <p className="text-white font-semibold">{bestAgent.codename}</p>
              <p className="text-spy-300 text-sm mt-1">
                Ratio of <span className="text-neon-green font-mono font-bold">{bestAgent.avg_ratio.toFixed(2)}x</span> — 
                {bestAgent.avg_ratio <= 1.2 ? ' Exceptional precision' : ' Reliable estimates'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neon-red/5 border border-neon-red/20">
              <p className="text-[10px] text-neon-red font-mono uppercase tracking-wider mb-2">Needs Calibration</p>
              <p className="text-white font-semibold">{worstAgent.codename}</p>
              <p className="text-spy-300 text-sm mt-1">
                Ratio of <span className="text-neon-red font-mono font-bold">{worstAgent.avg_ratio.toFixed(2)}x</span> — 
                {worstAgent.avg_ratio >= 2 ? ' Significant underestimation' : ' Moderate drift detected'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
