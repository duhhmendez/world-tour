import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mic, Volume2, WifiOff, Info, Globe } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Switch } from '../components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useSettings } from '../contexts/SettingsContext'

const SettingsNew = ({ onClose }) => {
  const {
    voiceGender,
    setVoiceGender,
    voiceTone,
    setVoiceTone,
    backgroundAmbience,
    setBackgroundAmbience,
    offlineMode,
    setOfflineMode
  } = useSettings()

  const handleClose = () => {
    onClose()
  }

  const SettingItem = ({ icon, title, description, children, className = "" }) => (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      <div className="flex items-center space-x-3 flex-1">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
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
        className="bg-white/95 backdrop-blur-ios rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <Button
            onClick={handleClose}
            variant="ghost"
            className="text-blue-600 font-semibold"
          >
            Done
          </Button>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <div className="w-12"></div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Voice Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mic className="text-blue-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">Voice Settings</h3>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <SettingItem
                    icon={<Mic className="text-blue-500 w-5 h-5" />}
                    title="Voice Gender"
                    description="Choose the voice for audio guides"
                  >
                    <Select value={voiceGender} onValueChange={setVoiceGender}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingItem>
                  
                  <div className="border-t border-gray-100"></div>
                  
                  <SettingItem
                    icon={<Mic className="text-blue-500 w-5 h-5" />}
                    title="Voice Tone"
                    description="Select the tone of voice narration"
                  >
                    <Select value={voiceTone} onValueChange={setVoiceTone}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="narrative">Narrative</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingItem>
                </CardContent>
              </Card>
            </div>

            {/* Audio Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Volume2 className="text-green-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">Audio Settings</h3>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <SettingItem
                    icon={<Volume2 className="text-green-500 w-5 h-5" />}
                    title="Background Ambience"
                    description="Play ambient sounds during tours"
                  >
                    <Switch
                      checked={backgroundAmbience}
                      onCheckedChange={setBackgroundAmbience}
                    />
                  </SettingItem>
                </CardContent>
              </Card>
            </div>

            {/* App Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <WifiOff className="text-purple-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">App Settings</h3>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <SettingItem
                    icon={<WifiOff className="text-purple-500 w-5 h-5" />}
                    title="Offline Mode"
                    description="Use downloaded content only"
                  >
                    <Switch
                      checked={offlineMode}
                      onCheckedChange={setOfflineMode}
                    />
                  </SettingItem>
                </CardContent>
              </Card>
            </div>

            {/* About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Info className="text-gray-500 w-5 h-5" />
                <h3 className="text-lg font-semibold text-gray-800">About</h3>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <SettingItem
                    icon={<Info className="text-gray-500 w-5 h-5" />}
                    title="Version"
                    description="App version information"
                  >
                    <span className="text-sm text-gray-600 font-medium">1.0.0</span>
                  </SettingItem>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="text-center space-y-3 pt-6">
              <div className="flex items-center justify-center space-x-2">
                <Globe className="text-blue-500 w-5 h-5" />
                <p className="text-sm text-gray-500 font-medium">
                  World Tour • Audio Guide App
                </p>
              </div>
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

export default SettingsNew 