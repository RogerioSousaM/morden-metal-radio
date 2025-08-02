import { motion, AnimatePresence } from 'framer-motion'
import { X, Music, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

const TopMonthPopup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const bandasSection = document.getElementById('bandas')
      if (bandasSection && !isDismissed) {
        const rect = bandasSection.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const sectionHeight = rect.height
        
        // Mostrar quando 50% da seção estiver visível
        if (rect.top < windowHeight - sectionHeight * 0.5 && rect.bottom > windowHeight * 0.5) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-24 right-6 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="bg-metal-card border border-metal-orange/30 rounded-lg p-4 shadow-2xl backdrop-blur-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-metal-orange" />
                <span className="text-sm font-bold text-metal-text uppercase tracking-wider">
                  Top do Mês
                </span>
              </div>
              <button
                onClick={handleDismiss}
                className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                aria-label="Fechar pop-up"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-metal-orange/20 to-metal-accent/20 rounded-lg flex items-center justify-center">
                  <span className="text-metal-orange font-bold text-sm">ST</span>
                </div>
                <div>
                  <h4 className="text-metal-text font-bold">Sleep Token</h4>
                  <p className="text-metal-text-secondary text-sm">Take Me Back to Eden</p>
                </div>
              </div>
              
              <p className="text-metal-text-secondary text-sm">
                A banda mais tocada do mês com mais de 45k reproduções
              </p>

              <motion.button
                className="w-full bg-metal-orange/10 border border-metal-orange/30 text-metal-orange px-4 py-2 rounded-lg hover:bg-metal-orange/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Music className="w-4 h-4" />
                Ver Matéria Completa
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TopMonthPopup 