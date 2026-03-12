import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { AgentCard } from './AgentCard';
import { UserPlus, Users } from 'lucide-react';

export const AgentForm: React.FC = () => {
  const { agents, addAgent } = useStore();
  const [codename, setCodename] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codename.trim() || !xHandle.trim()) return;

    addAgent({
      codename: codename.trim(),
      x_handle: xHandle.startsWith('@') ? xHandle.trim() : `@${xHandle.trim()}`,
      avatar_seed: Math.random().toString(36).substring(7),
    });

    setCodename('');
    setXHandle('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between fade-in">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-glow">Agent Roster</span>
            <span className="text-xs font-mono text-spy-400 bg-spy-700/50 px-2 py-1 rounded-md border border-spy-500/20">
              {agents.length} ACTIVE
            </span>
          </h2>
          <p className="text-spy-300 text-sm mt-1">Manage your field operatives</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <UserPlus size={16} />
          {showForm ? 'Cancel' : 'Recruit Agent'}
        </button>
      </div>

      {/* Add Agent Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card-glass p-6 fade-in">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus size={18} className="text-neon-purple" />
            New Agent Recruitment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Codename</label>
              <input
                type="text"
                value={codename}
                onChange={(e) => setCodename(e.target.value)}
                placeholder="e.g. Shadow Fox"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label-text">X Handle (Owner)</label>
              <input
                type="text"
                value={xHandle}
                onChange={(e) => setXHandle(e.target.value)}
                placeholder="e.g. @shadowfox_dev"
                className="input-field"
                required
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="btn-primary text-sm">
              Confirm Recruitment
            </button>
          </div>
        </form>
      )}

      {/* Agent Grid */}
      {agents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} index={index} />
          ))}
        </div>
      ) : (
        <div className="card-glass p-12 text-center">
          <Users size={48} className="text-spy-500 mx-auto mb-4" />
          <p className="text-spy-300 text-lg">No agents recruited yet</p>
          <p className="text-spy-400 text-sm mt-1">Click "Recruit Agent" to add your first operative</p>
        </div>
      )}
    </div>
  );
};
