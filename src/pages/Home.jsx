import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiWorld, BiMapPin, BiVolumeFull, BiCog } from 'react-icons/bi'
import ActiveTour from './ActiveTour'
import Settings from './Settings'

// Location Status Panel Component
const LocationStatusPanel = ({ locationEnabled, activePOI, monitoringCount }) => {
  if (!locationEnabled) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gray-100/80 backdrop-blur-sm rounded-xl p-4 mb-8 shadow-ios-soft border border-white/20"
    >
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-ios-success text-xl animate-pulse-slow">📍</span>
          <span className="text-gray-600 font-medium">Monitoring {monitoringCount} locations</span>
        </div>
        
        {activePOI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-1"
          >
            <p className="text-ios-primary font-medium">Nearby: {activePOI.title}</p>
            <p className="text-ios-secondary text-sm">Tap to start tour</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Start Tour Button Component
const StartTourButton = ({ locationEnabled, onStartTour }) => {
  const buttonText = locationEnabled ? 'Start Tour' : 'Enable Location'
  const buttonIcon = locationEnabled ? BiVolumeFull : BiMapPin

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      onClick={onStartTour}
      className="w-full max-w-sm bg-gradient-ios-blue text-white py-4 px-8 rounded-xl shadow-ios-strong hover:shadow-ios-strong transition-all duration-300 flex items-center justify-center space-x-4 mb-8 transform hover:scale-105 active:scale-95"
    >
      <buttonIcon className="text-2xl" />
      <span className="text-xl font-semibold">{buttonText}</span>
    </motion.button>
  )
}

// Main Home Component
const Home = () => {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [activePOI, setActivePOI] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showActiveTour, setShowActiveTour] = useState(false)
  const [monitoringCount] = useState(3) // Mock data

  // Simulate location permission and POI detection
  useEffect(() => {
    // Simulate location permission request
    const locationTimer = setTimeout(() => {
      setLocationEnabled(true)
    }, 2000)

    // Simulate finding a nearby POI
    const poiTimer = setTimeout(() => {
      setActivePOI({
        title: "Empire State Building",
        distance: 45
      })
    }, 4000)

    return () => {
      clearTimeout(locationTimer)
      clearTimeout(poiTimer)
    }
  }, [])

  const handleStartTour = () => {
    if (!locationEnabled) {
      // Request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setLocationEnabled(true),
          () => console.log('Location permission denied')
        )
      }
    } else {
      // Start tour - show active tour screen
      setShowActiveTour(true)
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
  }

  const handleEndTour = () => {
    setShowActiveTour(false)
  }

  // Show Active Tour screen if active
  if (showActiveTour) {
    return <ActiveTour onEndTour={handleEndTour} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-transparent to-orange-100">
      <div className="flex flex-col h-screen">
        {/* Settings Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={handleOpenSettings}
          className="absolute top-6 right-6 w-11 h-11 bg-white/10 backdrop-blur-ios rounded-full flex items-center justify-center shadow-ios-medium hover:shadow-ios-strong transition-all duration-300 transform hover:scale-110 active:scale-95 z-10"
        >
          <BiCog className="text-gray-600 text-xl" />
        </motion.button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between items-center px-8 py-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            {/* Globe Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center"
            >
              <BiWorld className="text-[80px] text-blue-500" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-3xl font-bold text-gray-800"
            >
              World Tour
            </motion.h1>
          </motion.div>

          {/* Location Status Panel */}
          <LocationStatusPanel 
            locationEnabled={locationEnabled}
            activePOI={activePOI}
            monitoringCount={monitoringCount}
          />

          {/* Bottom Section */}
          <div className="w-full max-w-sm space-y-6">
            {/* Start Tour Button */}
            <StartTourButton 
              locationEnabled={locationEnabled}
              onStartTour={handleStartTour}
            />

            {/* Subtitle Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-sm text-center text-gray-600 leading-relaxed"
            >
              {locationEnabled 
                ? 'Connect your headphones and start walking—World Tour will guide you.'
                : 'Enable location to discover nearby landmarks.'
              }
            </motion.p>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <Settings onClose={handleCloseSettings} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home 