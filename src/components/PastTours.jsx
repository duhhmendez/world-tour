import React, { useState } from 'react'

// Mock data for past tours
const pastTours = [
  {
    id: 1,
    title: "Brooklyn Bridge Walk",
    date: "Today",
    duration: "3:45",
    location: "New York, NY",
    transcript: "Welcome to the Brooklyn Bridge, an iconic suspension bridge spanning the East River. Completed in 1883, this engineering marvel connects Manhattan and Brooklyn. The bridge's distinctive Gothic arches and cable-stayed design make it one of New York's most recognizable landmarks. Walking across the pedestrian path offers spectacular views of the Manhattan skyline and the Statue of Liberty in the distance. This engineering marvel continues to serve as a vital transportation link and a symbol of New York's ingenuity."
  },
  {
    id: 2,
    title: "Central Park Discovery",
    date: "Yesterday",
    duration: "4:12",
    location: "New York, NY",
    transcript: "Step into Central Park, a vast urban oasis covering 843 acres. This green sanctuary was designed by Frederick Law Olmsted and Calvert Vaux in the 1850s. The park features iconic landmarks like Bethesda Fountain, the Central Park Zoo, and the Great Lawn. On warm days, you'll see children playing in the water and couples taking romantic strolls. The surrounding area is perfect for people-watching and enjoying the natural beauty of this urban paradise. Central Park serves as the lungs of New York City, providing a peaceful escape from the bustling metropolis."
  },
  {
    id: 3,
    title: "Times Square Experience",
    date: "2 days ago",
    duration: "2:58",
    location: "New York, NY",
    transcript: "Welcome to Times Square, the bustling heart of Manhattan. Known for its bright lights and entertainment, this iconic intersection is famous for its bright neon signs, Broadway theaters, and the annual New Year's Eve ball drop. Times Square was once known as Longacre Square until the New York Times moved its headquarters here in 1904. Today, it's one of the most visited tourist attractions in the world, with over 50 million visitors annually. The energy here is electric, especially at night when all the billboards light up the sky. This vibrant district truly never sleeps."
  },
  {
    id: 4,
    title: "Statue of Liberty Tour",
    date: "3 days ago",
    duration: "3:20",
    location: "New York, NY",
    transcript: "Standing proudly in New York Harbor, the Statue of Liberty is a symbol of freedom and democracy. The Statue of Liberty, a gift from France to the United States, has welcomed immigrants and visitors to New York Harbor since 1886. Standing 305 feet tall, Lady Liberty represents freedom and democracy. The statue's torch symbolizes enlightenment, while the broken chains at her feet represent freedom from oppression. The seven spikes on her crown represent the seven continents and seas. This iconic symbol of American values continues to inspire millions of visitors each year and remains a powerful reminder of the nation's founding principles."
  },
  {
    id: 5,
    title: "Empire State Building",
    date: "1 week ago",
    duration: "2:45",
    location: "New York, NY",
    transcript: "Rising 1,454 feet above Manhattan, the Empire State Building is an Art Deco masterpiece. Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York's most iconic landmarks. Completed in 1931, this skyscraper was once the world's tallest building for nearly 40 years. The building's distinctive design features setbacks that were required by zoning laws to allow sunlight to reach the streets below. The observation deck on the 86th floor offers breathtaking 360-degree views of New York City. At night, the building's lights change colors to celebrate various holidays and events. This architectural marvel continues to symbolize the ambition and innovation of New York City."
  }
]

// Health Style Tour Card Component
const HealthStyleTourCard = ({ tour, onViewTranscript }) => {
  return (
    <div className="bg-white rounded-xl shadow-ios-soft overflow-hidden">
      <div className="p-4">
        {/* Header with icon and title */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🎧</span>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{tour.title}</h3>
            <p className="text-sm text-gray-500">{tour.date}</p>
          </div>
          
          <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
            {tour.duration}
          </div>
        </div>
        
        {/* Location info */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-gray-400 text-xs">📍</span>
          <span className="text-xs text-gray-500">{tour.location}</span>
        </div>
        
        {/* View Transcript button */}
        <button
          onClick={() => onViewTranscript(tour)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-blue-600">View Transcript</span>
          <span className="text-blue-600 text-xs">›</span>
        </button>
      </div>
    </div>
  )
}

// Transcript Detail View Component
const TranscriptDetailView = ({ tour, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <button onClick={onClose} className="text-blue-500 font-medium">
            Done
          </button>
          <h2 className="text-lg font-semibold">Transcript</h2>
          <div className="w-12"></div>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Tour header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-15 h-15 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🎧</span>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-800">{tour.title}</h3>
              <p className="text-sm text-gray-500">{tour.date}</p>
            </div>
          </div>
          
          {/* Tour details */}
          <div className="flex space-x-4 mb-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span>🕐</span>
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{tour.location}</span>
            </div>
          </div>
          
          {/* Transcript */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Transcript</h4>
            <p className="text-gray-700 leading-relaxed">{tour.transcript}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Past Tours Component
const PastTours = () => {
  const [selectedTour, setSelectedTour] = useState(null)

  const handleViewTranscript = (tour) => {
    setSelectedTour(tour)
  }

  const handleCloseTranscript = () => {
    setSelectedTour(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Past Tours</h1>
      </header>

      {/* Content */}
      <div className="p-4">
        {pastTours.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-6">🎧</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Past Tours</h2>
            <p className="text-gray-500 text-center max-w-sm">
              Your completed tours will appear here
            </p>
          </div>
        ) : (
          // Tours list
          <div className="space-y-4">
            {pastTours.map(tour => (
              <HealthStyleTourCard
                key={tour.id}
                tour={tour}
                onViewTranscript={handleViewTranscript}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      {selectedTour && (
        <TranscriptDetailView
          tour={selectedTour}
          onClose={handleCloseTranscript}
        />
      )}
    </div>
  )
}

export default PastTours 