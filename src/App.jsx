import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PastToursNew from './pages/PastToursNew'
import Tours from './components/Tours'
import About from './components/About'
import HomeNew from './pages/HomeNew'
import { Menu, X } from 'lucide-react'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'


function App() {
  const [currentTab, setCurrentTab] = useState('home')
  const [showMenu, setShowMenu] = useState(false)

  const handleTabChange = (tab) => {
    setCurrentTab(tab)
    setShowMenu(false)
  }

  const MenuButton = () => (
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="absolute top-6 left-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-20"
    >
      {showMenu ? (
        <X className="text-gray-600 text-xl" />
      ) : (
        <Menu className="text-gray-600 text-xl" />
      )}
    </button>
  )

  const MenuOverlay = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30">
      <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Navigation</h2>
          <div className="space-y-4">
            <button
              onClick={() => handleTabChange('home')}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                currentTab === 'home'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏠</span>
                <span className="font-medium">Home</span>
              </div>
            </button>
            
            <button
              onClick={() => handleTabChange('past-tours')}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                currentTab === 'past-tours'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📋</span>
                <span className="font-medium">Past Tours</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={
              <div className="flex flex-col h-screen">
                {/* Hamburger Menu Button */}
                <MenuButton />
                
                {/* Menu Overlay */}
                {showMenu && <MenuOverlay />}

                {/* Main Content - iOS Style */}
                <div className="flex-1 overflow-hidden">
                  {currentTab === 'home' && <HomeNew />}
                  {currentTab === 'past-tours' && <PastToursNew onNavigateHome={() => handleTabChange('home')} />}
                </div>
              </div>
            } />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App 