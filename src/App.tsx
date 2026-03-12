import React from 'react';
import { useStore } from './store/useStore';
import { SpyBackground } from './components/SpyBackground';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AgentForm } from './components/AgentForm';
import { EstimateForm } from './components/EstimateForm';
import { EstimateTable } from './components/EstimateTable';
import { BackfillForm } from './components/BackfillForm';
import { AuthModal } from './components/AuthModal';

const ViewRouter: React.FC = () => {
  const { currentView } = useStore();

  switch (currentView) {
    case 'dashboard': return <Dashboard />;
    case 'agents': return <AgentForm />;
    case 'new-estimate': return <EstimateForm />;
    case 'history': return <EstimateTable />;
    case 'backfill': return <BackfillForm />;
    default: return <Dashboard />;
  }
};

function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-spy-900">
      <SpyBackground />
      
      {/* Sidebar */}
      <div className="relative z-10 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <ViewRouter />
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default App;
