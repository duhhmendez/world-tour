import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Volume2,
  MapPin
} from 'lucide-react'
import { Button } from '../components/ui/button'


const ActiveTourNew = ({ onEndTour, pois = [] }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(180)
  const [currentPOIIndex, setCurrentPOIIndex] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [scrubTime, setScrubTime] = useState(0)
  const progressRef = useRef(null)

  // Use POIs from props or fallback to empty array
  const currentLocationPOIs = pois.length > 0 ? pois.map(poi => ({
    id: poi.id,
    title: poi.POI,
    description: poi.Script,
    audioLength: 180, // Default audio length
    location: poi.Location || "Unknown Location"
  })) : []

  const currentPOI = currentLocationPOIs[currentPOIIndex] || {
    id: "default",
    title: "No POI Available",
    description: "No points of interest are currently available.",
    audioLength: 180,
    location: "Unknown Location"
  }

  const isFirstPOI = currentPOIIndex === 0
  const isLastPOI = currentPOIIndex === currentLocationPOIs.length - 1

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // TTS Audio playback
  useEffect(() => {
    let interval
    if (isPlaying && currentTime < totalTime) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          if (newTime >= totalTime) {
            setIsPlaying(false)
            // Stop TTS when audio finishes
            window.speechSynthesis.cancel()
            return totalTime
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, totalTime])

  // Update total time when POI changes
  useEffect(() => {
    setTotalTime(currentPOI.audioLength)
    setCurrentTime(0)
    setIsPlaying(false)
    // Stop any existing TTS when POI changes
    window.speechSynthesis.cancel()
  }, [currentPOIIndex, currentPOI.audioLength])

  // Cleanup TTS when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Start TTS
      window.speechSynthesis.cancel() // Cancel any existing speech
      
      const utterance = new SpeechSynthesisUtterance(currentPOI.description)
      
      // Set voice and rate for better sound
      const voices = window.speechSynthesis.getVoices()
      utterance.voice = voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) || voices[0]
      utterance.rate = 0.95 // slightly slower
      
      // Speak the script
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    } else {
      // Pause TTS
      window.speechSynthesis.pause()
      setIsPlaying(false)
    }
  }

  const handlePrevious = () => {
    if (!isFirstPOI) {
      // Stop current TTS
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentPOIIndex(prev => prev - 1)
    }
  }

  const handleNext = () => {
    if (!isLastPOI) {
      // Stop current TTS
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentPOIIndex(prev => prev + 1)
    }
  }

  const handleProgressClick = (e) => {
    if (!progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const progressWidth = rect.width
    const percentage = clickX / progressWidth
    const newTime = Math.floor(percentage * totalTime)

    setCurrentTime(newTime)
    setScrubTime(newTime)
  }

  const handleProgressMouseDown = (e) => {
    setIsScrubbing(true)
    handleProgressClick(e)
  }

  const handleProgressMouseMove = (e) => {
    if (isScrubbing) {
      handleProgressClick(e)
    }
  }

  const handleProgressMouseUp = () => {
    setIsScrubbing(false)
  }

  const handleEndTour = () => {
    // Stop any active TTS
    window.speechSynthesis.cancel()
    onEndTour()
  }

  // Show empty state if no POIs
  if (currentLocationPOIs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/5 via-blue-50/5 to-orange-100/5">
        <div className="flex flex-col h-screen">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10"
          >
            <div className="flex items-center justify-between">
              <div className="w-16"></div>
              <h1 className="text-xl font-bold text-gray-800">Active Tour</h1>
              <button
                onClick={handleEndTour}
                className="text-red-500 font-medium hover:text-red-600 transition-colors duration-200"
              >
                End Tour
              </button>
            </div>
          </motion.div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">No Points of Interest</h2>
                <p className="text-gray-600">No tour locations are currently available.</p>
              </div>
              <Button
                onClick={handleEndTour}
                variant="ios"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Return to Home
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/5 via-blue-50/5 to-orange-100/5">
      <div className="flex flex-col h-screen">
        {/* Header / Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10"
        >
          <div className="flex items-center justify-between">
            <div className="w-16"></div> {/* Spacer for centering */}

            <h1 className="text-xl font-bold text-gray-800">Active Tour</h1>

            <button
              onClick={handleEndTour}
              className="text-red-500 font-medium hover:text-red-600 transition-colors duration-200"
            >
              End Tour
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between px-6 py-8">
          {/* Dynamic POI Info Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            {/* POI Title */}
            <motion.h2
              key={currentPOI.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl font-bold text-gray-800 leading-tight"
            >
              {currentPOI.title}
            </motion.h2>

            {/* Location Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="flex items-center justify-center space-x-2"
            >
              <MapPin className="text-gray-500 w-4 h-4" />
              <span className="text-gray-600 font-medium">{currentPOI.location}</span>
            </motion.div>

            {/* POI Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto"
            >
              {currentPOI.description}
            </motion.p>
          </motion.div>

          {/* Audio Playback Controls */}
          <div className="space-y-8">
            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="relative w-full h-3 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
                onClick={handleProgressClick}
                onMouseDown={handleProgressMouseDown}
                onMouseMove={handleProgressMouseMove}
                onMouseUp={handleProgressMouseUp}
                onMouseLeave={handleProgressMouseUp}
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${((isScrubbing ? scrubTime : currentTime) / totalTime) * 100}%`
                  }}
                  transition={{ duration: 0.1 }}
                />

                {/* Scrub Handle */}
                <motion.div
                  className="absolute top-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg transform -translate-y-1/2"
                  style={{
                    left: `${((isScrubbing ? scrubTime : currentTime) / totalTime) * 100}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatTime(isScrubbing ? scrubTime : currentTime)}</span>
                <span>{formatTime(totalTime)}</span>
              </div>
            </motion.div>

            {/* Playback Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="flex items-center justify-center space-x-8"
            >
              {/* Previous Button */}
              <button
                onClick={handlePrevious}
                disabled={isFirstPOI}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isFirstPOI
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg active:scale-95'
                }`}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play/Pause Button */}
              <motion.button
                onClick={handlePlayPause}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {isPlaying ? (
                    <motion.div
                      key="pause"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Pause className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-6 h-6 ml-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={isLastPOI}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isLastPOI
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-lg active:scale-95'
                }`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Navigation Hint */}
            {isLastPOI && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
                className="text-center"
              >
                <p className="text-gray-500 text-sm">
                  End Tour to return to see nearby tours
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveTourNew 