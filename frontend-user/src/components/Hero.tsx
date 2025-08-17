import React from 'react'
import { motion } from 'framer-motion'
import { Play, Radio } from 'lucide-react'

const Hero: React.FC = () => {
  return (
    <section className="hero">
      {/* Animated Background Particles */}
      <div className="hero-particles">
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
        <div className="hero-particle"></div>
      </div>

      <div className="hero-content">
        {/* Left Side - Headline & CTA */}
        <div className="hero-left">
          <motion.h1
            className="hero-headline text-display-hero"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            METALCORE
          </motion.h1>

          <motion.p
            className="hero-strapline text-metal-text-secondary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            A cena mais pesada do Brasil
          </motion.p>

          <motion.p
            className="hero-subheading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Descubra as melhores bandas de metalcore, hardcore e post-hardcore. 
            Programas exclusivos, entrevistas e muito mais.
          </motion.p>

          {/* Hero CTA with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.a
              href="#listen-live"
              className="hero-cta touch-target-large"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              aria-label="Começar a ouvir rádio metalcore"
              role="button"
              tabIndex={0}
            >
              <Play className="hero-cta-icon" />
              Start Listening Now
            </motion.a>
          </motion.div>
        </div>

        {/* Right Side - Feature Card */}
        <div className="hero-right">
          <motion.div
            className="card-root card-feature hero-feature"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Feature Image */}
            <div className="hero-feature-image-container">
              <img
                src="/api/placeholder/600/400"
                alt="Metalcore Show - Programa ao vivo"
                className="hero-feature-image"
                loading="eager"
                fetchPriority="high"
                width="600"
                height="400"
              />
              <div className="hero-feature-overlay">
                <motion.a
                  href="#player"
                  className="btn-accent-base touch-target-large"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Ouvir programa ao vivo"
                  role="button"
                  tabIndex={0}
                >
                  <Radio size={24} />
                  <span>Play Live Stream</span>
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-metal-text-2 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="w-1 h-3 bg-metal-text-2 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
