import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiPlay, BiPause, BiSkipPrevious, BiSkipNext, BiX } from 'react-icons/bi'

const ActiveTour = ({ onEndTour }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration] = useState(221) // 3:41 in seconds
  const [currentPOIIndex, setCurrentPOIIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  
  const progressIntervalRef = useRef(null)
  const titleIntervalRef = useRef(null)
  
  const poiTitles = [
    "Empire State Building",
    "Central Park", 
    "Times Square",
    "Brooklyn Bridge",
    "Statue of Liberty"
  ]

  // Simulate playback progress
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, totalDuration])

  // Animate POI titles (paused during playback)
  useEffect(() => {
    if (!isPlaying && isAnimating) {
      titleIntervalRef.current = setInterval(() => {
        setCurrentPOIIndex(prev => (prev + 1) % poiTitles.length)
      }, 3000)
    } else {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current)
      }
    }

    return () => {
      if (titleIntervalRef.current) {
        clearInterval(titleIntervalRef.current)
      }
    }
  }, [isPlaying, isAnimating, poiTitles.length])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    setIsAnimating(!isPlaying) // Pause animation when playing
  }

  const handlePrevious = () => {
    setCurrentTime(Math.max(0, currentTime - 30))
  }

  const handleNext = () => {
    setCurrentTime(Math.min(totalDuration, currentTime + 30))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = (currentTime / totalDuration) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-transparent to-orange-100">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center justify-between px-6 py-8 bg-white/80 backdrop-blur-ios border-b border-white/20"
        >
          <button
            onClick={onEndTour}
            className="flex items-center space-x-2 text-ios-primary font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            <BiX className="text-2xl" />
            <span>End Tour</span>
          </button>
          
          <h1 className="text-xl font-bold text-gray-800">Active Tour</h1>
          
          <div className="w-20"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between items-center px-8 py-12">
          {/* Animated POI Title Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-4 flex-1 flex flex-col justify-center"
          >
            {/* Animated Title */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentPOIIndex}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight"
              >
                {poiTitles[currentPOIIndex]}
              </motion.h2>
            </AnimatePresence>

            {/* Location Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="text-xl text-gray-600 font-medium"
            >
              New York, NY
            </motion.p>

            {/* Playback Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              className="flex items-center justify-center space-x-2 mt-8"
            >
              <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-600 font-medium">
                {isPlaying ? 'Playing' : 'Paused'}
              </span>
            </motion.div>
          </motion.div>

          {/* Audio Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-md space-y-6"
          >
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
              
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-8">
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                className="w-12 h-12 bg-white/80 backdrop-blur-ios rounded-full flex items-center justify-center shadow-ios-medium hover:shadow-ios-strong transition-all duration-200"
              >
                <BiSkipPrevious className="text-2xl text-gray-700" />
              </motion.button>

              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="w-16 h-16 bg-gradient-ios-blue rounded-full flex items-center justify-center shadow-ios-strong hover:shadow-ios-strong transition-all duration-200 transform"
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
                      <BiPause className="text-3xl text-white" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="play"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BiPlay className="text-3xl text-white ml-1" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="w-12 h-12 bg-white/80 backdrop-blur-ios rounded-full flex items-center justify-center shadow-ios-medium hover:shadow-ios-strong transition-all duration-200"
              >
                <BiSkipNext className="text-2xl text-gray-700" />
              </motion.button>
            </div>

            {/* Tour Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              className="text-center space-y-2"
            >
              <p className="text-sm text-gray-500">
                Tap to skip 30 seconds
              </p>
              <p className="text-xs text-gray-400">
                Tour progress: {Math.round(progressPercentage)}%
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ActiveTour 