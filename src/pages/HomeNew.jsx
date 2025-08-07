import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, Volume2, Settings, Navigation, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import ActiveTourNew from './ActiveTourNew'
import SettingsNew from './SettingsNew'
import { fetchPOIs, supabase } from '../lib/supabaseClient'

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
        console.log('Attempting to load POIs from Supabase...')
        
        const poisData = await fetchPOIs()
        console.log('POIs loaded from Supabase:', poisData)
        console.log('Number of POIs loaded:', poisData?.length || 0)

        setPois(poisData || [])
      } catch (error) {
        console.error('Failed to load POIs:', error)
        setPoisError(`Failed to load points of interest: ${error.message}`)
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

  // Convert feet to miles when distance is over 1 mile
  const formatDistance = (feet) => {
    const MILE_IN_FEET = 5280
    if (feet >= MILE_IN_FEET) {
      const miles = (feet / MILE_IN_FEET).toFixed(1)
      return `${miles} mi`
    }
    return `${feet} ft`
  }

  // Calculate direction between two points
  const getDirection = (userLat, userLon, poiLat, poiLon) => {
    const deltaLon = poiLon - userLon
    const deltaLat = poiLat - userLat
    
    const angle = Math.atan2(deltaLon, deltaLat) * 180 / Math.PI
    
    // Convert angle to cardinal direction
    if (angle >= -22.5 && angle < 22.5) return 'North'
    if (angle >= 22.5 && angle < 67.5) return 'Northeast'
    if (angle >= 67.5 && angle < 112.5) return 'East'
    if (angle >= 112.5 && angle < 157.5) return 'Southeast'
    if (angle >= 157.5 || angle < -157.5) return 'South'
    if (angle >= -157.5 && angle < -112.5) return 'Southwest'
    if (angle >= -112.5 && angle < -67.5) return 'West'
    if (angle >= -67.5 && angle < -22.5) return 'Northwest'
    
    return 'North' // Default fallback
  }

  // Get the closest POI to user's location
  const getClosestPOI = (userLat, userLon) => {
    if (!userLat || !userLon || pois.length === 0) return null

    let closest = null
    let minDistance = Infinity

    pois.forEach(poi => {
      // Parse coordinates from the Location field
      // Assuming Location field contains "latitude,longitude" format
      let poiLat, poiLon
      
      if (poi.Location && poi.Location.includes(',')) {
        const [lat, lon] = poi.Location.split(',').map(coord => parseFloat(coord.trim()))
        poiLat = lat
        poiLon = lon

      } else {
        // Skip POIs without valid coordinates

        return
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
          radius: 50, // Default radius in meters
          direction: getDirection(userLat, userLon, poiLat, poiLon)
        }
      }
    })

    return closest
  }

  // Check if user is within range of a POI
  const isWithinRange = (poi, distance) => {
    return distance <= (poi.radius || 50)
  }

  // Count POIs within 1 mile radius
  const getPOIsWithinOneMile = (userLat, userLon) => {
    if (!userLat || !userLon || pois.length === 0) return 0
    
    const ONE_MILE_IN_METERS = 1609.34 // 1 mile in meters
    let count = 0
    
    pois.forEach(poi => {
      if (poi.Location && poi.Location.includes(',')) {
        const [lat, lon] = poi.Location.split(',').map(coord => parseFloat(coord.trim()))
        const distance = getDistanceInMeters(userLat, userLon, lat, lon)
        
        if (distance <= ONE_MILE_IN_METERS) {
          count++
        }
      }
    })
    
    return count
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

  // Real location detection (no simulation)
  useEffect(() => {
    // Check if location permission is already granted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location permission already granted:', position.coords)
          setLocationEnabled(true)
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          if (pois.length > 0) {
            updatePOIStatus(position.coords.latitude, position.coords.longitude)
          }
        },
        (error) => {
          console.log('Location permission not granted yet:', error)
          // Don't set error here - user will click "Start Tour" to request permission
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 60000
        }
      )
    }
  }, [pois]) // Add pois as dependency so location updates when POIs load

  // Update POI status when POIs are loaded
  useEffect(() => {
    if (locationEnabled && userLocation && pois.length > 0) {
      updatePOIStatus(userLocation.latitude, userLocation.longitude)
    }
  }, [pois, locationEnabled, userLocation])

  // Real-time location updates (only when real location is enabled)
  useEffect(() => {
    if (!locationEnabled || !userLocation) return

    const locationUpdateInterval = setInterval(() => {
      // Get fresh location from device
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
            setUserLocation(newLocation)
            
            if (pois.length > 0) {
              updatePOIStatus(newLocation.latitude, newLocation.longitude)
            }
          },
          (error) => {
            console.log('Location update failed:', error)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000 // 30 seconds
          }
        )
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(locationUpdateInterval)
  }, [locationEnabled, userLocation, pois])

  const handleStartTour = () => {
    if (!locationEnabled) {
      // Get real location with high accuracy
      if (navigator.geolocation) {
        console.log('Requesting location permission...')
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Real location obtained:', position.coords)
            setLocationEnabled(true)
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            })
            if (pois.length > 0) {
              updatePOIStatus(position.coords.latitude, position.coords.longitude)
            }
          },
          (error) => {
            console.log('Location permission denied or error:', error)
            switch(error.code) {
              case error.PERMISSION_DENIED:
                setPoisError('Location access is required. Please allow location access in your browser settings.')
                break
              case error.POSITION_UNAVAILABLE:
                setPoisError('Location information is unavailable. Please try again.')
                break
              case error.TIMEOUT:
                setPoisError('Location request timed out. Please try again.')
                break
              default:
                setPoisError('Location access is required to use this app')
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          }
        )
      } else {
        setPoisError('Location services are not available on this device')
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
      return "Click 'Start Tour' to enable location and discover nearby landmarks"
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
                  <span className="text-gray-600 font-medium">
                    Monitoring {userLocation ? getPOIsWithinOneMile(userLocation.latitude, userLocation.longitude) : 0} landmarks
                  </span>
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
                    <span className="text-blue-600 font-semibold text-lg">Nearby: {activePOI.POI}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {activePOI.Script}
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
      const formattedDistance = formatDistance(distanceInFeet)
      const direction = closestPOI.direction
      
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
                  <span className="text-gray-600 font-medium">
                    Monitoring {userLocation ? getPOIsWithinOneMile(userLocation.latitude, userLocation.longitude) : 0} landmarks
                  </span>
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
                    <span className="text-orange-600 font-semibold text-lg">Closest Landmark: {closestPOI.POI}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm font-medium">
                    {formattedDistance} away, {direction}
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
    console.log('POIs state:', { pois: pois.length, poisLoading, poisError })
    if (pois.length === 0 && !poisLoading && !poisError) {
      // Try to get closest POI even if none are in range
      const closestPOI = userLocation ? getClosestPOI(userLocation.latitude, userLocation.longitude) : null
      
      if (closestPOI) {
        const distanceInFeet = metersToFeet(closestPOI.distance)
        const formattedDistance = formatDistance(distanceInFeet)
        const direction = closestPOI.direction
        
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
                    <span className="text-gray-600 font-medium">Closest Landmark</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {closestPOI.POI}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium">
                      {formattedDistance} away, {direction}
                    </p>
                  </div>
                  
                  <p className="text-gray-500 text-sm">
                    Walk {direction.toLowerCase()} to get closer to this location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      }
      
      // Fallback if no POIs at all
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
                  <span className="text-gray-600 font-medium">No Landmarks Available</span>
                </div>
                <p className="text-gray-500 text-sm">
                  No landmarks are currently available in your area.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-blue-50/30 to-orange-100/30">

      
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
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex justify-center"
            >
              <Globe className="w-24 h-24 text-blue-500" />
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