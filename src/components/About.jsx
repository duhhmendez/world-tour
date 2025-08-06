import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-ios-light-gray">
      {/* Header */}
      <header className="bg-white shadow-ios px-4 py-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-ios-blue font-medium text-lg"
            aria-label="Back to World Tour"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-ios-dark-gray">About</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="card">
          <h2 className="text-xl font-bold text-ios-dark-gray mb-4">
            World Tour App
          </h2>
          
          <div className="space-y-4 text-ios-gray leading-relaxed">
            <p>
              World Tour is a location-based audio tour app that provides immersive 
              experiences at famous landmarks and points of interest around the world.
            </p>
            
            <p>
              The app uses your device's GPS to detect when you're within 50 meters 
              of a tour location and automatically presents you with an audio tour 
              that you can play through your headphones.
            </p>
            
            <h3 className="text-lg font-semibold text-ios-dark-gray mt-6 mb-2">
              How it works:
            </h3>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Allow location access when prompted</li>
              <li>Move within 50 meters of a tour location</li>
              <li>Tap "Play Tour" to hear the audio narration</li>
              <li>Use "Repeat" to hear the tour again</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-ios-dark-gray mt-6 mb-2">
              Features:
            </h3>
            
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Location-based tour discovery</li>
              <li>High-quality audio narration</li>
              <li>Mobile-optimized interface</li>
              <li>Accessibility-friendly design</li>
              <li>Works offline with cached tour data</li>
            </ul>
            
            <div className="mt-6 p-4 bg-ios-light-gray rounded-xl">
              <h4 className="font-semibold text-ios-dark-gray mb-2">
                Development Mode:
              </h4>
              <p className="text-sm">
                Use the "Simulate Location" button on the main screen to test the app 
                without being physically at a tour location.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About 