import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, Star, Calendar, ExternalLink } from 'lucide-react'
import { apiService, Filme } from '../services/api'
import { useToast } from './ui/Toast'

const Filmaço = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [imageFallbacks, setImageFallbacks] = useState<{[key: number]: string}>({})
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await apiService.getFilmes()
        
        // Verificar se a resposta é um array ou um objeto com propriedade 'filmes'
        let filmesData: any[] = []
        if (Array.isArray(response)) {
          filmesData = response
        } else if (response && typeof response === 'object' && 'filmes' in response) {
          filmesData = (response as any).filmes
        } else {
          console.error('Formato de resposta inesperado:', response)
          filmesData = []
        }

        // Verificar se filmesData é um array válido
        if (!Array.isArray(filmesData)) {
          console.error('filmesData não é um array:', filmesData)
          filmesData = []
        }

        setFilmes(filmesData)
      } catch (error) {
        console.error('Erro ao carregar filmes da API, usando fallback:', error)
        // Fallback para dados estáticos
        setFilmes(filmesMock)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const getSafeImageUrl = (filme: Filme): string => {
    // Se já temos um fallback para este filme, use-o
    if (imageFallbacks[filme.id]) {
      return imageFallbacks[filme.id]
    }
    
    // Se o filme tem uma imagem válida, use-a
    if (filme.imagem && filme.imagem !== 'null') {
      return filme.imagem
    }
    
    // Fallback para Unsplash baseado no ID do filme
    const unsplashImages = [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop'
    ]
    
    return unsplashImages[filme.id % unsplashImages.length] || unsplashImages[0]
  }

  const handleImageError = (filme: Filme) => {
    // Se a imagem falhou, use um fallback do Unsplash
    const fallbackUrl = `https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop&random=${filme.id}`
    setImageFallbacks(prev => ({
      ...prev,
      [filme.id]: fallbackUrl
    }))
  }

  const handlePlayMovie = (filme: Filme) => {
    showSuccess('Reproduzindo', `Assistindo ${filme.titulo}`)
  }

  const handleMovieDetails = (filme: Filme) => {
    showSuccess('Detalhes', `${filme.titulo} - ${filme.descricao}`)
  }

  const handleVisitMovie = (filme: Filme) => {
    // Simular link para detalhes do filme
    showSuccess('Abrindo', `Detalhes de ${filme.titulo}`)
  }

  if (loading) {
    return (
      <section className="section section-content">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-center mb-4">
              🎬 Filmaço
            </h2>
            <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
              Os melhores filmes de terror e suspense para acompanhar sua noite
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-content">
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-2 text-center mb-4">
            🎬 Filmaço
          </h2>
          <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
            Os melhores filmes de terror e suspense para acompanhar sua noite
          </p>
        </motion.div>

        {/* Movies Grid */}
        <div className="card-grid">
          {filmes.map((filme, index) => (
            <motion.div
              key={filme.id}
              className="movie-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Movie Image */}
              <img
                src={getSafeImageUrl(filme)}
                alt={`${filme.titulo} - ${filme.descricao}`}
                className="movie-image"
                onError={() => handleImageError(filme)}
              />

              {/* Movie Title */}
              <h3 className="movie-title">
                {filme.titulo}
              </h3>

              {/* Movie Year */}
              <div className="movie-year">
                {filme.ano}
              </div>

              {/* Movie Description */}
              <p className="movie-description">
                {filme.descricao}
              </p>

              {/* Movie Rating */}
              <div className="movie-rating">
                <Star className="w-4 h-4" />
                <span>{filme.nota}/10</span>
              </div>

              {/* Action Buttons */}
              <div className="movie-actions">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => handlePlayMovie(filme)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Assistir ${filme.titulo}`}
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Assistir</span>
                </motion.button>

                <motion.button
                  className="btn btn-secondary"
                  onClick={() => handleMovieDetails(filme)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Ver detalhes de ${filme.titulo}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Detalhes</span>
                </motion.button>

                <motion.button
                  className="btn btn-outline"
                  onClick={() => handleVisitMovie(filme)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Ver mais sobre ${filme.titulo}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Ver Mais</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="btn btn-secondary btn-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ExternalLink className="w-5 h-5" />
            Ver Todos os Filmes
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Dados mock para fallback
const filmesMock: Filme[] = [
  {
    id: 1,
    titulo: "O Mal que Nos Habita",
    descricao: "Um filme de terror psicológico que explora os limites entre realidade e pesadelo",
    ano: 2023,
    nota: 8.5,
    imagem: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
    indicacao_do_mes: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    titulo: "Terrifier 2",
    descricao: "Sequel do filme de terror cult que leva a violência a novos patamares",
    ano: 2022,
    nota: 7.8,
    imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    indicacao_do_mes: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    titulo: "Hereditário",
    descricao: "Um filme de terror sobrenatural que redefine o gênero com atmosfera opressiva",
    ano: 2018,
    nota: 9.2,
    imagem: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
    indicacao_do_mes: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
]

export default Filmaço 