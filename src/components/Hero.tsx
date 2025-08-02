import { motion, AnimatePresence } from 'framer-motion'
import { Play, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const carouselItems = [
    {
      id: 1,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&crop=center',
      alt: 'Metal concert atmosphere',
      overlay: 'MORDEN METAL'
    },
    {
      id: 2,
      type: 'video',
      src: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761',
      alt: 'Dark metal atmosphere',
      overlay: '24/7 METAL'
    },
    {
      id: 3,
      type: 'image',
      src: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&crop=center',
      alt: 'Guitar strings in darkness',
      overlay: 'DARK SOUNDS'
    }
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [carouselItems.length])

  const handleBulletClick = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-metal-text mb-4 tracking-widest uppercase">
            Morden Metal
          </h1>
          <p className="text-xl md:text-2xl text-metal-text-secondary tracking-wide">
            Rádio online 24h • Metal moderno sem limites
          </p>
        </motion.div>

        {/* Live Status */}
        <motion.div 
          className="flex items-center justify-center gap-6 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="live-indicator">
            <div className="live-dot"></div>
            <span className="text-lg font-semibold">AO VIVO</span>
          </div>
          <div className="flex items-center gap-2 text-metal-text-secondary">
            <Users className="w-5 h-5" />
            <span>1,234 ouvintes online</span>
          </div>
        </motion.div>

        {/* Main Action Button */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button 
            className="btn-primary flex items-center gap-3 text-lg px-8 py-4 micro-pulse"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-6 h-6" />
            OUVIR AO VIVO
          </motion.button>
        </motion.div>

        {/* Dark Carousel */}
        <motion.div 
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="carousel-container h-96 md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {carouselItems[currentSlide].type === 'video' ? (
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={carouselItems[currentSlide].src}
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover carousel-image"
                    src={carouselItems[currentSlide].src}
                    alt={carouselItems[currentSlide].alt}
                    loading="lazy"
                  />
                )}
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 carousel-overlay"></div>
                
                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-metal-text tracking-widest uppercase mb-4 drop-shadow-2xl">
                      {carouselItems[currentSlide].overlay}
                    </h2>
                    <div className="w-24 h-1 bg-metal-orange mx-auto"></div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress Bar - Only visible on hover */}
            <div className="carousel-bullets">
              {carouselItems.map((_, index) => (
                <motion.div
                  key={index}
                  className={`carousel-bullet ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => handleBulletClick(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 