import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiWorld, BiMapPin, BiHeadphones, BiCog } from 'react-icons/bi'

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
  const buttonIcon = locationEnabled ? BiHeadphones : BiMapPin

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

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose }) => {
  const [voiceGender, setVoiceGender] = useState('neutral')
  const [voiceTone, setVoiceTone] = useState('friendly')
  const [backgroundAmbience, setBackgroundAmbience] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white/95 backdrop-blur-ios rounded-3xl shadow-ios-strong w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <button onClick={onClose} className="text-ios-primary font-semibold text-lg">
                Done
              </button>
              <h2 className="text-xl font-bold text-gray-800">Settings</h2>
              <div className="w-12"></div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Voice Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Voice Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Voice Gender</p>
                      <p className="text-sm text-gray-500">Choose the voice for audio guides</p>
                    </div>
                    <select 
                      value={voiceGender} 
                      onChange={(e) => setVoiceGender(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">Voice Tone</p>
                      <p className="text-sm text-gray-500">Select the tone of voice narration</p>
                    </div>
                    <select 
                      value={voiceTone} 
                      onChange={(e) => setVoiceTone(e.target.value)}
                      className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="friendly">Friendly</option>
                      <option value="dramatic">Dramatic</option>
                      <option value="playful">Playful</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Audio Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Background Ambience</p>
                    <p className="text-sm text-gray-500">Play ambient sounds during tours</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={backgroundAmbience}
                    onChange={(e) => setBackgroundAmbience(e.target.checked)}
                    className="w-6 h-6 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* About */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">About</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">Version</p>
                    <p className="text-sm text-gray-500">1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main Home Component
const Home = () => {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [activePOI, setActivePOI] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
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
      // Start tour logic
      console.log('Starting tour...')
    }
  }

  const handleOpenSettings = () => {
    setShowSettings(true)
  }

  const handleCloseSettings = () => {
    setShowSettings(false)
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
      <SettingsModal 
        isOpen={showSettings}
        onClose={handleCloseSettings}
      />
    </div>
  )
}

export default Home 