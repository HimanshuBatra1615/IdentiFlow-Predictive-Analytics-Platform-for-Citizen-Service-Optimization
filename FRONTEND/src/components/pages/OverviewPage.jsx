import { Line, Bar, Doughnut } from 'react-chartjs-2'

const OverviewPage = ({ statistics, analytics, trends, districts, predictions, selectedDistrict }) => {
  const getWeeklyPatternData = () => {
    if (!trends?.by_day) return null
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const data = dayOrder.map(day => Math.round(trends.by_day[day] || 0))
    
    return {
      labels: dayOrder,
      datasets: [{
        label: 'Average Daily Visits',
        data: data,
        backgroundColor: data.map(value => {
          if (value > Math.max(...data) * 0.8) return 'rgba(239, 68, 68, 0.8)'
          if (value > Math.max(...data) * 0.6) return 'rgba(245, 158, 11, 0.8)'
          return 'rgba(16, 185, 129, 0.8)'
        }),
        borderWidth: 0,
        borderRadius: 8
      }]
    }
  }

  const getMonthlyTrendData = () => {
    if (!trends?.monthly) return null
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const monthlyData = trends.monthly.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })
    
    return {
      labels: monthlyData.map(m => m.year_month || `${monthNames[m.month - 1]} ${m.year}`),
      datasets: [
        {
          label: 'Biometric Updates',
          data: monthlyData.map(m => Math.round(m.total_biometric)),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'New Enrolments',
          data: monthlyData.map(m => Math.round(m.total_enrolment)),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  }

  const getCrowdDistributionData = () => {
    if (!statistics?.crowd_distribution) return null
    
    const dist = statistics.crowd_distribution
    const total = Object.values(dist).reduce((a, b) => a + b, 0)
    
    return {
      labels: ['High Demand', 'Medium Demand', 'Low Demand'],
      datasets: [{
        data: [
          Math.round((dist.High || 0) / total * 100),
          Math.round((dist.Medium || 0) / total * 100),
          Math.round((dist.Low || 0) / total * 100)
        ],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderWidth: 0
      }]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  }

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { display: false }
    }
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: { size: 12 },
          generateLabels: (chart) => {
            const data = chart.data
            return data.labels.map((label, i) => ({
              text: `${label}: ${data.datasets[0].data[i]}%`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: false,
              index: i
            }))
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  }

  const weeklyData = getWeeklyPatternData()
  const monthlyData = getMonthlyTrendData()
  const crowdDistData = getCrowdDistributionData()

  return (
    <div className="p-8 space-y-6">
      {/* Problem Statement Alert Banner */}
      <div className="bg-gradient-to-r from-[#A91D3A] to-[#8B1538] rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Mission: Improving Aadhaar Service Accessibility</h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Analyzing {statistics?.total_records?.toLocaleString()} records with ML to identify trends, predict demand, 
              and notify citizens about optimal visit times—reducing congestion and improving accessibility.
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Live Data</span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Records Analyzed</p>
          <p className="text-3xl font-bold text-gray-900">{(statistics?.total_records || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">From ML dataset</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Avg</span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Avg Enrolment per Day</p>
          <p className="text-3xl font-bold text-gray-900">{Math.round(statistics?.avg_enrolment || 0)}</p>
          <p className="text-xs text-gray-400 mt-2">Per center per day</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Updates</span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Avg Biometric Updates</p>
          <p className="text-3xl font-bold text-gray-900">{Math.round(statistics?.avg_biometric || 0)}</p>
          <p className="text-xs text-gray-400 mt-2">Per center per day</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">AP</span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Districts Covered</p>
          <p className="text-3xl font-bold text-gray-900">{districts.length}</p>
          <p className="text-xs text-gray-400 mt-2">Andhra Pradesh</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Pattern */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Weekly Behavioral Pattern</h3>
              <p className="text-sm text-gray-500 mt-1">Average visits by day of week</p>
            </div>
          </div>
          {weeklyData && (
            <div className="h-80">
              <Bar data={weeklyData} options={barChartOptions} />
            </div>
          )}
        </div>

        {/* Crowd Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Crowd Distribution</h3>
            <p className="text-sm text-gray-500 mt-1">From actual data</p>
          </div>
          <div className="p-6">
            {crowdDistData && (
              <div className="h-64">
                <Doughnut data={crowdDistData} options={doughnutOptions} />
              </div>
            )}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">High Demand Days:</span>
                <span className="font-bold text-red-600">{statistics?.crowd_distribution?.High || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Medium Demand Days:</span>
                <span className="font-bold text-yellow-600">{statistics?.crowd_distribution?.Medium || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Low Demand Days:</span>
                <span className="font-bold text-green-600">{statistics?.crowd_distribution?.Low || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick ML Predictions Preview */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">ML Predictions Available</h3>
            <p className="text-sm text-white/90">
              View AI-powered 7-day forecasts and optimal visit recommendations
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        
        {/* Mini Preview */}
        {predictions && predictions.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-white/70 mb-1">Low Crowd Days</p>
              <p className="text-2xl font-bold">{predictions.filter(p => p.success && p.prediction === 'Low').length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-white/70 mb-1">Medium Days</p>
              <p className="text-2xl font-bold">{predictions.filter(p => p.success && p.prediction === 'Medium').length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-xs text-white/70 mb-1">High Crowd Days</p>
              <p className="text-2xl font-bold">{predictions.filter(p => p.success && p.prediction === 'High').length}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-predictions'))}
            className="px-6 py-2.5 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Full Predictions
          </button>
          <div className="flex items-center space-x-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Powered by LightGBM ML Model</span>
          </div>
        </div>
      </div>

      {/* District Performance Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Top Districts by Activity</h3>
            <p className="text-sm text-gray-500 mt-1">Most active Aadhaar centers</p>
          </div>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
        <div className="space-y-3">
          {analytics?.district_stats?.slice(0, 5).map((district, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                  idx === 1 ? 'bg-gray-200 text-gray-700' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{district.district}</p>
                  <p className="text-xs text-gray-500">{district.total_biometric.toLocaleString()} biometric updates</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{district.total_enrolment.toLocaleString()}</p>
                <p className="text-xs text-gray-500">enrolments</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Data Coverage</p>
          <p className="text-2xl font-bold text-gray-900">
            {statistics?.date_range ? 
              `${new Date(statistics.date_range.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(statistics.date_range.end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
              : 'N/A'}
          </p>
          <p className="text-xs text-gray-500 mt-2">Time period analyzed</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Biometric Updates</p>
          <p className="text-2xl font-bold text-gray-900">{(analytics?.total_biometric || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Across all districts</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total New Enrolments</p>
          <p className="text-2xl font-bold text-gray-900">{(analytics?.total_enrolment || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">First-time registrations</p>
        </div>
      </div>

      {/* Monthly Trends - Removed */}

      {/* Data Source Info - Removed */}
    </div>
  )
}

export default OverviewPage
