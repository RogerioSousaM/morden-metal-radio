import { motion } from 'framer-motion'
import { Music, Users, Star, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Band {
  id: number
  name: string
  genre: string
  description: string
  listeners: string
  rating: number
  is_featured: boolean
  image: string
}

const FeaturedBands = () => {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadBands = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/bands/public')
        if (!response.ok) {
          throw new Error('Falha ao carregar bandas')
        }
        const data = await response.json()
        setBands(data)
      } catch (err) {
        console.error('Erro ao carregar bandas:', err)
        setError('Erro ao carregar bandas')
        // Fallback para dados hardcoded em caso de erro
        setBands([
          {
            id: 1,
            name: 'Sleep Token',
            genre: 'Alternative Metal',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
            description: 'Misturando metal progressivo com elementos eletrônicos e vocais únicos',
            listeners: '15.2k',
            rating: 4.8,
            is_featured: true
          },
          {
            id: 2,
            name: 'Spiritbox',
            genre: 'Metalcore',
            image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center',
            description: 'Metalcore moderno com vocais poderosos e riffs devastadores',
            listeners: '12.8k',
            rating: 4.7,
            is_featured: true
          },
          {
            id: 3,
            name: 'Lorna Shore',
            genre: 'Deathcore',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
            description: 'Deathcore extremo com vocais guturais e instrumentais técnicos',
            listeners: '18.5k',
            rating: 4.9,
            is_featured: false
          },
          {
            id: 4,
            name: 'Bad Omens',
            genre: 'Alternative Metal',
            image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center',
            description: 'Metal alternativo com elementos de rock e eletrônica',
            listeners: '14.3k',
            rating: 4.6,
            is_featured: false
          },
          {
            id: 5,
            name: 'Architects',
            genre: 'Metalcore',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
            description: 'Metalcore britânico com letras profundas e sonoridade única',
            listeners: '16.7k',
            rating: 4.8,
            is_featured: false
          },
          {
            id: 6,
            name: 'Bring Me The Horizon',
            genre: 'Alternative Metal',
            image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center',
            description: 'Evolução constante do metalcore para o metal alternativo',
            listeners: '22.1k',
            rating: 4.9,
            is_featured: true
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadBands()
  }, [])

  return (
    <section id="bandas" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-metal-text mb-4 tracking-widest uppercase">
            Bandas em Destaque
          </h2>
          <p className="text-xl text-metal-text-secondary max-w-2xl mx-auto">
            As bandas que estão dominando o cenário do metal moderno
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-8 h-8 text-metal-orange animate-spin" />
            <span className="ml-3 text-metal-text">Carregando bandas...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-metal-text-secondary mb-4">{error}</p>
            <p className="text-sm text-metal-text-secondary">Exibindo dados de exemplo</p>
          </motion.div>
        )}

        {/* Featured Bands Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bands.map((band, index) => (
            <motion.div
              key={band.id}
              className="card group relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Featured Badge */}
              {band.is_featured && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="featured-badge text-white px-3 py-1 rounded-full text-xs font-bold">
                    DESTAQUE
                  </div>
                </div>
              )}

              {/* Band Image */}
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={band.image}
                  alt={band.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Play Button Overlay */}
                <motion.button
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Ouvir ${band.name}`}
                >
                  <div className="bg-metal-orange/90 backdrop-blur-sm rounded-full p-4">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                </motion.button>
              </div>

              {/* Band Info */}
              <div className="space-y-3">
                {/* Name and Rating */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-metal-text group-hover:text-metal-orange transition-colors">
                    {band.name}
                  </h3>
                  <div className="flex items-center gap-1 tooltip" data-tooltip={`Avaliação: ${band.rating}/5`}>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-metal-text-secondary">
                      {band.rating}
                    </span>
                  </div>
                </div>

                {/* Genre */}
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-metal-orange" />
                  <span className="text-sm text-metal-orange font-medium">
                    {band.genre}
                  </span>
                </div>

                {/* Description */}
                <p className="text-metal-text-secondary text-sm leading-relaxed">
                  {band.description}
                </p>

                {/* Listeners */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-metal-text-secondary tooltip" data-tooltip="Ouvintes mensais" />
                    <span className="text-sm text-metal-text-secondary">
                      {band.listeners} ouvintes
                    </span>
                  </div>
                  
                  <motion.button
                    className="text-metal-orange hover:text-metal-accent transition-colors"
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Ver mais sobre ${band.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="btn-secondary flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Music className="w-5 h-5" />
            VER TODAS AS BANDAS
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedBands 