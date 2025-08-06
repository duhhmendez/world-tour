import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Volume2, Settings, Navigation, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import ActiveTourNew from './ActiveTourNew'
import SettingsNew from './SettingsNew'
import { fetchPOIs } from '../lib/supabaseClient'

const HomeNew = () => {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [activePOI, setActivePOI] = useState(null)
  const [closestPOI, setClosestPOI] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showActiveTour, setShowActiveTour] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)
  const [monitoringCount] = useState(3)
  
  // POI data state
  const [pois, setPois] = useState([])
  const [poisLoading, setPoisLoading] = useState(true)
  const [poisError, setPoisError] = useState(null)

  // Fetch POIs from Supabase
  useEffect(() => {
    const loadPOIs = async () => {
      try {
        setPoisLoading(true)
        setPoisError(null)
        const poisData = await fetchPOIs()
        setPois(poisData)
      } catch (error) {
        console.error('Failed to load POIs:', error)
        setPoisError('Failed to load points of interest')
      } finally {
        setPoisLoading(false)
      }
    }

    loadPOIs()
  }, [])

  // Haversine formula to calculate distance between two points
  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Convert meters to feet
  const metersToFeet = (meters) => {
    return Math.round(meters * 3.281)
  }

  // Get the closest POI to user's location
  const getClosestPOI = (userLat, userLon) => {
    if (!userLat || !userLon || pois.length === 0) return null

    let closest = null
    let minDistance = Infinity

    pois.forEach(poi => {
      // Parse coordinates from the location field or use default coordinates
      // Assuming location field contains "latitude,longitude" format
      let poiLat, poiLon
      
      if (poi.location && poi.location.includes(',')) {
        const [lat, lon] = poi.location.split(',').map(coord => parseFloat(coord.trim()))
        poiLat = lat
        poiLon = lon
      } else {
        // Fallback coordinates for development
        poiLat = 40.7484
        poiLon = -73.9857
      }

      const distance = getDistanceInMeters(
        userLat, userLon,
        poiLat, poiLon
      )
      
      if (distance < minDistance) {
        minDistance = distance
        closest = { 
          ...poi, 
          distance,
          coordinate: { latitude: poiLat, longitude: poiLon },
          radius: 50 // Default radius in meters
        }
      }
    })

    return closest
  }

  // Check if user is within range of a POI
  const isWithinRange = (poi, distance) => {
    return distance <= (poi.radius || 50)
  }

  // Update POI status based on user location
  const updatePOIStatus = (userLat, userLon) => {
    const closest = getClosestPOI(userLat, userLon)
    
    if (!closest) {
      setClosestPOI(null)
      setActivePOI(null)
      return
    }

    setClosestPOI(closest)

    if (isWithinRange(closest, closest.distance)) {
      setActivePOI(closest)
    } else {
      setActivePOI(null)
    }
  }

  // Simulate location permission and POI detection
  useEffect(() => {
    const locationTimer = setTimeout(() => {
      setLocationEnabled(true)
      setIsDetecting(true)
      
      // Simulate user location (near Empire State Building)
      const mockUserLocation = {
        latitude: 40.7484,
        longitude: -73.9857
      }
      setUserLocation(mockUserLocation)
      
      // Only update POI status if POIs are loaded
      if (pois.length > 0) {
        updatePOIStatus(mockUserLocation.latitude, mockUserLocation.longitude)
      }
    }, 2000)

    const poiTimer = setTimeout(() => {
      setIsDetecting(false)
    }, 4000)

    return () => {
      clearTimeout(locationTimer)
      clearTimeout(poiTimer)
    }
  }, []) // Remove pois dependency to ensure location simulation always runs

  // Update POI status when POIs are loaded
  useEffect(() => {
    if (locationEnabled && userLocation && pois.length > 0) {
      updatePOIStatus(userLocation.latitude, userLocation.longitude)
    }
  }, [pois, locationEnabled, userLocation])

  // Real-time location updates (simulated)
  useEffect(() => {
    if (!locationEnabled || !userLocation) return

    const locationUpdateInterval = setInterval(() => {
      // Simulate user movement
      const newLat = userLocation.latitude + (Math.random() - 0.5) * 0.001
      const newLon = userLocation.longitude + (Math.random() - 0.5) * 0.001
      const newLocation = { latitude: newLat, longitude: newLon }
      
      setUserLocation(newLocation)
      
      // Only update POI status if POIs are loaded
      if (pois.length > 0) {
        updatePOIStatus(newLat, newLon)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(locationUpdateInterval)
  }, [locationEnabled, userLocation, pois])

  const handleStartTour = () => {
    if (!locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocationEnabled(true)
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            updatePOIStatus(position.coords.latitude, position.coords.longitude)
          },
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
    return <ActiveTourNew onEndTour={handleEndTour} pois={pois} />
  }

  const getSubtitleText = () => {
    if (poisLoading) {
      return "Loading points of interest..."
    } else if (poisError) {
      return "Unable to load points of interest"
    } else if (!locationEnabled) {
      return "Enable location to discover nearby landmarks"
    } else if (isDetecting) {
      return "Scanning for nearby landmarks..."
    } else if (activePOI) {
      return "Connect your headphones and start walking—World Tour will guide you."
    } else if (closestPOI) {
      return "Keep walking to start the tour"
    } else {
      return "World Tour will notify you when a landmark is nearby"
    }
  }

  const LocationStatusPanel = () => {
    // Show location request if location is not enabled, regardless of POI loading state
    if (!locationEnabled) return null

    // Show loading state for POIs
    if (poisLoading) {
      return (
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
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-gray-600 font-medium">Loading POIs...</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    // Show error state for POIs
    if (poisError) {
      return (
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
                  <span className="text-red-500 font-medium">Error loading POIs</span>
                </div>
                <p className="text-gray-500 text-sm">{poisError}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    // Show detecting state
    if (isDetecting) {
      return (
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
    }

    // Show active POI if within range
    if (activePOI) {
      return (
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
                  <span className="text-gray-600 font-medium">Monitoring {pois.length} locations</span>
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
                    <span className="text-blue-600 font-semibold text-lg">Nearby: {activePOI.name}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {activePOI.script}
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
    }

    // Show closest POI if out of range
    if (closestPOI) {
      const distanceInFeet = metersToFeet(closestPOI.distance)
      
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                {/* Detection Status */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600 font-medium">Monitoring {pois.length} locations</span>
                </div>
                
                {/* Closest POI Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="text-orange-500 w-5 h-5" />
                    <span className="text-orange-600 font-semibold text-lg">Closest POI: {closestPOI.name}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium">
                    {distanceInFeet} ft away
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <Navigation className="text-gray-500 w-4 h-4" />
                    <span className="text-gray-500 text-sm font-medium">Keep walking to start the tour</span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    // Show no POIs available state
    if (pois.length === 0 && !poisLoading && !poisError) {
      return (
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
                  <MapPin className="text-gray-500 w-5 h-5" />
                  <span className="text-gray-600 font-medium">No POIs Available</span>
                </div>
                <p className="text-gray-500 text-sm">
                  No points of interest are currently available in your area.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )
    }

    return null
  }

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
            ) : (
              <LocationStatusPanel />
            )}
          </div>

          {/* Bottom Section */}
          <div className="w-full max-w-sm space-y-8">
            {/* Start Tour Button - Only show when location enabled but no POI */}
            {locationEnabled && !isDetecting && !activePOI && !poisLoading && !poisError && (
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