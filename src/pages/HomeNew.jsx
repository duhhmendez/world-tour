import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Volume2, Settings, Navigation } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import ActiveTourNew from './ActiveTourNew'
import SettingsNew from './SettingsNew'

const HomeNew = () => {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [activePOI, setActivePOI] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showActiveTour, setShowActiveTour] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [monitoringCount] = useState(3)

  // Mock POI data - in real app, this would come from geolocation API
  const mockPOIs = [
    {
      id: "empire-state",
      title: "Empire State Building",
      description: "Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York's most iconic landmarks.",
      coordinate: { latitude: 40.7484, longitude: -73.9857 },
      radius: 50
    },
    {
      id: "central-park",
      title: "Central Park",
      description: "A vast urban oasis covering 843 acres, Central Park offers lakes, walking trails, and cultural landmarks in the heart of Manhattan.",
      coordinate: { latitude: 40.7829, longitude: -73.9654 },
      radius: 100
    },
    {
      id: "times-square",
      title: "Times Square",
      description: "The bustling heart of Manhattan, Times Square is known for its bright lights, entertainment, and as the crossroads of the world.",
      coordinate: { latitude: 40.7580, longitude: -73.9855 },
      radius: 75
    }
  ]

  // Simulate location permission and POI detection
  useEffect(() => {
    const locationTimer = setTimeout(() => {
      setLocationEnabled(true)
      setIsDetecting(true)
    }, 2000)

    const poiTimer = setTimeout(() => {
      // Simulate detecting a nearby POI
      setActivePOI(mockPOIs[0]) // Empire State Building
      setIsDetecting(false)
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
    } else if (activePOI) {
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

  const getSubtitleText = () => {
    if (!locationEnabled) {
      return "Enable location to discover nearby landmarks"
    } else if (isDetecting) {
      return "Scanning for nearby landmarks..."
    } else if (activePOI) {
      return "Connect your headphones and start walking—World Tour will guide you."
    } else {
      return "World Tour will notify you when a landmark is nearby"
    }
  }

  const POIDetectionCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm border-white/30 shadow-lg"
        onClick={handleStartTour}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Detection Status */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">Monitoring {monitoringCount} locations</span>
            </div>
            
            {/* POI Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center space-x-2">
                <Navigation className="text-blue-500 w-5 h-5" />
                <span className="text-blue-600 font-semibold text-lg">Nearby: {activePOI.title}</span>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {activePOI.description}
              </p>
              
              <div className="flex items-center justify-center space-x-2 pt-2">
                <Volume2 className="text-blue-500 w-4 h-4" />
                <span className="text-blue-500 text-sm font-medium">Tap to start tour</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const LocationRequestCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="text-blue-500 w-5 h-5" />
              <span className="text-gray-600 font-medium">Location Access Required</span>
            </div>
            
            <p className="text-gray-500 text-sm">
              Enable location services to discover nearby landmarks and start your audio tour.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const DetectingCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">Scanning for landmarks...</span>
            </div>
            
            <div className="flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/20 via-blue-50/10 to-orange-100/10">
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
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/30">
                <div className="text-5xl">🌍</div>
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

          {/* Dynamic Status Panel */}
          <div className="w-full flex justify-center">
            {!locationEnabled ? (
              <LocationRequestCard />
            ) : isDetecting ? (
              <DetectingCard />
            ) : activePOI ? (
              <POIDetectionCard />
            ) : null}
          </div>

          {/* Bottom Section */}
          <div className="w-full max-w-sm space-y-8">
            {/* Start Tour Button - Only show when location enabled but no POI */}
            {locationEnabled && !isDetecting && !activePOI && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <Button
                  onClick={handleStartTour}
                  variant="ios"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Volume2 className="text-xl" />
                  <span className="text-lg font-semibold">Start Tour</span>
                </Button>
              </motion.div>
            )}

            {/* Subtitle Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-center text-gray-600 leading-relaxed text-base"
            >
              {getSubtitleText()}
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

export default HomeNew 