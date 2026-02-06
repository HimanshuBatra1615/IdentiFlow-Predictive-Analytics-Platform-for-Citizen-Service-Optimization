const Sidebar = ({ activeTab, setActiveTab, onBack }) => {
  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      )
    },
    {
      id: 'predictions',
      label: 'ML Predictions',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    },
    {
      id: 'trends',
      label: 'Behavioral Trends',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    }
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-[#2C3E50] to-[#1A252F] text-white flex flex-col shadow-2xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
            <img 
              src="/image.png" 
              alt="AadhaarFlow Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg">AadhaarFlow</h2>
            <p className="text-xs text-gray-400">Analytics</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-[#34495E] text-white shadow-lg' 
                : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <button 
        onClick={onBack}
        className="m-4 flex items-center justify-center space-x-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[#A91D3A] to-[#8B1538] hover:from-[#8B1538] hover:to-[#6B0F2A] text-white transition-all shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Home</span>
      </button>
    </div>
  )
}

export default Sidebar
