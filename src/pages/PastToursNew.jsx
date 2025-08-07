import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, 
  MapPin, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Headphones,
  X,
  LogIn
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { useAuth } from '../contexts/AuthContext'
import { fetchTourHistory } from '../lib/supabaseClient'
import Login from '../components/Login'

const PastToursNew = () => {
    const [pastTours, setPastTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const { user, isAuthenticated } = useAuth()

  const [selectedTour, setSelectedTour] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)

  // Load tour history when user is authenticated
  useEffect(() => {
    const loadTourHistory = async () => {
      if (isAuthenticated && user) {
        setLoading(true)
        try {
          const tours = await fetchTourHistory(user.id)
          setPastTours(tours)
        } catch (error) {
          console.error('Error loading tour history:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    loadTourHistory()
  }, [isAuthenticated, user])


  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const truncateText = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600"
    }
    return colors[color] || colors.blue
  }

  const getTourIcon = (title) => {
    const titleLower = title?.toLowerCase() || ''
    if (titleLower.includes('bridge')) return '🌉'
    if (titleLower.includes('park')) return '🌳'
    if (titleLower.includes('square')) return '🎭'
    if (titleLower.includes('building')) return '🏢'
    if (titleLower.includes('statue') || titleLower.includes('liberty')) return '🗽'
    if (titleLower.includes('museum')) return '🏛️'
    if (titleLower.includes('church')) return '⛪'
    if (titleLower.includes('tower')) return '🗼'
    if (titleLower.includes('castle')) return '🏰'
    if (titleLower.includes('garden')) return '🌺'
    return '📍'
  }

  const getTourColor = (title) => {
    const titleLower = title?.toLowerCase() || ''
    if (titleLower.includes('bridge')) return 'blue'
    if (titleLower.includes('park')) return 'green'
    if (titleLower.includes('square')) return 'purple'
    if (titleLower.includes('building')) return 'orange'
    if (titleLower.includes('statue') || titleLower.includes('liberty')) return 'red'
    if (titleLower.includes('museum')) return 'purple'
    if (titleLower.includes('church')) return 'blue'
    if (titleLower.includes('tower')) return 'orange'
    if (titleLower.includes('castle')) return 'red'
    if (titleLower.includes('garden')) return 'green'
    return 'blue'
  }

  const handleViewTranscript = (tour) => {
    setSelectedTour(tour)
    setShowTranscript(true)
  }

  const handleCloseTranscript = () => {
    setShowTranscript(false)
    setSelectedTour(null)
  }

  const TourCard = ({ tour, index }) => {
    // Map tour data from Supabase to display format
    const tourData = {
      id: tour.id,
      title: tour.poi_name || 'Unknown Tour',
      location: tour.location || 'Unknown Location',
      date: tour.completed_at,
      duration: formatDuration(tour.duration_seconds || 0),
      transcript: tour.transcript || 'No transcript available',
      icon: getTourIcon(tour.poi_name),
      color: getTourColor(tour.poi_name)
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
        className="w-full"
      >
        <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-white/90 backdrop-blur-sm border-white/30 shadow-lg">
          <CardContent className="p-6">
            {/* Header with Icon and Title */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getColorClasses(tourData.color)}`}>
                  {tourData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{tourData.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="text-blue-500 w-4 h-4" />
                      <span>{tourData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="text-green-500 w-4 h-4" />
                      <span>{tourData.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-400">
                <Calendar className="text-gray-400 w-4 h-4" />
                <span>{formatDate(tourData.date)}</span>
              </div>
            </div>

            {/* Transcript Preview */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="text-purple-500 w-4 h-4" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transcript Preview</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {truncateText(tourData.transcript)}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                onClick={() => handleViewTranscript(tourData)}
                variant="ios"
                size="sm"
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <span>View Full Transcript</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8"
    >
      {!isAuthenticated ? (
        <>
          {/* Icon */}
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
            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
          >
            <LogIn className="text-4xl text-gray-400" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 mb-3"
          >
            Sign In Required
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="text-gray-600 text-lg leading-relaxed max-w-sm mb-6"
          >
            Sign in to view your tour history and save completed tours
          </motion.p>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
          >
            <Button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              Sign In
            </Button>
          </motion.div>
        </>
      ) : (
        <>
          {/* Icon */}
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
            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
          >
            <Headphones className="text-4xl text-gray-400" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-2xl font-bold text-gray-800 mb-3"
          >
            No Past Tours
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="text-gray-600 text-lg leading-relaxed max-w-sm"
          >
            Your completed tours will appear here
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            className="text-gray-400 text-sm mt-4"
          >
            Start exploring to create your first tour
          </motion.p>
        </>
      )}
    </motion.div>
  )

  const TranscriptModal = () => (
    <AnimatePresence>
      {showTranscript && selectedTour && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseTranscript}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getColorClasses(selectedTour.color)}`}>
                    {selectedTour.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedTour.title}</h3>
                    <p className="text-sm text-gray-500">{selectedTour.location}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseTranscript}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Tour Details */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedTour.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTour.duration}</span>
                </div>
              </div>
            </div>

            {/* Transcript Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Full Transcript
              </h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selectedTour.transcript}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/20 via-blue-50/10 to-orange-100/10">
      <div className="flex flex-col h-screen">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-6 sticky top-0 z-10 shadow-sm"
        >
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-800">Past Tours</h1>
          </div>
        </motion.div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : pastTours.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {pastTours.map((tour, index) => (
                  <TourCard 
                    key={tour.id} 
                    tour={tour} 
                    index={index}
                  />
                ))}
                
                {/* Bottom Spacing */}
                <div className="h-8"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal />

      {/* Login Modal */}
      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />

    </div>
  )
}

export default PastToursNew 