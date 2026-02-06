const DashboardHeader = ({ selectedDistrict, setSelectedDistrict, districts, totalRecords }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-5 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Aadhaar Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            ML-Powered insights from {totalRecords?.toLocaleString() || 0} records
            {selectedDistrict !== 'All' && ` • ${selectedDistrict} District`}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Real-time Data</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option value="All">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader
