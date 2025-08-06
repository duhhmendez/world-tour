import React, { useState, useEffect } from 'react'
import { fetchTours } from '../lib/supabaseClient'

const Tours = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTours()
  }, [])

  const loadTours = async () => {
    try {
      setLoading(true)
      setError(null)
      const toursData = await fetchTours()
      setTours(toursData)
    } catch (err) {
      setError('Failed to load tours. Please try again.')
      console.error('Error loading tours:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadTours()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="text-6xl text-blue-500">🌍</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading tours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50 flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <div className="text-6xl text-red-500">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800">Oops!</h2>
          <p className="text-gray-600 max-w-sm">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      {/* Header - iOS Style */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">All Tours</h1>
          <button
            onClick={handleRefresh}
            className="text-blue-500 font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tours List - iOS Style */}
      <div className="p-6">
        {tours.length === 0 ? (
          <div className="text-center space-y-6 py-12">
            <div className="text-6xl text-gray-400">🌍</div>
            <h2 className="text-2xl font-bold text-gray-800">No Tours Available</h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Tours will appear here once they're added to the database.
            </p>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const TourCard = ({ tour }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioLength] = useState(180) // Default 3 minutes
  const speechRef = React.useRef(null)
  const progressTimerRef = React.useRef(null)

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const playTour = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(tour.description)
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

  const stopTour = () => {
    if (speechRef.current) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentTime(0)
      stopProgressSimulation()
    }
  }

  const startProgressSimulation = () => {
    progressTimerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        if (prev < audioLength) {
          return prev + 1
        } else {
          setIsPlaying(false)
          stopProgressSimulation()
          return prev
        }
      })
    }, 1000)
  }

  const stopProgressSimulation = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }

  React.useEffect(() => {
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel()
      }
      stopProgressSimulation()
    }
  }, [])

  const progress = (currentTime / audioLength) * 100

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      {/* Tour Header - iOS Style */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>
            <p className="text-gray-600 font-medium">{tour.location}</p>
          </div>
          <div className="text-4xl ml-4">🌍</div>
        </div>
        
        <p className="text-gray-600 leading-relaxed">{tour.description}</p>
      </div>

      {/* Audio Controls - iOS Style */}
      <div className="p-6">
        {/* Progress Bar */}
        <div className="space-y-3 mb-6">
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
        <div className="flex items-center justify-center space-x-8">
          <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <span className="text-xl">⏮️</span>
          </button>
          
          <button
            onClick={isPlaying ? stopTour : playTour}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
          >
            <span className="text-2xl text-white">
              {isPlaying ? '⏸️' : '▶️'}
            </span>
          </button>
          
          <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <span className="text-xl">⏭️</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tours 