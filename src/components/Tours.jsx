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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">All Tours</h1>
          <button
            onClick={handleRefresh}
            className="text-blue-500 font-medium"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4">
        {tours.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-6">🌍</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Tours Available</h2>
            <p className="text-gray-500 text-center max-w-sm">
              Tours will appear here once they're added to the database.
            </p>
          </div>
        ) : (
          // Tours grid
          <div className="grid gap-4">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Tour Card Component
const TourCard = ({ tour }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(null)

  const handlePlayAudio = () => {
    if (!tour.audio_url) {
      alert('No audio available for this tour.')
      return
    }

    if (isPlaying) {
      // Stop audio
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
      setIsPlaying(false)
      setAudio(null)
    } else {
      // Play audio
      const newAudio = new Audio(tour.audio_url)
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false)
        setAudio(null)
      })
      newAudio.addEventListener('error', () => {
        alert('Failed to play audio. Please check the audio URL.')
        setIsPlaying(false)
        setAudio(null)
      })
      
      newAudio.play()
      setIsPlaying(true)
      setAudio(newAudio)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-ios-soft overflow-hidden">
      <div className="p-6">
        {/* Tour Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>
            <p className="text-gray-600 mb-3">{tour.location}</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center ml-4">
            <span className="text-white text-lg">🎧</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {tour.description}
        </p>

        {/* Audio Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePlayAudio}
              disabled={!tour.audio_url}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                tour.audio_url
                  ? isPlaying
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-lg">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
              <span>
                {isPlaying ? 'Stop' : 'Play Audio'}
              </span>
            </button>
          </div>

          {!tour.audio_url && (
            <span className="text-sm text-gray-500">No audio available</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tours 