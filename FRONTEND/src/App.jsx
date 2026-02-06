import { useState } from 'react'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [dashboardTab, setDashboardTab] = useState('overview')

  const handleNavigate = (view, tab = 'overview') => {
    setCurrentView(view)
    if (view === 'dashboard') {
      setDashboardTab(tab)
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />
      case 'dashboard':
        return <Dashboard onBack={() => setCurrentView('landing')} initialTab={dashboardTab} />
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 m-0 p-0">
      {renderView()}
    </div>
  )
}

export default App
