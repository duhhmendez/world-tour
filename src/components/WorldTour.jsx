import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toursData from '../data/tours.json'

// Loading Screen Component
const LoadingView = () => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className={`text-6xl text-blue-500 transition-all duration-1000 ${isAnimating ? 'scale-110' : 'scale-100'}`}>
          🌍
        </div>
        <h1 className="text-4xl font-bold text-gray-800 opacity-0 animate-fade-in">
          World Tour
        </h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  )
}

// Home View Component
const HomeView = ({ locationManager, onStartTour, onOpenSettings }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative">
        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <span className="text-gray-600">⚙️</span>
        </button>

        <div className="text-center space-y-8 mb-12">
          <div className="text-6xl">🌍</div>
          <h1 className="text-4xl font-bold text-gray-800">World Tour</h1>
        </div>

        {/* Location Status */}
        {locationManager.isMonitoring && (
          <div className="bg-white rounded-xl p-4 mb-8 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-green-500">📍</span>
              <span className="text-sm text-gray-600">Monitoring {toursData.pois.length} locations</span>
            </div>
            {locationManager.activePOI && (
              <div className="text-center">
                <p className="text-sm text-blue-600">Nearby: {locationManager.activePOI.poiName}</p>
                <p className="text-xs text-gray-500">Tap to start tour</p>
              </div>
            )}
          </div>
        )}

        {/* Start Tour Button */}
        <button
          onClick={onStartTour}
          className="w-full max-w-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <span className="text-xl">
            {locationManager.isLocationEnabled ? '🎧' : '📍'}
          </span>
          <span className="text-lg font-semibold">
            {locationManager.isLocationEnabled ? 'Start Tour' : 'Enable Location'}
          </span>
        </button>

        <p className="text-center text-gray-600 mt-4 max-w-sm">
          {locationManager.isLocationEnabled 
            ? 'Connect your headphones and start walking—World Tour will guide you.'
            : 'Enable location to discover nearby landmarks'
          }
        </p>
      </div>
    </div>
  )
}

// Active Tour View Component
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={onEndTour}
            className="text-red-500 font-medium"
          >
            End Tour
          </button>
          <h2 className="text-lg font-semibold">Active Tour</h2>
          <div className="w-16"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* POI Info */}
          <div className="text-center space-y-4 mb-12">
            <h1 className={`text-3xl font-bold text-gray-800 transition-all duration-800 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              {currentPOI?.poiName || 'Nearby Tour'}
            </h1>
            <p className="text-gray-600">New York, NY</p>
          </div>

          {/* Audio Controls */}
          <div className="w-full max-w-md space-y-8">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioLength)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-12">
              <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏮️</span>
              </button>
              
              <button
                onClick={isPlaying ? onStopTour : onPlayTour}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-2xl text-white">
                  {isPlaying ? '⏸️' : '▶️'}
                </span>
              </button>
              
              <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xl">⏭️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Settings View Component
const SettingsView = ({ onClose }) => {
  const [voiceGender, setVoiceGender] = useState('neutral')
  const [voiceTone, setVoiceTone] = useState('friendly')
  const [backgroundAmbience, setBackgroundAmbience] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="flex justify-between items-center p-6">
        <button onClick={onClose} className="text-blue-500 font-medium">
          Done
        </button>
        <h1 className="text-xl font-semibold">Settings</h1>
        <div className="w-12"></div>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Voice Settings */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Voice Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voice Gender</p>
                  <p className="text-sm text-gray-500">Choose the voice for audio guides</p>
                </div>
                <select 
                  value={voiceGender} 
                  onChange={(e) => setVoiceGender(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Voice Tone</p>
                  <p className="text-sm text-gray-500">Select the tone of voice narration</p>
                </div>
                <select 
                  value={voiceTone} 
                  onChange={(e) => setVoiceTone(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2"
                >
                  <option value="friendly">Friendly</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="playful">Playful</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Audio Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Background Ambience</p>
                <p className="text-sm text-gray-500">Play ambient sounds during tours</p>
              </div>
              <input
                type="checkbox"
                checked={backgroundAmbience}
                onChange={(e) => setBackgroundAmbience(e.target.checked)}
                className="w-6 h-6 text-blue-500"
              />
            </div>
          </div>

          {/* App Settings */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold mb-4">App Settings</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Offline Mode</p>
                <p className="text-sm text-gray-500">Use downloaded content only</p>
              </div>
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="w-6 h-6 text-blue-500"
              />
            </div>
          </div>

          {/* About */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">About</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Version</p>
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

  // Stop location tracking
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