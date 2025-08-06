import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WorldTour from './components/WorldTour'
import PastTours from './components/PastTours'
import Tours from './components/Tours'
import About from './components/About'
import VersionCheck from './components/VersionCheck'

function App() {
  const [currentTab, setCurrentTab] = useState('home')

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <VersionCheck />
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col h-screen">
              {/* Main Content - iOS Style Updated */}
              <div className="flex-1 overflow-hidden">
                {currentTab === 'home' && <WorldTour />}
                {currentTab === 'past-tours' && <PastTours />}
                {currentTab === 'tours' && <Tours />}
              </div>

              {/* Tab Navigation - iOS Style Updated - FORCE DEPLOYMENT */}
              <div className="bg-white border-t border-gray-200 px-4 py-2">
                <div className="flex justify-around">
                  <button
                    onClick={() => setCurrentTab('home')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                      currentTab === 'home' 
                        ? 'text-blue-500 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-xl mb-1">🏠</span>
                    <span className="text-xs font-medium">Home - iOS</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentTab('tours')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                      currentTab === 'tours' 
                        ? 'text-blue-500 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-xl mb-1">🌍</span>
                    <span className="text-xs font-medium">Tours - iOS</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentTab('past-tours')}
                    className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                      currentTab === 'past-tours' 
                        ? 'text-blue-500 bg-blue-50' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className="text-xl mb-1">📋</span>
                    <span className="text-xs font-medium">History - iOS</span>
                  </button>
                </div>
              </div>
            </div>
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App 