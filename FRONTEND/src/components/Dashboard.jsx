import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Import components
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import OverviewPage from './pages/OverviewPage'
import PredictionsPage from './pages/PredictionsPage'
import TrendsPage from './pages/TrendsPage'
import AnalyticsPage from './pages/AnalyticsPage'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = ({ onBack, initialTab = 'overview' }) => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedDistrict, setSelectedDistrict] = useState('All')
  
  // Backend data states
  const [statistics, setStatistics] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [trends, setTrends] = useState(null)
  const [districts, setDistricts] = useState([])
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])
  
  useEffect(() => {
    // Set initial tab when component mounts or initialTab changes
    setActiveTab(initialTab)
  }, [initialTab])
  
  useEffect(() => {
    if (selectedDistrict) {
      fetchDistrictData()
    }
  }, [selectedDistrict])

  useEffect(() => {
    // Listen for navigation events from child components
    const handleNavigate = (event) => {
      setActiveTab('predictions')
    }
    
    window.addEventListener('navigate-to-predictions', handleNavigate)
    
    return () => {
      window.removeEventListener('navigate-to-predictions', handleNavigate)
    }
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      const [statsRes, analyticsRes, trendsRes, districtsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/statistics?district=${selectedDistrict}`),
        fetch(`http://localhost:5000/api/analytics?district=${selectedDistrict}`),
        fetch(`http://localhost:5000/api/trends?district=${selectedDistrict}`),
        fetch('http://localhost:5000/api/districts')
      ])

      const statsData = await statsRes.json()
      const analyticsData = await analyticsRes.json()
      const trendsData = await trendsRes.json()
      const districtsData = await districtsRes.json()

      setStatistics(statsData)
      setAnalytics(analyticsData)
      setTrends(trendsData)
      setDistricts(districtsData.districts || [])

      await generatePredictions()
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const fetchDistrictData = async () => {
    try {
      setPredictions([])
      
      const [statsRes, analyticsRes, trendsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/statistics?district=${selectedDistrict}`),
        fetch(`http://localhost:5000/api/analytics?district=${selectedDistrict}`),
        fetch(`http://localhost:5000/api/trends?district=${selectedDistrict}`)
      ])

      const statsData = await statsRes.json()
      const analyticsData = await analyticsRes.json()
      const trendsData = await trendsRes.json()

      setStatistics(statsData)
      setAnalytics(analyticsData)
      setTrends(trendsData)

      await generatePredictions(selectedDistrict)
      
    } catch (error) {
      console.error('Error fetching district data:', error)
    }
  }

  const generatePredictions = async (districtOverride = null) => {
    try {
      console.log('=== STARTING PREDICTION GENERATION ===')
      
      try {
        const healthCheck = await fetch('http://localhost:5000/api/health')
        const healthData = await healthCheck.json()
        console.log('Backend health check:', healthData)
        
        if (!healthData.model_loaded) {
          console.error('Model not loaded on backend')
          setPredictions([])
          return
        }
      } catch (err) {
        console.error('Backend not reachable:', err)
        setPredictions([])
        return
      }
      
      const today = new Date()
      const predictionPromises = []
      
      let districtForPrediction = districtOverride || selectedDistrict
      
      if (!districtForPrediction || districtForPrediction === 'All') {
        districtForPrediction = districts.length > 0 ? districts[0] : 'Visakhapatnam'
      }
      
      console.log('Generating predictions for district:', districtForPrediction)
      
      // Fetch district-specific historical averages
      let dayAverages = {
        'Monday': { age_0_5: 1, age_5_17: 3, age_18_plus: 8, bio_age_5_17: 5, bio_age_18_plus: 12 },
        'Tuesday': { age_0_5: 2, age_5_17: 4, age_18_plus: 10, bio_age_5_17: 6, bio_age_18_plus: 14 },
        'Wednesday': { age_0_5: 1, age_5_17: 2, age_18_plus: 6, bio_age_5_17: 4, bio_age_18_plus: 9 },
        'Thursday': { age_0_5: 2, age_5_17: 5, age_18_plus: 12, bio_age_5_17: 8, bio_age_18_plus: 16 },
        'Friday': { age_0_5: 2, age_5_17: 4, age_18_plus: 11, bio_age_5_17: 7, bio_age_18_plus: 15 },
        'Saturday': { age_0_5: 2, age_5_17: 5, age_18_plus: 13, bio_age_5_17: 9, bio_age_18_plus: 17 },
        'Sunday': { age_0_5: 0, age_5_17: 1, age_18_plus: 3, bio_age_5_17: 2, bio_age_18_plus: 5 }
      }
      
      try {
        const avgResponse = await fetch(`http://localhost:5000/api/district-averages/${encodeURIComponent(districtForPrediction)}`)
        const avgData = await avgResponse.json()
        if (avgData.averages) {
          dayAverages = avgData.averages
          console.log('Using district-specific averages:', avgData)
        }
      } catch (err) {
        console.warn('Could not fetch district averages, using defaults:', err)
      }
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() + i)
        
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
        const pattern = dayAverages[dayOfWeek]
        
        const requestBody = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate(),
          day_of_week: dayOfWeek,
          district: districtForPrediction,
          ...pattern
        }
        
        console.log(`Predicting for ${dayOfWeek} (${date.toLocaleDateString()}):`, requestBody)
        
        predictionPromises.push(
          fetch('http://localhost:5000/api/predict', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
          })
          .then(async res => {
            const data = await res.json()
            console.log(`Prediction for ${dayOfWeek}:`, data)
            return data
          })
          .catch(err => {
            console.error(`Request failed for ${dayOfWeek}:`, err)
            return { success: false, error: err.message, day: dayOfWeek }
          })
        )
      }
      
      const results = await Promise.all(predictionPromises)
      console.log('All predictions received:', results)
      console.log('Successful predictions:', results.filter(r => r.success).length)
      
      setPredictions(results)
    } catch (error) {
      console.error('Prediction generation failed:', error)
      setPredictions([])
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#A91D3A] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Analytics Dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching data from ML model...</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage statistics={statistics} analytics={analytics} trends={trends} districts={districts} predictions={predictions} selectedDistrict={selectedDistrict} />
      case 'predictions':
        return <PredictionsPage predictions={predictions} selectedDistrict={selectedDistrict} />
      case 'trends':
        return <TrendsPage trends={trends} analytics={analytics} statistics={statistics} selectedDistrict={selectedDistrict} />
      case 'analytics':
        return <AnalyticsPage analytics={analytics} statistics={statistics} selectedDistrict={selectedDistrict} />
      default:
        return <OverviewPage statistics={statistics} analytics={analytics} trends={trends} districts={districts} predictions={predictions} selectedDistrict={selectedDistrict} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onBack={onBack} />
      
      <div className="flex-1 overflow-auto">
        <DashboardHeader 
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          districts={districts}
          totalRecords={trends?.total_records || statistics?.total_records}
        />
        
        {renderPage()}
      </div>
    </div>
  )
}

export default Dashboard
