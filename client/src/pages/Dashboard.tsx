import { useState } from 'react';

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <div className="w-64 bg-primary text-primary-foreground p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-8">BB50 Dashboard</h1>
          <nav className="space-y-2">
            <button onClick={() => setActiveNav('overview')} className="w-full text-left px-4 py-2 rounded">Overview</button>
            <button onClick={() => setActiveNav('validation')} className="w-full text-left px-4 py-2 rounded">Validation</button>
            <button onClick={() => setActiveNav('files')} className="w-full text-left px-4 py-2 rounded">Files</button>
            <button onClick={() => setActiveNav('deployment')} className="w-full text-left px-4 py-2 rounded">Deployment</button>
          </nav>
        </div>
        <div className="flex-1 p-8 overflow-auto">
          {activeNav === 'overview' && <div><h2 className="text-3xl font-bold mb-4">Overview</h2><p>BenefitBridge 50+ Dashboard Ready for Deployment</p></div>}
          {activeNav === 'validation' && <div><h2 className="text-3xl font-bold mb-4">Validation</h2><p>All systems validated and ready</p></div>}
          {activeNav === 'files' && <div><h2 className="text-3xl font-bold mb-4">Files</h2><p>Deployment files prepared</p></div>}
          {activeNav === 'deployment' && <div><h2 className="text-3xl font-bold mb-4">Deployment</h2><p>Ready to deploy to Netlify + Railway</p></div>}
        </div>
      </div>
    </div>
  );
}
