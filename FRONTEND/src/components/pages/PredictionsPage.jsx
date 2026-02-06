import { Line } from 'react-chartjs-2'

const PredictionsPage = ({ predictions, selectedDistrict }) => {
  // Check if any predictions have warnings
  const hasWarnings = predictions && predictions.some(p => p.warning || (p.success && p.district_in_training === false))
  
  const getOptimalDays = () => {
    if (!predictions || predictions.length === 0) {
      return []
    }
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const today = new Date()
    
    const allDays = predictions
      .map((pred, idx) => {
        const date = new Date(today)
        date.setDate(date.getDate() + idx)
        const dayName = dayNames[date.getDay()]
        
        if (!pred.success || !pred.probabilities) {
          return null
        }
        
        const lowProb = (pred.probabilities.Low || 0) * 100
        const mediumProb = (pred.probabilities.Medium || 0) * 100
        const highProb = (pred.probabilities.High || 0) * 100
        
        let crowdLevel = 'High'
        let confidence = highProb
        
        if (lowProb > mediumProb && lowProb > highProb) {
          crowdLevel = lowProb > 70 ? 'Very Low' : 'Low'
          confidence = lowProb
        } else if (mediumProb > highProb) {
          crowdLevel = 'Medium'
          confidence = mediumProb
        }
        
        return {
          day: dayName,
          crowd: crowdLevel,
          time: crowdLevel === 'Very Low' || crowdLevel === 'Low' ? '10-11 AM' : crowdLevel === 'Medium' ? '11 AM-12 PM' : '2-3 PM',
          confidence: Math.round(confidence),
          date: date.toLocaleDateString(),
          isOptimal: crowdLevel === 'Very Low' || crowdLevel === 'Low'
        }
      })
      .filter(d => d !== null)
    
    const optimalDays = allDays.filter(d => d.isOptimal).slice(0, 4)
    
    if (optimalDays.length === 0) {
      const sortedDays = allDays.sort((a, b) => {
        const crowdOrder = { 'Very Low': 0, 'Low': 1, 'Medium': 2, 'High': 3 }
        return crowdOrder[a.crowd] - crowdOrder[b.crowd]
      }).slice(0, 4)
      return sortedDays
    }
    
    return optimalDays
  }

  const getPredictionForecastData = () => {
    if (!predictions || predictions.length === 0) {
      return null
    }
    
    const labels = predictions.map((_, idx) => 
      idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : `Day ${idx + 1}`
    )
    
    const crowdLevels = predictions.map(p => {
      if (!p.success || !p.probabilities) {
        return 50
      }
      
      // Use the prediction directly to determine crowd level score
      const prediction = p.prediction
      const confidence = Math.max(
        p.probabilities.High || 0,
        p.probabilities.Medium || 0,
        p.probabilities.Low || 0
      )
      
      // Map prediction to a score (0-100)
      let baseScore
      if (prediction === 'High') {
        baseScore = 85
      } else if (prediction === 'Medium') {
        baseScore = 55
      } else {
        baseScore = 25
      }
      
      // Add some variance based on confidence
      const variance = (confidence - 0.5) * 20
      return Math.round(Math.max(0, Math.min(100, baseScore + variance)))
    })
    
    return {
      labels: labels,
      datasets: [{
        label: 'Predicted Congestion Level',
        data: crowdLevels,
        borderColor: '#A91D3A',
        backgroundColor: 'rgba(169, 29, 58, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: crowdLevels.map(value => {
          if (value > 80) return '#EF4444'
          if (value > 60) return '#F59E0B'
          return '#10B981'
        }),
        pointRadius: 6,
        pointHoverRadius: 8
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

  const optimalDays = getOptimalDays()
  const forecastData = getPredictionForecastData()

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">ML-Powered Predictions</h2>
            <p className="text-sm text-white/90 leading-relaxed">
              AI-driven forecasts for the next 7 days to help citizens plan their visits
              {selectedDistrict !== 'All' && ` for ${selectedDistrict} district`}
            </p>
          </div>
        </div>
      </div>

      {/* Warning Banner for Districts Not in Training Data */}
      {hasWarnings && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-amber-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-amber-800 font-semibold mb-1">Limited Training Data</h4>
              <p className="text-sm text-amber-700">
                The selected district has limited historical data. Predictions are based on general patterns and may be less accurate. 
                For best results, try selecting a district with more historical data like Visakhapatnam, Guntur, or Krishna.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ML Predictions & Optimal Visit Times */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Optimal Visit Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {optimalDays.some(d => d.isOptimal) ? 'ML-Predicted Best Days to Visit' : '7-Day ML Forecast'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {optimalDays.some(d => d.isOptimal) 
                    ? 'AI-recommended optimal times based on your data' 
                    : 'Predicted crowd levels for upcoming days'}
                </p>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Live ML</span>
            </div>
          </div>
          <div className="p-6">
            {optimalDays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimalDays.map((day, idx) => (
                  <div key={idx} className={`rounded-lg p-4 border ${
                    day.crowd === 'Very Low' || day.crowd === 'Low' 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                      : day.crowd === 'Medium'
                      ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                      : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{day.day}</h4>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        day.crowd === 'Very Low' ? 'bg-green-100 text-green-700' : 
                        day.crowd === 'Low' ? 'bg-blue-100 text-blue-700' :
                        day.crowd === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {day.crowd} Crowd
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date: <span className="font-semibold ml-1">{day.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Best Time: <span className="font-semibold ml-1">{day.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ML Confidence: <span className="font-semibold ml-1">{day.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Generating ML predictions...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing patterns for next 7 days</p>
              </div>
            )}
          </div>
        </div>

        {/* Prediction Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Prediction Summary</h3>
            <p className="text-sm text-gray-500 mt-1">Next 7 days</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Low Crowd Days</span>
                <span className="text-2xl font-bold text-green-700">
                  {predictions.filter(p => p.success && p.prediction === 'Low').length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Best days to visit</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Medium Crowd Days</span>
                <span className="text-2xl font-bold text-yellow-700">
                  {predictions.filter(p => p.success && p.prediction === 'Medium').length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Moderate wait times</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">High Crowd Days</span>
                <span className="text-2xl font-bold text-red-700">
                  {predictions.filter(p => p.success && p.prediction === 'High').length}
                </span>
              </div>
              <p className="text-xs text-gray-600">Avoid if possible</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">7-Day ML Congestion Forecast</h3>
            <p className="text-sm text-gray-500 mt-1">Predicted crowd levels for upcoming week</p>
          </div>
          <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">AI Prediction</span>
        </div>
        {forecastData ? (
          <div className="h-96">
            <Line data={forecastData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating ML predictions...</p>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">How ML Predictions Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Data Analysis</h4>
              <p className="text-sm text-gray-600">ML model analyzes historical patterns from 350K+ records</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Pattern Recognition</h4>
              <p className="text-sm text-gray-600">Identifies trends by day, time, and district</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Smart Recommendations</h4>
              <p className="text-sm text-gray-600">Provides optimal visit times with confidence scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionsPage
