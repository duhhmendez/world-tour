import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiWorld } from 'react-icons/bi'

const LoadingScreen = ({ onComplete }) => {
  const [showTitle, setShowTitle] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    // Trigger title animation after a short delay
    const titleTimer = setTimeout(() => {
      setShowTitle(true)
    }, 500)

    // Trigger spinner animation after title
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true)
    }, 1200)

    // Complete loading after 3 seconds
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(spinnerTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50/20 via-blue-100/15 to-orange-50/10 flex items-center justify-center"
    >
      <div className="text-center space-y-8">
        {/* Globe Icon with Subtle Scale Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.1, 1],
            opacity: 1
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            scale: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
          className="flex justify-center"
        >
          <BiWorld className="text-[100px] text-blue-500" />
        </motion.div>

        {/* App Title with Fade-in Animation */}
        <AnimatePresence>
          {showTitle && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
              className="text-5xl font-bold text-gray-800"
            >
              World Tour
            </motion.h1>
          )}
        </AnimatePresence>

        {/* Loading Spinner with Fade-in Animation */}
        <AnimatePresence>
          {showSpinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
              className="flex justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-12 h-12 border-2 border-blue-200 border-t-blue-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default LoadingScreen 