import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Database, Plus, CheckCircle2 } from 'lucide-react';
import type { TimeUnit } from '../types';

export const BackfillForm: React.FC = () => {
  const { agents, addBackfillEstimate } = useStore();
  const [entries, setEntries] = useState<{
    agent_id: string;
    task_description: string;
    estimated_time: string;
    actual_time: string;
    time_unit: TimeUnit;
    created_at: string;
  }[]>([{
    agent_id: '',
    task_description: '',
    estimated_time: '',
    actual_time: '',
    time_unit: 'hours',
    created_at: new Date().toISOString().split('T')[0],
  }]);
  const [submitted, setSubmitted] = useState(false);

  const addRow = () => {
    setEntries([...entries, {
      agent_id: entries[entries.length - 1]?.agent_id || '',
      task_description: '',
      estimated_time: '',
      actual_time: '',
      time_unit: 'hours',
      created_at: new Date().toISOString().split('T')[0],
    }]);
  };

  const updateEntry = (index: number, field: string, value: string) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    setEntries(updated);
  };

  const removeEntry = (index: number) => {
    if (entries.length <= 1) return;
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let count = 0;
    entries.forEach(entry => {
      if (!entry.agent_id || !entry.task_description || !entry.estimated_time) return;
      const est = parseFloat(entry.estimated_time);
      const act = entry.actual_time ? parseFloat(entry.actual_time) : null;
      addBackfillEstimate({
        agent_id: entry.agent_id,
        task_description: entry.task_description,
        estimated_time: est,
        time_unit: entry.time_unit,
        actual_time: act,
        calibrated_prediction: null,
        ratio: act ? act / est : null,
        created_at: new Date(entry.created_at).toISOString(),
        completed_at: act ? new Date(entry.created_at).toISOString() : null,
      });
      count++;
    });

    if (count > 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setEntries([{
          agent_id: '',
          task_description: '',
          estimated_time: '',
          actual_time: '',
          time_unit: 'hours',
          created_at: new Date().toISOString().split('T')[0],
        }]);
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="fade-in">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-glow">Intel Upload</span>
        </h2>
        <p className="text-spy-300 text-sm mt-1">Backfill historical estimation data to improve calibration accuracy</p>
      </div>

      {submitted ? (
        <div className="card-glass p-12 text-center fade-in">
          <CheckCircle2 size={48} className="text-neon-green mx-auto mb-4" />
          <p className="text-xl font-semibold text-white">Intel Uploaded Successfully</p>
          <p className="text-spy-300 text-sm mt-2">Historical data has been integrated into calibration models</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {entries.map((entry, index) => (
            <div key={index} className="card-glass p-5 fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-spy-400">RECORD #{index + 1}</span>
                {entries.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEntry(index)}
                    className="text-xs text-spy-400 hover:text-neon-red transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-1">
                  <label className="label-text">Agent</label>
                  <select
                    value={entry.agent_id}
                    onChange={(e) => updateEntry(index, 'agent_id', e.target.value)}
                    className="select-field text-sm"
                    required
                  >
                    <option value="">Select...</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>{a.codename}</option>
                    ))}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="label-text">Task</label>
                  <input
                    type="text"
                    value={entry.task_description}
                    onChange={(e) => updateEntry(index, 'task_description', e.target.value)}
                    placeholder="Task description"
                    className="input-field text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Estimated</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={entry.estimated_time}
                      onChange={(e) => updateEntry(index, 'estimated_time', e.target.value)}
                      placeholder="0"
                      min="0.1"
                      step="0.1"
                      className="input-field text-sm flex-1"
                      required
                    />
                    <select
                      value={entry.time_unit}
                      onChange={(e) => updateEntry(index, 'time_unit', e.target.value)}
                      className="select-field text-sm w-20"
                    >
                      <option value="hours">h</option>
                      <option value="days">d</option>
                      <option value="months">m</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-text">Actual</label>
                  <input
                    type="number"
                    value={entry.actual_time}
                    onChange={(e) => updateEntry(index, 'actual_time', e.target.value)}
                    placeholder="Optional"
                    min="0.1"
                    step="0.1"
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="label-text">Date</label>
                  <input
                    type="date"
                    value={entry.created_at}
                    onChange={(e) => updateEntry(index, 'created_at', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={addRow}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Another Record
            </button>
            <button type="submit" className="btn-primary flex items-center gap-2 text-sm">
              <Database size={16} />
              Upload {entries.length} Record{entries.length > 1 ? 's' : ''}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
