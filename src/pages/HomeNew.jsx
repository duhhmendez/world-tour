import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Volume2, Settings, Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const HomeNew = () => {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [activePOI, setActivePOI] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showActiveTour, setShowActiveTour] = useState(false)
  const [monitoringCount] = useState(3)

  // Simulate location permission and POI detection
  useEffect(() => {
    const locationTimer = setTimeout(() => {
      setLocationEnabled(true)
    }, 2000)

    const poiTimer = setTimeout(() => {
      setActivePOI({
        title: "Empire State Building",
        distance: 45,
        description: "Iconic Art Deco skyscraper"
      })
    }, 4000)

    return () => {
      clearTimeout(locationTimer)
      clearTimeout(poiTimer)
    }
  }, [])

  const handleStartTour = () => {
    if (!locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setLocationEnabled(true),
          () => console.log('Location permission denied')
        )
      }
    } else {
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
    return <ActiveTourNew onEndTour={handleEndTour} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      <div className="flex flex-col h-screen">
        {/* Settings Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={handleOpenSettings}
          className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 z-10"
        >
          <Settings className="text-gray-600 text-xl" />
        </motion.button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between items-center px-6 py-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8"
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
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <Globe className="text-white text-4xl" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="text-4xl font-bold text-gray-800"
            >
              World Tour
            </motion.h1>
          </motion.div>

          {/* Location Status Panel */}
          {locationEnabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-sm"
            >
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-600 font-medium">Monitoring {monitoringCount} locations</span>
                    </div>
                    
                    {activePOI && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="space-y-2"
                      >
                        <p className="text-blue-600 font-semibold">Nearby: {activePOI.title}</p>
                        <p className="text-gray-500 text-sm">{activePOI.description}</p>
                        <p className="text-gray-400 text-xs">Tap to start tour</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bottom Section */}
          <div className="w-full max-w-sm space-y-8">
            {/* Start Tour Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <Button
                onClick={handleStartTour}
                variant="ios"
                size="lg"
                className="w-full flex items-center justify-center space-x-3"
              >
                {locationEnabled ? (
                  <>
                    <Volume2 className="text-xl" />
                    <span className="text-lg font-semibold">Start Tour</span>
                  </>
                ) : (
                  <>
                    <MapPin className="text-xl" />
                    <span className="text-lg font-semibold">Enable Location</span>
                  </>
                )}
              </Button>
            </motion.div>

            {/* Subtitle Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-center text-gray-600 leading-relaxed text-base"
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
          <SettingsNew onClose={handleCloseSettings} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Placeholder components for now
const ActiveTourNew = ({ onEndTour }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-8"
        >
          <div className="flex items-center justify-between">
            <Button
              onClick={onEndTour}
              variant="ghost"
              className="flex items-center space-x-2 text-blue-600 font-semibold"
            >
              <span>←</span>
              <span>End Tour</span>
            </Button>
            
            <h1 className="text-xl font-bold text-gray-800">Active Tour</h1>
            
            <div className="w-20"></div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between items-center px-6 py-12">
          <div className="text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl font-bold text-gray-800"
            >
              Empire State Building
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="text-xl text-gray-600"
            >
              New York, NY
            </motion.p>
          </div>

          <div className="w-full max-w-md space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>0:12</span>
                <span>3:41</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <Button variant="iosSecondary" size="icon">
                <SkipBack className="text-xl" />
              </Button>
              <Button variant="ios" size="icon" className="w-16 h-16">
                <Play className="text-2xl" />
              </Button>
              <Button variant="iosSecondary" size="icon">
                <SkipForward className="text-xl" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingsNew = ({ onClose }) => {
  return (
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
        className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <Button onClick={onClose} variant="ghost" className="text-blue-600 font-semibold">
            Done
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <div className="w-12"></div>
        </div>
        <div className="p-6">
          <p className="text-center text-gray-500">Settings coming soon...</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default HomeNew 