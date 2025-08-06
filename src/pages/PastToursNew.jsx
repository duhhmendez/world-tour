import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Volume2, 
  MapPin, 
  Clock, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Headphones,
  X
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const PastToursNew = () => {
  const [pastTours] = useState([
    {
      id: 1,
      title: "Brooklyn Bridge Walk",
      location: "New York, NY",
      date: "Today",
      duration: "3:45",
      transcript: "Welcome to the Brooklyn Bridge, one of the most iconic landmarks in New York City. Built in 1883, this magnificent structure spans the East River, connecting Manhattan and Brooklyn. As you walk across this historic bridge, you'll experience breathtaking views of the Manhattan skyline and the Statue of Liberty in the distance. The bridge's Gothic arches and steel cables create a stunning architectural masterpiece that has inspired countless artists and photographers.",
      icon: "🌉",
      color: "blue"
    },
    {
      id: 2,
      title: "Central Park Adventure",
      location: "New York, NY",
      date: "Yesterday",
      duration: "2:30",
      transcript: "Step into the heart of Manhattan at Central Park, an urban oasis spanning 843 acres. Designed by Frederick Law Olmsted and Calvert Vaux, this green sanctuary offers a perfect escape from the city's hustle and bustle. From the Bethesda Fountain to the Bow Bridge, every corner tells a story. The park's winding paths, serene lakes, and hidden gardens provide endless opportunities for discovery and relaxation.",
      icon: "🌳",
      color: "green"
    },
    {
      id: 3,
      title: "Times Square Experience",
      location: "New York, NY",
      date: "2 days ago",
      duration: "1:55",
      transcript: "Welcome to Times Square, the crossroads of the world! This vibrant intersection is the heart of Manhattan's theater district and a global symbol of New York City. The dazzling neon lights and massive digital billboards create an electrifying atmosphere that's uniquely New York. From the iconic New Year's Eve ball drop to the bustling crowds of tourists and locals, Times Square never sleeps.",
      icon: "🎭",
      color: "purple"
    },
    {
      id: 4,
      title: "Empire State Building Tour",
      location: "New York, NY",
      date: "1 week ago",
      duration: "4:20",
      transcript: "Rising 1,454 feet above Manhattan, the Empire State Building stands as a testament to American ingenuity and ambition. Completed in 1931 during the Great Depression, this Art Deco masterpiece held the title of world's tallest building for nearly 40 years. The building's distinctive setbacks and limestone facade create a timeless elegance that continues to define the New York skyline.",
      icon: "🏢",
      color: "orange"
    },
    {
      id: 5,
      title: "Statue of Liberty Visit",
      location: "New York, NY",
      date: "2 weeks ago",
      duration: "3:15",
      transcript: "Standing proudly in New York Harbor, the Statue of Liberty has welcomed millions of immigrants to America since 1886. This copper statue, a gift from France, symbolizes freedom and democracy. Lady Liberty's torch illuminates the path to a new beginning, while her crown's seven spikes represent the seven continents and seas. The statue remains one of the most powerful symbols of American values and hope.",
      icon: "🗽",
      color: "red"
    }
  ])

  const [selectedTour, setSelectedTour] = useState(null)
  const [showTranscript, setShowTranscript] = useState(false)

  const formatDate = (dateString) => {
    return dateString
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

  const handleViewTranscript = (tour) => {
    setSelectedTour(tour)
    setShowTranscript(true)
  }

  const handleCloseTranscript = () => {
    setShowTranscript(false)
    setSelectedTour(null)
  }

  const TourCard = ({ tour, index }) => (
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
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getColorClasses(tour.color)}`}>
                {tour.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{tour.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="text-blue-500 w-4 h-4" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="text-green-500 w-4 h-4" />
                    <span>{tour.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <Calendar className="text-gray-400 w-4 h-4" />
              <span>{formatDate(tour.date)}</span>
            </div>
          </div>

          {/* Transcript Preview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-purple-500 w-4 h-4" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transcript Preview</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {truncateText(tour.transcript)}
            </p>
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Button
              onClick={() => handleViewTranscript(tour)}
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

  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8"
    >
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
            {pastTours.length === 0 ? (
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
    </div>
  )
}

export default PastToursNew 