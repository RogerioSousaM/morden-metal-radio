import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Play, ExternalLink, Heart, Music } from 'lucide-react'
import { apiService, Band } from '../services/api'
import { useToast } from './ui/Toast'

interface BandaComImpacto extends Band {
  impactDescription: string
}

const BandasDaCena = () => {
  const [bandas, setBandas] = useState<BandaComImpacto[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    const fetchBandas = async () => {
      try {
        setLoading(true)
        const response = await apiService.getFeaturedBands()
        
        // Verificar se a resposta é um array ou um objeto com propriedade 'data'
        let bandasDestaque: any[] = []
        if (Array.isArray(response)) {
          bandasDestaque = response
        } else if (response && typeof response === 'object' && 'data' in response) {
          bandasDestaque = (response as any).data
        } else {
          console.error('Formato de resposta inesperado:', response)
          bandasDestaque = []
        }

        // Verificar se bandasDestaque é um array válido
        if (!Array.isArray(bandasDestaque)) {
          console.error('bandasDestaque não é um array:', bandasDestaque)
          bandasDestaque = []
        }

        // Adicionar descrições de impacto
        const bandasComImpacto = bandasDestaque.slice(0, 6).map(banda => ({
          ...banda,
          impactDescription: getImpactDescription(banda)
        }))

        setBandas(bandasComImpacto)
      } catch (error) {
        console.error('🎸 BandasDaCena: Erro ao carregar bandas:', error)
        // Fallback para dados mock
        setBandas(bandasMock)
      } finally {
        setLoading(false)
      }
    }

    fetchBandas()
  }, [])

  const getImpactDescription = (banda: Band): string => {
    const descriptions = [
      "Revolucionando o metalcore com riffs devastadores",
      "Definindo o futuro do deathcore brasileiro",
      "Inovando o post-hardcore com letras profundas",
      "Dominando o cenário underground nacional",
      "Criando o novo padrão do metal moderno",
      "Influenciando toda uma geração de músicos"
    ]
    
    // Usar o ID da banda para selecionar uma descrição consistente
    return descriptions[banda.id % descriptions.length] || descriptions[0]
  }

  const handlePlayBand = (banda: BandaComImpacto) => {
    showSuccess('Reproduzindo', `Ouvindo ${banda.name}`)
  }

  const handleVisitWebsite = (banda: BandaComImpacto) => {
    if (banda.official_url) {
      window.open(banda.official_url, '_blank')
    } else {
      showError('Erro', 'Website não disponível')
    }
  }

  const handleLikeBand = (banda: BandaComImpacto) => {
    showSuccess('Curtido!', `${banda.name} foi adicionada aos favoritos`)
  }

  if (loading) {
    return (
      <section className="section section-alternate">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-center mb-4">
              🎸 Bandas da Cena
            </h2>
            <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
              As bandas mais pesadas do momento
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
    <section className="section section-alternate">
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
            🎸 Bandas da Cena
          </h2>
          <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
            As bandas mais pesadas do momento
          </p>
        </motion.div>

        {/* Bands Grid */}
        <div className="card-grid">
          {bandas.map((banda, index) => (
            <motion.div
              key={banda.id}
              className="band-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1 
              }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Band Image */}
              <img
                src={banda.image_url || `https://source.unsplash.com/400x300/?metal,band,${banda.name}`}
                alt={`${banda.name} - ${banda.description}`}
                className="band-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://source.unsplash.com/400x300/?metal,band,${banda.name}`
                }}
              />

              {/* Band Name */}
              <h3 className="band-name">
                {banda.name}
              </h3>

              {/* Genre */}
              <div className="band-genre">
                {JSON.parse(banda.genre_tags || '[]').join(', ') || 'Metal'}
              </div>

              {/* Impact Description */}
              <p className="band-description">
                {banda.impactDescription}
              </p>

              {/* Action Buttons */}
              <div className="band-actions">
                <motion.button
                  className="btn btn-primary"
                  onClick={() => handlePlayBand(banda)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Ouvir ${banda.name}`}
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Ouvir</span>
                </motion.button>

                <motion.button
                  className="btn btn-secondary"
                  onClick={() => handleVisitWebsite(banda)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Visitar website de ${banda.name}`}
                  disabled={!banda.official_url}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Website</span>
                </motion.button>

                <motion.button
                  className="btn btn-outline"
                  onClick={() => handleLikeBand(banda)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Curtir ${banda.name}`}
                >
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Curtir</span>
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
            <Music className="w-5 h-5" />
            Ver Todas as Bandas
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Dados mock para fallback
const bandasMock: BandaComImpacto[] = [
  {
    id: 1,
    name: "Bring Me The Horizon",
    slug: "bring-me-the-horizon",
    description: "Metalcore britânico com letras profundas e riffs devastadores",
    official_url: "https://www.bmthofficial.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,1",
    genre_tags: "[\"Metalcore\", \"Progressive Metal\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Revolucionando o metalcore com riffs devastadores"
  },
  {
    id: 2,
    name: "Architects",
    slug: "architects",
    description: "Post-hardcore com mensagens políticas e sonoridade única",
    official_url: "https://www.architectsofficial.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,2",
    genre_tags: "[\"Post-Hardcore\", \"Metalcore\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Definindo o futuro do deathcore brasileiro"
  },
  {
    id: 3,
    name: "Parkway Drive",
    slug: "parkway-drive",
    description: "Metalcore australiano com energia incontrolável",
    official_url: "https://www.parkwaydriverock.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,3",
    genre_tags: "[\"Metalcore\", \"Hardcore\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Inovando o post-hardcore com letras profundas"
  },
  {
    id: 4,
    name: "While She Sleeps",
    slug: "while-she-sleeps",
    description: "Metalcore com elementos experimentais e letras conscientes",
    official_url: "https://www.whileshesleeps.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,4",
    genre_tags: "[\"Metalcore\", \"Alternative Metal\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Dominando o cenário underground nacional"
  },
  {
    id: 5,
    name: "Northlane",
    slug: "northlane",
    description: "Progressive metalcore com atmosferas futuristas",
    official_url: "https://www.northlane.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,5",
    genre_tags: "[\"Progressive Metalcore\", \"Alternative Metal\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Criando o novo padrão do metal moderno"
  },
  {
    id: 6,
    name: "Veil of Maya",
    slug: "veil-of-maya",
    description: "Technical deathcore com complexidade instrumental",
    official_url: "https://www.veilofmaya.com",
    image_url: "https://source.unsplash.com/400x300/?metal,band,6",
    genre_tags: "[\"Technical Deathcore\", \"Progressive Metal\"]",
    featured: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    impactDescription: "Influenciando toda uma geração de músicos"
  }
]

export default BandasDaCena
