import React, { useState } from 'react'

const PastTours = () => {
  // Mock data for past tours - in a real app, this would come from local storage or database
  const [pastTours] = useState([
    {
      id: 1,
      title: "Empire State Building",
      date: "2024-01-15",
      duration: "2:30",
      transcript: "Standing 1,454 feet tall, the Empire State Building is an Art Deco masterpiece and one of New York's most iconic landmarks. Built during the Great Depression, this skyscraper became a symbol of hope and resilience for the city. The building features 102 floors and was the tallest building in the world for nearly 40 years until the World Trade Center was completed in 1970. Today, it remains one of the most visited tourist attractions in New York City, offering breathtaking views from its observation deck on the 86th and 102nd floors."
    },
    {
      id: 2,
      title: "Central Park",
      date: "2024-01-10",
      duration: "4:15",
      transcript: "A vast urban oasis covering 843 acres, Central Park offers lakes, walking trails, and cultural landmarks in the heart of Manhattan. Designed by Frederick Law Olmsted and Calvert Vaux, the park was created in the 1850s to provide New Yorkers with a natural escape from the bustling city. The park features numerous attractions including the Bethesda Fountain, the Central Park Zoo, and the iconic Bow Bridge. Throughout the year, the park hosts various events, concerts, and activities, making it a vibrant center of city life."
    },
    {
      id: 3,
      title: "Times Square",
      date: "2024-01-05",
      duration: "3:45",
      transcript: "The bustling heart of Manhattan, Times Square is known for its bright lights, entertainment, and as the crossroads of the world. Originally called Longacre Square, it was renamed in 1904 after the New York Times moved its headquarters to the area. Today, Times Square is famous for its massive digital billboards, Broadway theaters, and the annual New Year's Eve ball drop. The area attracts millions of visitors each year and serves as a symbol of New York City's energy and excitement."
    }
  ])

  const [selectedTour, setSelectedTour] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleTourClick = (tour) => {
    setSelectedTour(tour)
  }

  const handleCloseDetail = () => {
    setSelectedTour(null)
  }

  if (selectedTour) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
        {/* Header - iOS Style */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={handleCloseDetail}
              className="text-blue-500 font-semibold text-lg"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Tour Details</h1>
            <div className="w-16"></div>
          </div>
        </div>

        {/* Tour Detail - iOS Style */}
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedTour.title}</h2>
                  <p className="text-gray-600 font-medium">{formatDate(selectedTour.date)}</p>
                </div>
                <div className="text-4xl ml-4">📋</div>
              </div>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">⏱️</span>
                  <span className="text-gray-600 font-medium">{selectedTour.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-600 font-medium">Completed</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Transcript</h3>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-700 leading-relaxed">{selectedTour.transcript}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-orange-50">
      {/* Header - iOS Style */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Past Tours</h1>
          <div className="text-2xl">📋</div>
        </div>
      </div>

      {/* Tours List - iOS Style */}
      <div className="p-6">
        {pastTours.length === 0 ? (
          <div className="text-center space-y-6 py-12">
            <div className="text-6xl text-gray-400">📋</div>
            <h2 className="text-2xl font-bold text-gray-800">No Past Tours</h2>
            <p className="text-gray-600 max-w-sm mx-auto">
              Your completed tours will appear here. Start exploring to build your history!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pastTours.map((tour) => (
              <div
                key={tour.id}
                onClick={() => handleTourClick(tour)}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>
                      <p className="text-gray-600 font-medium">{formatDate(tour.date)}</p>
                    </div>
                    <div className="text-4xl ml-4">📋</div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">⏱️</span>
                      <span className="text-gray-600 font-medium">{tour.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">✅</span>
                      <span className="text-gray-600 font-medium">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PastTours 