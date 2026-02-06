import { Line, Bar } from 'react-chartjs-2'

const TrendsPage = ({ trends, analytics, statistics, selectedDistrict }) => {
  // District comparison data
  const getDistrictComparisonData = () => {
    if (!analytics?.district_stats) return null
    
    // If a specific district is selected, show only that district
    if (selectedDistrict && selectedDistrict !== 'All') {
      const districtData = analytics.district_stats.find(d => d.district === selectedDistrict)
      if (!districtData) return null
      
      return {
        labels: [districtData.district.split(' ').slice(0, 2).join(' ')],
        datasets: [
          {
            label: 'Biometric Updates',
            data: [districtData.total_biometric],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 6
          },
          {
            label: 'New Enrolments',
            data: [districtData.total_enrolment],
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderRadius: 6
          }
        ]
      }
    }
    
    // Otherwise show top 10 districts
    const topDistricts = analytics.district_stats.slice(0, 10)
    
    return {
      labels: topDistricts.map(d => d.district.split(' ').slice(0, 2).join(' ')),
      datasets: [
        {
          label: 'Biometric Updates',
          data: topDistricts.map(d => d.total_biometric),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderRadius: 6
        },
        {
          label: 'New Enrolments',
          data: topDistricts.map(d => d.total_enrolment),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderRadius: 6
        }
      ]
    }
  }

  // Monthly crowd distribution
  const getMonthlyCrowdData = () => {
    if (!analytics?.monthly_crowd) return null
    
    const months = [...new Set(analytics.monthly_crowd.map(m => m.month))].sort((a, b) => a - b)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    return {
      labels: months.map(m => monthNames[m - 1]),
      datasets: [
        {
          label: 'High Crowd Days',
          data: months.map(m => {
            const data = analytics.monthly_crowd.find(mc => mc.month === m && mc.crowd_level === 'High')
            return data ? data.count : 0
          }),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderRadius: 6
        },
        {
          label: 'Medium Crowd Days',
          data: months.map(m => {
            const data = analytics.monthly_crowd.find(mc => mc.month === m && mc.crowd_level === 'Medium')
            return data ? data.count : 0
          }),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderRadius: 6
        },
        {
          label: 'Low Crowd Days',
          data: months.map(m => {
            const data = analytics.monthly_crowd.find(mc => mc.month === m && mc.crowd_level === 'Low')
            return data ? data.count : 0
          }),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderRadius: 6
        }
      ]
    }
  }

  // Day-wise average comparison
  const getDayWiseComparisonData = () => {
    if (!analytics?.day_analysis) return null
    
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    return {
      labels: dayOrder,
      datasets: [
        {
          label: 'Avg Biometric Updates',
          data: dayOrder.map(day => analytics.day_analysis[day]?.total_biometric || 0),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Avg Enrolments',
          data: dayOrder.map(day => analytics.day_analysis[day]?.total_enrolment || 0),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
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

  const stackedBarOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        ...chartOptions.scales.x,
        stacked: true
      },
      y: {
        ...chartOptions.scales.y,
        stacked: true
      }
    }
  }

  const districtData = getDistrictComparisonData()
  const monthlyCrowdData = getMonthlyCrowdData()
  const dayWiseData = getDayWiseComparisonData()

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Behavioral Trends Analysis</h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Deep dive into district-wise patterns, crowd distribution, and comparative analytics
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Peak Day</p>
          <p className="text-2xl font-bold text-gray-900">{analytics?.peak_day || 'N/A'}</p>
          <p className="text-xs text-gray-400 mt-2">Highest traffic</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Peak Month</p>
          <p className="text-2xl font-bold text-gray-900">
            {analytics?.peak_month ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][analytics.peak_month - 1] : 'N/A'}
          </p>
          <p className="text-xs text-gray-400 mt-2">Maximum activity</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Active Districts</p>
          <p className="text-2xl font-bold text-gray-900">{analytics?.district_stats?.length || 0}</p>
          <p className="text-xs text-gray-400 mt-2">Tracked locations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Records</p>
          <p className="text-2xl font-bold text-gray-900">{(statistics?.total_records || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Data points</p>
        </div>
      </div>

      {/* District Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            {selectedDistrict && selectedDistrict !== 'All' 
              ? `${selectedDistrict} District Activity` 
              : 'Top 10 Districts by Activity'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Comparative analysis of biometric updates and enrolments
            {selectedDistrict && selectedDistrict !== 'All' && ' for selected district'}
          </p>
        </div>
        {districtData ? (
          <div className="h-96">
            <Bar data={districtData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <p>No district data available</p>
          </div>
        )}
      </div>

      {/* Monthly Crowd Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Monthly Crowd Level Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Stacked view of high, medium, and low crowd days per month
          </p>
        </div>
        {monthlyCrowdData ? (
          <>
            <div className="h-96">
              <Bar data={monthlyCrowdData} options={stackedBarOptions} />
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Pattern:</span> This shows how crowd levels vary throughout the year. 
                Green bars indicate more low-crowd days (better for visits), while red bars show high-crowd periods.
              </p>
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <p>No monthly crowd data available</p>
          </div>
        )}
      </div>

      {/* Day-wise Detailed Comparison */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Average Daily Activity Comparison</h3>
          <p className="text-sm text-gray-500 mt-1">
            Detailed breakdown of biometric updates vs new enrolments by day
          </p>
        </div>
        {dayWiseData ? (
          <>
            <div className="h-96">
              <Line data={dayWiseData} options={chartOptions} />
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Insight:</span> Biometric updates (blue) are consistently higher than new enrolments (orange), 
                indicating most visits are for updates rather than first-time registrations.
              </p>
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <p>No day-wise data available</p>
          </div>
        )}
      </div>

      {/* Behavioral Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Service Type Preference
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Biometric Updates</span>
              <span className="text-lg font-bold text-purple-600">
                {analytics?.total_biometric && analytics?.total_enrolment 
                  ? ((analytics.total_biometric / (analytics.total_biometric + analytics.total_enrolment)) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ 
                  width: `${analytics?.total_biometric && analytics?.total_enrolment 
                    ? ((analytics.total_biometric / (analytics.total_biometric + analytics.total_enrolment)) * 100)
                    : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Majority of visits are for biometric updates rather than new enrolments
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Best Time to Visit
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Recommended Days</span>
              <span className="text-sm font-semibold text-green-600">Mon, Wed, Sun</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white rounded-lg">
              <span className="text-sm text-gray-600">Avoid Days</span>
              <span className="text-sm font-semibold text-red-600">Thu, Tue, Sat</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Based on historical traffic patterns and crowd analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendsPage
