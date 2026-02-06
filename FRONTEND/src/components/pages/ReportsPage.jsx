const ReportsPage = () => {
  return (
    <div className="p-8">
      <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Reports</h2>
        <p className="text-gray-600 mb-6">Generate and download detailed reports</p>
        <span className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
          Coming Soon
        </span>
      </div>
    </div>
  )
}

export default ReportsPage
