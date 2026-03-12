import React from 'react';
import { useStore } from '../store/useStore';
import { ClockWidget } from './ClockWidget';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  History,
  Database,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react';
import type { View } from '../types';

const navItems: { view: View; label: string; icon: React.ReactNode; description: string }[] = [
  { view: 'dashboard', label: 'Command Center', icon: <LayoutDashboard size={20} />, description: 'Overview & intel' },
  { view: 'agents', label: 'Agent Roster', icon: <Users size={20} />, description: 'Manage operatives' },
  { view: 'new-estimate', label: 'New Mission', icon: <PlusCircle size={20} />, description: 'Log time estimate' },
  { view: 'history', label: 'Mission Log', icon: <History size={20} />, description: 'Past operations' },
  { view: 'backfill', label: 'Intel Upload', icon: <Database size={20} />, description: 'Historical data' },
];

export const Sidebar: React.FC = () => {
  const { currentView, setView, sidebarOpen, setSidebarOpen, user, setUser } = useStore();

  return (
    <aside
      className={`relative flex flex-col h-full bg-spy-800/60 backdrop-blur-xl border-r border-spy-500/20 transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-20'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-8 z-20 w-6 h-6 bg-spy-700 border border-spy-500/30 rounded-full flex items-center justify-center text-spy-300 hover:text-neon-purple hover:border-neon-purple/50 transition-all duration-200"
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Header */}
      <div className="p-6 border-b border-spy-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="fade-in">
              <h1 className="text-sm font-bold text-white tracking-wider uppercase">Time Calibrator</h1>
              <p className="text-[10px] text-spy-300 font-mono tracking-widest">CLASSIFIED • v1.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Clock */}
      {sidebarOpen && (
        <div className="px-6 py-5 border-b border-spy-500/20">
          <ClockWidget />
          <p className="text-center text-[10px] text-spy-300 font-mono mt-3 tracking-widest uppercase">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.view
                ? 'bg-neon-purple/15 text-neon-purple border border-neon-purple/20'
                : 'text-spy-200 hover:bg-spy-600/30 hover:text-white border border-transparent'
            }`}
          >
            <span className={`flex-shrink-0 ${currentView === item.view ? 'text-neon-purple' : 'text-spy-300 group-hover:text-neon-purple/70'}`}>
              {item.icon}
            </span>
            {sidebarOpen && (
              <div className="text-left">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-[10px] text-spy-400">{item.description}</p>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-spy-500/20">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-spy-200 truncate font-mono">{user.email}</p>
                <button
                  onClick={() => setUser(null)}
                  className="text-[10px] text-spy-400 hover:text-neon-red flex items-center gap-1 mt-0.5 transition-colors"
                >
                  <LogOut size={10} /> Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => useStore.getState().setAuthModalOpen(true)}
            className={`w-full btn-primary text-sm ${!sidebarOpen ? 'px-2' : ''}`}
          >
            {sidebarOpen ? 'Authenticate' : '🔑'}
          </button>
        )}
      </div>
    </aside>
  );
};
