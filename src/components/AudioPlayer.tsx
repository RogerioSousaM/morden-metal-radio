import { motion } from 'framer-motion'
import { Play, Volume2, Heart, Instagram, Twitter, Facebook, Youtube, Pause } from 'lucide-react'
import { useState, useEffect } from 'react'

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Space bar to play/pause
      if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault()
        setIsPlaying(!isPlaying)
      }
      
      // Arrow keys for volume
      if (event.code === 'ArrowUp' && event.ctrlKey) {
        event.preventDefault()
        setVolume(prev => Math.min(100, prev + 10))
      }
      if (event.code === 'ArrowDown' && event.ctrlKey) {
        event.preventDefault()
        setVolume(prev => Math.max(0, prev - 10))
      }
      
      // M key to mute/unmute
      if (event.code === 'KeyM' && event.target === document.body) {
        event.preventDefault()
        setVolume(volume > 0 ? 0 : 80)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying, volume])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value))
  }

  return (
    <motion.div 
      className="audio-player fixed bottom-0 left-0 right-0 z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${isCollapsed ? 'h-12' : 'h-20'}`}>
          {/* Left - Song Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-metal-orange/20 to-metal-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-metal-orange font-bold text-sm">MM</span>
            </div>
            <div className={isCollapsed ? 'hidden md:block' : ''}>
              <p className="text-metal-text font-medium">Sleep Token - The Summoning</p>
              <p className="text-metal-text-secondary text-sm">Take Me Back to Eden</p>
            </div>
          </div>

          {/* Center - Controls */}
          <div className="flex items-center gap-4">
            <motion.button
              className="text-metal-text-secondary hover:text-metal-orange transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Favoritar música"
            >
              <Heart className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              className="play-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </motion.button>

            {/* Volume Control */}
            <div className={`hidden sm:flex items-center gap-2 ${isCollapsed ? 'hidden' : ''}`}>
              <Volume2 className="w-5 h-5 text-metal-text-secondary" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-metal-light-gray rounded-full appearance-none cursor-pointer slider"
                aria-label="Controle de volume"
              />
              <span className="text-xs text-metal-text-secondary w-8 text-right">
                {volume}%
              </span>
            </div>
          </div>

          {/* Right - Social Links & Status */}
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className={`hidden md:flex items-center gap-2 ${isCollapsed ? 'hidden' : ''}`}>
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 bg-metal-light-gray/30 rounded-lg flex items-center justify-center text-metal-text-secondary hover:text-metal-orange hover:bg-metal-light-gray/50 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Seguir no ${social.label}`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                )
              })}
            </div>

            {/* Status */}
            <div className={`text-center ${isCollapsed ? 'hidden' : ''}`}>
              <p className="text-metal-text-secondary text-sm">
                {isPlaying ? 'Reproduzindo ao vivo...' : 'Pausado'}
              </p>
            </div>

            {/* Collapse Button */}
            <motion.button
              className="md:hidden text-metal-text-secondary hover:text-metal-orange transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? 'Expandir player' : 'Recolher player'}
            >
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-metal-light-gray">
          <motion.div 
            className="h-full bg-metal-orange"
            initial={{ width: 0 }}
            animate={{ width: isPlaying ? '45%' : '0%' }}
            transition={{ duration: 0.5, delay: 1.5 }}
          />
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="hidden lg:block absolute bottom-full right-4 mb-2">
        <div className="bg-metal-card/90 backdrop-blur-sm border border-metal-light-gray/30 rounded-lg p-3 text-xs text-metal-text-secondary">
          <p className="font-medium mb-1">Atalhos:</p>
          <p>Espaço = Play/Pause</p>
          <p>Ctrl + ↑↓ = Volume</p>
          <p>M = Mudo</p>
        </div>
      </div>
    </motion.div>
  )
}

export default AudioPlayer 