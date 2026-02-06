const AlertsPage = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Citizen Alerts</h2>
        <p className="text-gray-600 mb-6">Notification system for optimal visit times</p>
        <span className="inline-block px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg text-sm font-medium">
          Coming Soon
        </span>
      </div>
    </div>
  )
}

export default AlertsPage
