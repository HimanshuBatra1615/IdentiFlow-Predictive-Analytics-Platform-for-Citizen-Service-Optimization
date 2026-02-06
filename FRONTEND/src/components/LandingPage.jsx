import { useState } from 'react'

const LandingPage = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white m-0 p-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/95 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#A91D3A] to-[#F5A623] rounded-xl blur opacity-30"></div>
                <img 
                  src="/image.png" 
                  alt="AadhaarFlow Logo" 
                  className="w-10 h-10 sm:w-12 sm:h-12 relative object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#A91D3A] to-[#8B1538] bg-clip-text text-transparent">
                  AadhaarFlow
                </h1>
                <p className="text-xs text-gray-500 font-medium hidden sm:block">Analytics Platform</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-[#A91D3A] font-medium transition-colors">
                Dashboard
              </button>
              <button 
                onClick={() => onNavigate('dashboard', 'predictions')}
                className="bg-gradient-to-r from-[#A91D3A] to-[#8B1538] text-white px-6 py-2 rounded-lg font-medium hover:from-[#8B1538] hover:to-[#6B0F2A] transition-all shadow-md"
              >
                Get Started
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
              <div className="px-4 py-4 space-y-3">
                <button 
                  onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-[#F5F1E8] hover:text-[#A91D3A] rounded-lg transition-colors font-medium"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { onNavigate('dashboard', 'predictions'); setMobileMenuOpen(false); }}
                  className="block w-full bg-gradient-to-r from-[#A91D3A] to-[#8B1538] text-white px-4 py-3 rounded-lg font-medium hover:from-[#8B1538] hover:to-[#6B0F2A] transition-all shadow-md text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#8B1538] via-[#A91D3A] to-[#C73659]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#F5A623] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-[#F7B731] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 sm:w-80 sm:h-80 bg-[#FFA500] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-6 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7B731] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F5A623]"></span>
              </span>
              <span className="text-white text-xs sm:text-sm font-medium">🚀 AI-Powered Analytics • Live Now</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4 leading-tight px-4">
              Smarter Aadhaar Updates
              <br />
              <span className="bg-gradient-to-r from-[#F7B731] to-[#FFA500] bg-clip-text text-transparent">
                for Everyone
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#F5F1E8] max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Utilizing advanced data analytics to predict center traffic, identify optimal update periods, 
              and understand national enrolment trends.
            </p>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-10 px-4">
              {/* Card 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5A623] to-[#F7B731] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-7 transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#F5A623] rounded-full blur-lg opacity-50"></div>
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#F7B731] to-[#F5A623] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Update Without the Wait
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Get AI-powered predictions for the best time to visit
                  </p>
                  
                  <button
                    onClick={() => onNavigate('dashboard', 'predictions')}
                    className="w-full bg-gradient-to-r from-[#F5A623] to-[#F7B731] hover:from-[#F7B731] hover:to-[#FFA500] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <span>Plan My Visit Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A91D3A] to-[#C73659] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-7 transform hover:scale-105 transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#A91D3A] rounded-full blur-lg opacity-50"></div>
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-[#C73659] to-[#A91D3A] rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 sm:w-9 sm:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                          <circle cx="18" cy="6" r="3" fill="currentColor"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Explore Societal Trends
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Dive into comprehensive analytics and patterns
                  </p>
                  
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full bg-gradient-to-r from-[#A91D3A] to-[#8B1538] hover:from-[#8B1538] hover:to-[#6B0F2A] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <span>View Analytics Dashboard</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 sm:h-16 md:h-20" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              How It Works
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Powered by cutting-edge machine learning and real-time data analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A91D3A] to-[#C73659] rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-[#F5F1E8] to-[#EDE7DC] rounded-xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-[#EDE7DC]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#A91D3A] to-[#8B1538] rounded-lg flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AI-Powered Predictions</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Advanced ML algorithms analyze 555K+ records to predict crowd levels with 95% accuracy
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F5A623] to-[#F7B731] rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-[#F5F1E8] to-[#EDE7DC] rounded-xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-[#EDE7DC]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#F7B731] to-[#F5A623] rounded-lg flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Real-Time Insights</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Get instant predictions and recommendations for the optimal time to visit
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative md:col-span-1">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#A91D3A] to-[#F5A623] rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-[#F5F1E8] to-[#EDE7DC] rounded-xl p-5 sm:p-6 hover:shadow-xl transition-all duration-300 border border-[#EDE7DC]">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#C73659] to-[#A91D3A] rounded-lg flex items-center justify-center mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Comprehensive Analytics</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Explore detailed trends and insights across 13+ districts with interactive visualizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-14 bg-gradient-to-r from-[#8B1538] via-[#A91D3A] to-[#C73659] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1 bg-gradient-to-r from-[#F7B731] to-[#FFA500] bg-clip-text text-transparent">
                555K+
              </div>
              <div className="text-[#F5F1E8] font-medium text-xs sm:text-sm">Records Analyzed</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1 bg-gradient-to-r from-[#F7B731] to-[#FFA500] bg-clip-text text-transparent">
                95%
              </div>
              <div className="text-[#F5F1E8] font-medium text-xs sm:text-sm">Prediction Accuracy</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1 bg-gradient-to-r from-[#F7B731] to-[#FFA500] bg-clip-text text-transparent">
                30+
              </div>
              <div className="text-[#F5F1E8] font-medium text-xs sm:text-sm">Districts Covered</div>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-1 bg-gradient-to-r from-[#F7B731] to-[#FFA500] bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-[#F5F1E8] font-medium text-xs sm:text-sm">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#F5F1E8] to-[#EDE7DC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Save Time?
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-4">
              Join thousands of users planning their Aadhaar center visits with data-driven insights
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <button
                onClick={() => onNavigate('dashboard', 'predictions')}
                className="group bg-gradient-to-r from-[#A91D3A] to-[#8B1538] text-white font-bold py-3 sm:py-4 px-7 sm:px-9 rounded-xl hover:from-[#8B1538] hover:to-[#6B0F2A] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span className="text-sm sm:text-base">Get Started Free</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="group bg-white text-[#A91D3A] font-bold py-3 sm:py-4 px-7 sm:px-9 rounded-xl border-2 border-[#A91D3A] hover:bg-[#F5F1E8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span className="text-sm sm:text-base">View Dashboard</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 sm:py-12 mt-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/image.png" 
                  alt="AadhaarFlow Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h3 className="text-white font-bold text-lg">AadhaarFlow</h3>
                  <p className="text-sm">Analytics Platform</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm sm:text-base">
                Making Aadhaar updates smarter and more efficient for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button onClick={() => onNavigate('dashboard')} className="block hover:text-white transition-colors text-sm sm:text-base">
                  Dashboard
                </button>
                <button onClick={() => onNavigate('dashboard', 'predictions')} className="block hover:text-white transition-colors text-sm sm:text-base">
                  Predictions
                </button>
              </div>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <div className="space-y-2 text-gray-500 text-sm sm:text-base">
                <p>✓ AI-Powered Predictions</p>
                <p>✓ Real-Time Analytics</p>
                <p>✓ District-wise Insights</p>
                <p>✓ 24/7 Availability</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © 2025 AadhaarFlow Analytics. All rights reserved. Built with ❤️ for better citizen services.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
