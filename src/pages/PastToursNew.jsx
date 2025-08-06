import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, MapPin, Clock, Calendar, BookOpen, ArrowRight, Headphones } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

const PastToursNew = () => {
  const [pastTours] = useState([
    {
      id: 1,
      title: "Brooklyn Bridge Walk",
      location: "New York, NY",
      date: "Today",
      duration: "3:45",
      transcript: "Welcome to the Brooklyn Bridge, one of the most iconic landmarks in New York City. Built in 1883, this magnificent structure spans the East River, connecting Manhattan and Brooklyn. As you walk across this historic bridge, you'll experience breathtaking views of the Manhattan skyline and the Statue of Liberty in the distance.",
      icon: "🌉",
      color: "blue"
    },
    {
      id: 2,
      title: "Central Park Adventure",
      location: "New York, NY",
      date: "Yesterday",
      duration: "2:30",
      transcript: "Step into the heart of Manhattan at Central Park, an urban oasis spanning 843 acres. Designed by Frederick Law Olmsted and Calvert Vaux, this green sanctuary offers a perfect escape from the city's hustle and bustle. From the Bethesda Fountain to the Bow Bridge, every corner tells a story.",
      icon: "🌳",
      color: "green"
    },
    {
      id: 3,
      title: "Times Square Experience",
      location: "New York, NY",
      date: "2 days ago",
      duration: "1:55",
      transcript: "Welcome to Times Square, the crossroads of the world! This vibrant intersection is the heart of Manhattan's theater district and a global symbol of New York City. The dazzling neon lights and massive digital billboards create an electrifying atmosphere that's uniquely New York.",
      icon: "🎭",
      color: "purple"
    },
    {
      id: 4,
      title: "Empire State Building Tour",
      location: "New York, NY",
      date: "1 week ago",
      duration: "4:20",
      transcript: "Rising 1,454 feet above Manhattan, the Empire State Building stands as a testament to American ingenuity and ambition. Completed in 1931 during the Great Depression, this Art Deco masterpiece held the title of world's tallest building for nearly 40 years.",
      icon: "🏢",
      color: "orange"
    },
    {
      id: 5,
      title: "Statue of Liberty Visit",
      location: "New York, NY",
      date: "2 weeks ago",
      duration: "3:15",
      transcript: "Standing proudly in New York Harbor, the Statue of Liberty has welcomed millions of immigrants to America since 1886. This copper statue, a gift from France, symbolizes freedom and democracy. Lady Liberty's torch illuminates the path to a new beginning.",
      icon: "🗽",
      color: "red"
    }
  ])

  const formatDate = (dateString) => {
    return dateString
  }

  const truncateText = (text, maxLength = 80) => {
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

  const TourCard = ({ tour }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${getColorClasses(tour.color)}`}>
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
              variant="ios"
              size="sm"
              className="w-full flex items-center justify-center space-x-2"
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
        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/30"
      >
        <Headphones className="text-4xl text-white" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="text-2xl font-bold text-white mb-3"
      >
        No Past Tours
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className="text-white/90 text-lg leading-relaxed max-w-sm"
      >
        Your completed tours will appear here
      </motion.p>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        className="text-white/70 text-sm mt-4"
      >
        Start exploring to create your first tour
      </motion.p>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-orange-400">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white/20 backdrop-blur-sm border-b border-white/20 px-6 py-8 sticky top-0 z-10"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">Past Tours</h1>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Volume2 className="text-white text-lg" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {pastTours.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-6">
                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/90">Total Tours</span>
                        <span className="font-bold text-white">{pastTours.length}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tour Cards */}
                <div className="space-y-4">
                  {pastTours.map((tour, index) => (
                    <TourCard 
                      key={tour.id} 
                      tour={tour} 
                    />
                  ))}
                </div>

                {/* Bottom Spacing */}
                <div className="h-8"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PastToursNew 