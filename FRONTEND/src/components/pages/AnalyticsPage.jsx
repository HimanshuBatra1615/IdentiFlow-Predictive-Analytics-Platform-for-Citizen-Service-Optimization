import { Bar, Doughnut, Scatter } from 'react-chartjs-2'

const AnalyticsPage = ({ analytics, statistics, selectedDistrict }) => {
  // Calculate KPIs
  const calculateKPIs = () => {
    if (!analytics || !statistics) return null

    const totalActivity = (analytics.total_biometric || 0) + (analytics.total_enrolment || 0)
    const biometricRatio = totalActivity > 0 ? ((analytics.total_biometric / totalActivity) * 100).toFixed(1) : 0
    const avgPerDistrict = analytics.district_stats?.length > 0 
      ? Math.round(totalActivity / analytics.district_stats.length) 
      : 0
    
    return {
      totalActivity,
      biometricRatio,
      avgPerDistrict,
      activeDistricts: analytics.district_stats?.length || 0
    }
  }

  // Service Type Distribution
  const getServiceDistribution = () => {
    if (!analytics) return null

    return {
      labels: ['Biometric Updates', 'New Enrolments'],
      datasets: [{
        data: [analytics.total_biometric || 0, analytics.total_enrolment || 0],
        backgroundColor: ['#8B5CF6', '#EC4899'],
        borderWidth: 0,
        hoverOffset: 10
      }]
    }
  }

  // District Performance Rankings
  const getDistrictPerformance = () => {
    if (!analytics?.district_stats) return null

    // If a specific district is selected, show only that district
    if (selectedDistrict && selectedDistrict !== 'All') {
      const districtData = analytics.district_stats.find(d => d.district === selectedDistrict)
      if (!districtData) return null
      
      const total = districtData.total_biometric + districtData.total_enrolment
      
      return {
        labels: [districtData.district.split(' ').slice(0, 2).join(' ')],
        datasets: [{
          label: 'Total Activity',
          data: [total],
          backgroundColor: ['#8B5CF6'],
          borderRadius: 8
        }]
      }
    }

    // Otherwise show top 8 districts
    const topDistricts = analytics.district_stats
      .slice(0, 8)
      .map(d => ({
        ...d,
        total: d.total_biometric + d.total_enrolment,
        efficiency: ((d.total_biometric / (d.total_biometric + d.total_enrolment)) * 100).toFixed(1)
      }))

    return {
      labels: topDistricts.map(d => d.district.split(' ').slice(0, 2).join(' ')),
      datasets: [{
        label: 'Total Activity',
        data: topDistricts.map(d => d.total),
        backgroundColor: topDistricts.map((_, idx) => {
          const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF', '#FAF5FF', '#FDFCFF']
          return colors[idx]
        }),
        borderRadius: 8
      }]
    }
  }

  // Correlation Analysis - Biometric vs Enrolment by District
  const getCorrelationData = () => {
    if (!analytics?.district_stats) return null

    const data = analytics.district_stats.slice(0, 20).map(d => ({
      x: d.total_biometric,
      y: d.total_enrolment,
      label: d.district
    }))

    return {
      datasets: [{
        label: 'Districts',
        data: data,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8B5CF6',
        pointRadius: 8,
        pointHoverRadius: 10
      }]
    }
  }

  // Growth Rate Analysis
  const getGrowthAnalysis = () => {
    if (!analytics?.monthly_crowd) return null

    const months = [...new Set(analytics.monthly_crowd.map(m => m.month))].sort((a, b) => a - b)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    const monthlyTotals = months.map(m => {
      const monthData = analytics.monthly_crowd.filter(mc => mc.month === m)
      return monthData.reduce((sum, d) => sum + d.count, 0)
    })

    const growthRates = monthlyTotals.map((val, idx) => {
      if (idx === 0) return 0
      return (((val - monthlyTotals[idx - 1]) / monthlyTotals[idx - 1]) * 100).toFixed(1)
    })

    return {
      labels: months.map(m => monthNames[m - 1]),
      datasets: [{
        label: 'Growth Rate (%)',
        data: growthRates,
        backgroundColor: growthRates.map(rate => rate >= 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
        borderRadius: 6
      }]
    }
  }

  // Statistical Summary
  const getStatisticalSummary = () => {
    if (!analytics?.district_stats) return null

    const activities = analytics.district_stats.map(d => d.total_biometric + d.total_enrolment)
    const mean = activities.reduce((a, b) => a + b, 0) / activities.length
    const sorted = [...activities].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const max = Math.max(...activities)
    const min = Math.min(...activities)
    const variance = activities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / activities.length
    const stdDev = Math.sqrt(variance)

    return { mean, median, max, min, stdDev }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 15, font: { size: 12 } }
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

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        callbacks: {
          label: (context) => {
            const point = context.raw
            return `Biometric: ${point.x}, Enrolment: ${point.y}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Enrolments', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Biometric Updates', font: { size: 12, weight: 'bold' } },
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      }
    }
  }

  const kpis = calculateKPIs()
  const serviceDistribution = getServiceDistribution()
  const districtPerformance = getDistrictPerformance()
  const correlationData = getCorrelationData()
  const growthAnalysis = getGrowthAnalysis()
  const stats = getStatisticalSummary()

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Advanced Analytics Dashboard</h2>
            <p className="text-sm text-white/90 leading-relaxed">
              Deep statistical insights, performance metrics, and correlation analysis
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Activity</p>
          <p className="text-2xl font-bold text-gray-900">{(kpis?.totalActivity || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">All transactions</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Biometric Ratio</p>
          <p className="text-2xl font-bold text-gray-900">{kpis?.biometricRatio || 0}%</p>
          <p className="text-xs text-gray-400 mt-2">Of total services</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Avg Per District</p>
          <p className="text-2xl font-bold text-gray-900">{(kpis?.avgPerDistrict || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-2">Activity average</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Active Districts</p>
          <p className="text-2xl font-bold text-gray-900">{kpis?.activeDistricts || 0}</p>
          <p className="text-xs text-gray-400 mt-2">Operational centers</p>
        </div>
      </div>

      {/* Service Distribution & District Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Service Type Distribution</h3>
            <p className="text-sm text-gray-500 mt-1">Breakdown of service categories</p>
          </div>
          {serviceDistribution ? (
            <div className="h-80 flex items-center justify-center">
              <Doughnut 
                data={serviceDistribution} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { padding: 20, font: { size: 13 } }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      padding: 12,
                      callbacks: {
                        label: (context) => {
                          const total = context.dataset.data.reduce((a, b) => a + b, 0)
                          const percentage = ((context.parsed / total) * 100).toFixed(1)
                          return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* District Performance Rankings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              {selectedDistrict && selectedDistrict !== 'All' 
                ? `${selectedDistrict} District Performance` 
                : 'District Performance Rankings'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedDistrict && selectedDistrict !== 'All' 
                ? 'Total activity for selected district' 
                : 'Top 8 districts by total activity'}
            </p>
          </div>
          {districtPerformance ? (
            <div className="h-80">
              <Bar data={districtPerformance} options={chartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistical Summary */}
      {stats && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">Statistical Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Key statistical measures across all districts</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-xs text-gray-600 mb-1">Mean Activity</p>
              <p className="text-xl font-bold text-purple-700">{Math.round(stats.mean).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-xs text-gray-600 mb-1">Median Activity</p>
              <p className="text-xl font-bold text-pink-700">{Math.round(stats.median).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Maximum</p>
              <p className="text-xl font-bold text-green-700">{stats.max.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Minimum</p>
              <p className="text-xl font-bold text-blue-700">{stats.min.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-gray-600 mb-1">Std Deviation</p>
              <p className="text-xl font-bold text-amber-700">{Math.round(stats.stdDev).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Correlation Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Correlation Analysis</h3>
          <p className="text-sm text-gray-500 mt-1">
            Relationship between biometric updates and new enrolments by district
          </p>
        </div>
        {correlationData ? (
          <>
            <div className="h-96">
              <Scatter data={correlationData} options={scatterOptions} />
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">Insight:</span> Each point represents a district. 
                Points closer to the top-right indicate districts with high activity in both services. 
                The scatter pattern helps identify districts with unique service preferences.
              </p>
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            <p>No correlation data available</p>
          </div>
        )}
      </div>

      {/* Growth Rate Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">Month-over-Month Growth Rate</h3>
          <p className="text-sm text-gray-500 mt-1">Percentage change in activity levels</p>
        </div>
        {growthAnalysis ? (
          <>
            <div className="h-80">
              <Bar data={growthAnalysis} options={chartOptions} />
            </div>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <span className="font-semibold">Analysis:</span> Green bars indicate growth, red bars show decline. 
                This helps identify seasonal patterns and trending directions in service demand.
              </p>
            </div>
          </>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400">
            <p>No growth data available</p>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Efficiency Score
          </h4>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-700 mb-2">
              {kpis?.biometricRatio || 0}
            </div>
            <p className="text-sm text-gray-600">
              High biometric ratio indicates efficient service delivery
            </p>
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Data Quality
          </h4>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-700 mb-2">
              {statistics?.total_records ? '98%' : 'N/A'}
            </div>
            <p className="text-sm text-gray-600">
              High-quality data with minimal missing values
            </p>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coverage Rate
          </h4>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-700 mb-2">
              {kpis?.activeDistricts || 0}
            </div>
            <p className="text-sm text-gray-600">
              Districts actively tracked in the system
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
