import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiX, BiMicrophone, BiVolumeFull, BiWifiOff, BiInfoCircle } from 'react-icons/bi'

const Settings = ({ onClose }) => {
  const [voiceGender, setVoiceGender] = useState('neutral')
  const [voiceTone, setVoiceTone] = useState('friendly')
  const [backgroundAmbience, setBackgroundAmbience] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const SettingItem = ({ icon, title, description, children, className = "" }) => (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  )

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-500' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const Dropdown = ({ value, onChange, options, disabled = false }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-ios rounded-3xl shadow-ios-strong w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="text-ios-primary font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            Done
          </button>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Voice Settings */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <BiMicrophone className="text-blue-500" />
                <span>Voice Settings</span>
              </h3>
              
              <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
                <SettingItem
                  icon={<BiMicrophone className="text-blue-500 text-lg" />}
                  title="Voice Gender"
                  description="Choose the voice for audio guides"
                >
                  <Dropdown
                    value={voiceGender}
                    onChange={setVoiceGender}
                    options={[
                      { value: 'neutral', label: 'Neutral' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' }
                    ]}
                  />
                </SettingItem>
                
                <div className="border-t border-gray-100"></div>
                
                <SettingItem
                  icon={<BiMicrophone className="text-blue-500 text-lg" />}
                  title="Voice Tone"
                  description="Select the tone of voice narration"
                >
                  <Dropdown
                    value={voiceTone}
                    onChange={setVoiceTone}
                    options={[
                      { value: 'friendly', label: 'Friendly' },
                      { value: 'narrative', label: 'Narrative' },
                      { value: 'dramatic', label: 'Dramatic' }
                    ]}
                  />
                </SettingItem>
              </div>
            </div>

            {/* Audio Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <BiVolumeFull className="text-green-500" />
                <span>Audio Settings</span>
              </h3>
              
              <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
                <SettingItem
                  icon={<BiVolumeFull className="text-green-500 text-lg" />}
                  title="Background Ambience"
                  description="Play ambient sounds during tours"
                >
                  <ToggleSwitch
                    checked={backgroundAmbience}
                    onChange={() => setBackgroundAmbience(!backgroundAmbience)}
                  />
                </SettingItem>
              </div>
            </div>

            {/* App Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <BiWifiOff className="text-purple-500" />
                <span>App Settings</span>
              </h3>
              
              <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
                <SettingItem
                  icon={<BiWifiOff className="text-purple-500 text-lg" />}
                  title="Offline Mode"
                  description="Use downloaded content only"
                >
                  <ToggleSwitch
                    checked={offlineMode}
                    onChange={() => setOfflineMode(!offlineMode)}
                  />
                </SettingItem>
              </div>
            </div>

            {/* About */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <BiInfoCircle className="text-gray-500" />
                <span>About</span>
              </h3>
              
              <div className="bg-gray-50/50 rounded-2xl overflow-hidden">
                <SettingItem
                  icon={<BiInfoCircle className="text-gray-500 text-lg" />}
                  title="Version"
                  description="App version information"
                >
                  <span className="text-sm text-gray-600 font-medium">1.0.0</span>
                </SettingItem>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center space-y-2 pt-4">
              <p className="text-xs text-gray-400">
                World Tour • Audio Guide App
              </p>
              <p className="text-xs text-gray-400">
                Made with ❤️ for explorers
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Settings 