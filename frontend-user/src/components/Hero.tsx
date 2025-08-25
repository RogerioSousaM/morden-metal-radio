import { motion } from 'framer-motion'
import { Play, Volume2, Users, Clock } from 'lucide-react'

const Hero = () => {
  return (
    <section className="section-hero">
      <div className="container">
        <div className="hero">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              <span className="text-gradient">MODERN METAL</span>
              <br />
              <span className="text-primary">RÁDIO</span>
            </h1>
            
            <p className="hero-subtitle">
              Descubra as melhores bandas de metalcore, hardcore e post-hardcore. 
              24 horas de música ininterrupta para os verdadeiros headbangers.
            </p>

            <div className="hero-actions">
              <motion.a
                href="#listen-live"
                className="hero-cta"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Começar a ouvir rádio metalcore"
              >
                <Play className="w-5 h-5" />
                OUVIR AO VIVO
              </motion.a>
              
              <motion.button
                className="btn-secondary btn-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Volume2 className="w-5 h-5" />
                VER PROGRAMAÇÃO
              </motion.button>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="stat-item">
              <div className="stat-icon">
                <Volume2 className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Música Ininterrupta</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <Users className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Ouvintes Ativos</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <Clock className="w-6 h-6" />
              </div>
              <div className="stat-content">
                <div className="stat-number">365</div>
                <div className="stat-label">Dias no Ar</div>
              </div>
            </div>
          </motion.div>

          {/* Live Now Indicator */}
          <motion.div
            className="live-now-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="live-dot"></div>
            <span className="text-sm font-medium">AO VIVO AGORA</span>
            <span className="text-xs text-muted">Metal Noturno com DJ Shadow</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
