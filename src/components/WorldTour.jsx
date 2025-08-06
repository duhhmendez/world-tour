import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toursData from '../data/tours.json'

// Loading Screen Component - iOS Style v2.0 - DEPLOYMENT FORCE
const LoadingView = () => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Globe Icon - FORCE DEPLOYMENT */}
        <div className={`text-8xl text-blue-500 transition-all duration-2000 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          🌍
        </div>
        
        {/* App Name with Fade-in Animation */}
        <h1 className={`text-5xl font-bold text-gray-800 transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          World Tour - iOS Style
        </h1>
        
        {/* Loading Spinner */}
        <div className={`flex justify-center transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
}

// Home View Component - iOS Style v2.0 - DEPLOYMENT FORCE
const HomeView = ({ locationManager, onStartTour, onOpenSettings }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative">
        {/* Settings Button - iOS Style */}
        <button
          onClick={onOpenSettings}
          className="absolute top-6 right-6 w-11 h-11 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
        >
          <span className="text-gray-600 text-xl">⚙️</span>
        </button>

        <div className="text-center space-y-12 mb-12">
          {/* Large Globe Icon - FORCE DEPLOYMENT */}
          <div className="text-8xl text-blue-500 mb-6">🌍</div>
          
          {/* App Title */}
          <h1 className="text-5xl font-bold text-gray-800">World Tour - iOS Style</h1>
        </div>

        {/* Location Status - iOS Style */}
        {locationManager.isMonitoring && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <span className="text-green-500 text-xl">📍</span>
              <span className="text-gray-600 font-medium">Monitoring {toursData.pois.length} locations</span>
            </div>
            {locationManager.activePOI && (
              <div className="text-center">
                <p className="text-blue-600 font-medium">Nearby: {locationManager.activePOI.poiName}</p>
                <p className="text-gray-500 text-sm">Tap to start tour</p>
              </div>
            )}
          </div>
        )}

        {/* Start Tour Button - iOS Style */}
        <button
          onClick={onStartTour}
          className="w-full max-w-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-4 mb-8"
        >
          <span className="text-2xl">
            {locationManager.isLocationEnabled ? '🎧' : '📍'}
          </span>
          <span className="text-xl font-semibold">
            {locationManager.isLocationEnabled ? 'Start Tour' : 'Enable Location'}
          </span>
        </button>

        {/* Subtitle - iOS Style */}
        <p className="text-center text-gray-600 text-lg max-w-sm leading-relaxed">
          {locationManager.isLocationEnabled 
            ? 'Connect your headphones and start walking—World Tour will guide you.'
            : 'Enable location to discover nearby landmarks'
          }
        </p>
      </div>
    </div>
  )
}

// Active Tour View Component - iOS Style
const ActiveTourView = ({ currentPOI, onEndTour, onPlayTour, onStopTour, isPlaying, currentTime, audioLength }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [currentPOI])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const progress = (currentTime / audioLength) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      <div className="flex flex-col h-screen">
        {/* Header - iOS Style */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={onEndTour}
            className="text-red-500 font-semibold text-lg"
          >
            End Tour
          </button>
          <h2 className="text-xl font-semibold text-gray-800">Active Tour</h2>
          <div className="w-16"></div>
        </div>

        {/* Main Content - iOS Style */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* POI Info - iOS Style */}
          <div className="text-center space-y-6 mb-16">
            <h1 className={`text-4xl font-bold text-gray-800 transition-all duration-800 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {currentPOI?.poiName || 'Nearby Tour'}
            </h1>
            <p className="text-gray-600 text-xl">New York, NY</p>
          </div>

          {/* Audio Controls - iOS Style */}
          <div className="w-full max-w-md space-y-8">
            {/* Progress Bar - iOS Style */}
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioLength)}</span>
              </div>
            </div>

            {/* Playback Controls - iOS Style */}
            <div className="flex items-center justify-center space-x-12">
              <button className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">⏮️</span>
              </button>
              
              <button
                onClick={isPlaying ? onStopTour : onPlayTour}
                className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl"
              >
                <span className="text-3xl text-white">
                  {isPlaying ? '⏸️' : '▶️'}
                </span>
              </button>
              
              <button className="w-14 h-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">⏭️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings View Component - iOS Style
const SettingsView = ({ onClose }) => {
  const [voiceGender, setVoiceGender] = useState('neutral')
  const [voiceTone, setVoiceTone] = useState('friendly')
  const [backgroundAmbience, setBackgroundAmbience] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      <div className="flex justify-between items-center p-6">
        <button onClick={onClose} className="text-blue-500 font-semibold text-lg">
          Done
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <div className="w-12"></div>
      </div>

      <div className="px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
          {/* Voice Settings - iOS Style */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Voice Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">Voice Gender</p>
                  <p className="text-sm text-gray-500">Choose the voice for audio guides</p>
                </div>
                <select 
                  value={voiceGender} 
                  onChange={(e) => setVoiceGender(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2 bg-white"
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
                  className="border border-gray-200 rounded-xl px-4 py-2 bg-white"
                >
                  <option value="friendly">Friendly</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="playful">Playful</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Settings - iOS Style */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Audio Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Background Ambience</p>
                <p className="text-sm text-gray-500">Play ambient sounds during tours</p>
              </div>
              <input
                type="checkbox"
                checked={backgroundAmbience}
                onChange={(e) => setBackgroundAmbience(e.target.checked)}
                className="w-6 h-6 text-blue-500 rounded"
              />
            </div>
          </div>

          {/* App Settings - iOS Style */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">App Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Offline Mode</p>
                <p className="text-sm text-gray-500">Use downloaded content only</p>
              </div>
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="w-6 h-6 text-blue-500 rounded"
              />
            </div>
          </div>

          {/* About - iOS Style */}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">About</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Version</p>
                <p className="text-sm text-gray-500">1.0.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main WorldTour Component
const WorldTour = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('home') // 'home', 'active-tour', 'settings'
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyPOI, setNearbyPOI] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isLocationEnabled, setIsLocationEnabled] = useState(false)
  const speechRef = useRef(null)
  const progressTimerRef = useRef(null)

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  // Find the closest POI within radius
  const findNearbyPOI = (userLat, userLon) => {
    let closestPOI = null
    let minDistance = Infinity

    toursData.pois.forEach(poi => {
      const distance = calculateDistance(userLat, userLon, poi.latitude, poi.longitude)
      if (distance <= poi.radius && distance < minDistance) {
        minDistance = distance
        closestPOI = { ...poi, distance: Math.round(distance) }
      }
    })

    return closestPOI
  }

  // Get user location
  const getCurrentLocation = () => {
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        setIsLocationEnabled(true)
        
        const nearby = findNearbyPOI(latitude, longitude)
        setNearbyPOI(nearby)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  // Start location monitoring
  const startLocationTracking = () => {
    setIsMonitoring(true)
    getCurrentLocation()
  }

  // Stop location monitoring
  const stopLocationTracking = () => {
    setIsMonitoring(false)
    setNearbyPOI(null)
  }

  // Play audio tour
  const playTour = () => {
    if (!nearbyPOI) return

    if (speechRef.current) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(nearbyPOI.script)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsPlaying(true)
      startProgressSimulation()
    }
    
    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      stopProgressSimulation()
    }
    
    utterance.onerror = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      stopProgressSimulation()
    }

    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  // Stop audio tour
  const stopTour = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentTime(0)
      stopProgressSimulation()
    }
  }

  // Start progress simulation
  const startProgressSimulation = () => {
    progressTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev < nearbyPOI.audioLength) {
          return prev + 1
        } else {
          setIsPlaying(false)
          stopProgressSimulation()
          return prev
        }
      })
    }, 1000)
  }

  // Stop progress simulation
  const stopProgressSimulation = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }

  // Handle start tour
  const handleStartTour = () => {
    if (!isLocationEnabled) {
      getCurrentLocation()
    } else {
      startLocationTracking()
      setCurrentView('active-tour')
    }
  }

  // Handle end tour
  const handleEndTour = () => {
    stopLocationTracking()
    stopTour()
    setCurrentView('home')
  }

  // Handle open settings
  const handleOpenSettings = () => {
    setCurrentView('settings')
  }

  // Location manager object for components
  const locationManager = {
    isMonitoring,
    isLocationEnabled,
    activePOI: nearbyPOI
  }

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel()
      }
      stopProgressSimulation()
    }
  }, [])

  if (isLoading) {
    return <LoadingView />
  }

  if (currentView === 'settings') {
    return <SettingsView onClose={() => setCurrentView('home')} />
  }

  if (currentView === 'active-tour') {
    return (
      <ActiveTourView
        currentPOI={nearbyPOI}
        onEndTour={handleEndTour}
        onPlayTour={playTour}
        onStopTour={stopTour}
        isPlaying={isPlaying}
        currentTime={currentTime}
        audioLength={nearbyPOI?.audioLength || 0}
      />
    )
  }

  return (
    <HomeView 
      locationManager={locationManager}
      onStartTour={handleStartTour}
      onOpenSettings={handleOpenSettings}
    />
  )
}

export default WorldTour 