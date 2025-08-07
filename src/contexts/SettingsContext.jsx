import React, { createContext, useContext, useState } from 'react'

const SettingsContext = createContext()

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [voiceGender, setVoiceGender] = useState('neutral')
  const [voiceTone, setVoiceTone] = useState('friendly')
  const [backgroundAmbience, setBackgroundAmbience] = useState(true)
  const [offlineMode, setOfflineMode] = useState(false)

  const value = {
    voiceGender,
    setVoiceGender,
    voiceTone,
    setVoiceTone,
    backgroundAmbience,
    setBackgroundAmbience,
    offlineMode,
    setOfflineMode
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
