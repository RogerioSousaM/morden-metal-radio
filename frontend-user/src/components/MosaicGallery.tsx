import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Star, ExternalLink, Music } from 'lucide-react'
import { apiService, Band } from '../services/api'
import StandardizedImage from './StandardizedImage'

interface MosaicGalleryProps {
  bandas?: Band[]
}

// Componente para um card individual da banda
const BandCard: React.FC<{ banda: Band; index: number; animationDelay?: number }> = ({ banda, index, animationDelay = index * 0.1 }) => {
  // Função para determinar o tamanho do card baseado no índice (efeito mosaico)
  const getCardSize = (index: number) => {
    const patterns = [
      'sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2', // Card grande (2x2)
      'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1', // Card normal (1x1)
      'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1', // Card normal (1x1)
      'sm:col-span-1 sm:row-span-2 lg:col-span-1 lg:row-span-2', // Card alto (1x2)
      'sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1', // Card largo (2x1)
      'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1', // Card normal (1x1)
    ]
    return patterns[index % patterns.length]
  }

  // Determinar se é um card grande para mostrar mais informações
  const isLargeCard = getCardSize(index).includes('col-span-2') || getCardSize(index).includes('row-span-2')

  return (
    <motion.div
      className={`${getCardSize(index)}`}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94] // Custom easing
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2 } 
      }}
    >
                      <div className={`card-root ${isLargeCard ? 'card-feature' : 'card-small'} card-hover stagger-item`}>
          {/* Badge de destaque */}
          {banda.featured && (
            <motion.div
              className="card-badge"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
            >
              ⭐ Featured
            </motion.div>
          )}
          
          {/* Badge de métrica principal (topo direito) */}
          <motion.div
            className="card-metric-badge"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {banda.featured ? '🔥 Hot' : '🎵 New'}
          </motion.div>

        {/* Container da mídia */}
        <div className="card-media">
          {/* Thumbnail padronizado da banda */}
          <StandardizedImage
            src={banda.image_url || ''}
            alt={`Imagem da banda ${banda.name}`}
            fallbackText={banda.name}
            variant={isLargeCard ? 'feature' : 'small'}
            filter="moderate"
            showOverlay={true}
            showVignette={true}
            className="w-full h-full"
          />
          
                     {/* Botão de play overlay (aparece no hover) */}
           <div className="card-play-overlay-base">
             <div className="play-icon-container">
               <svg viewBox="0 0 24 24" fill="currentColor" className="play-icon">
                 <path d="M8 5v14l11-7z"/>
               </svg>
             </div>
           </div>
          
          {/* Botão de link externo */}
          {banda.official_url && (
            <motion.a
              href={banda.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-external-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Visitar site oficial de ${banda.name}`}
            >
              <ExternalLink />
            </motion.a>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="card-content">
          {/* Título da banda */}
          <h3 className="card-title text-high-contrast" id={`banda-${banda.id}-title`}>
            {banda.name}
          </h3>
          
          {/* Descrição - apenas em cards grandes */}
          {isLargeCard && banda.description && (
            <p className="card-description text-medium-contrast" id={`banda-${banda.id}-description`}>
              {banda.description}
            </p>
          )}
          
          {/* Metadata row */}
          <div className="card-metadata">
                         {/* Gênero */}
             {banda.genre_tags && (
               <div className="card-metadata-item">
                 <Calendar className="w-3 h-3 text-accent-amber" />
                 <span className="genre-badge bg-metal-light-gray/14 rounded-full px-2 py-0.5 text-xs">
                   {banda.genre_tags.length > 20 
                     ? `${banda.genre_tags.substring(0, 20)}...` 
                     : banda.genre_tags
                   }
                 </span>
               </div>
             )}
            
            {/* Status de destaque */}
            {banda.featured && (
              <div className="card-metadata-item">
                <Star className="w-3 h-3 fill-current text-accent-amber" />
                <span>Em Destaque</span>
              </div>
            )}
          </div>

          {/* Action row */}
          <div className="card-actions">
            {/* Botão de ação primária */}
            <button 
              className="btn-accent-base touch-target micro-pulse"
              aria-label={`Ouvir música da banda ${banda.name}`}
              aria-describedby={`banda-${banda.id}-description`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Implementar ação de play
                  console.log(`Playing music for ${banda.name}`)
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play Music</span>
            </button>
            
            {/* Botão de ação secundária */}
            {banda.official_url && (
              <a
                href={banda.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn card-action-btn-secondary touch-target"
                aria-label={`Visitar site oficial de ${banda.name}`}
                aria-describedby={`banda-${banda.id}-description`}
              >
                <ExternalLink aria-hidden="true" />
                <span>Visit Site</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const MosaicGallery: React.FC<MosaicGalleryProps> = ({ 
  bandas: propBandas 
}) => {
  const [bandas, setBandas] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBandas = async () => {
      try {
        setLoading(true)
        // Se não foram passados via props, buscar da API
        if (!propBandas || propBandas.length === 0) {
          const apiBandas = await apiService.getDestaquesPublicos()
          setBandas(apiBandas)
        } else {
          setBandas(propBandas)
        }
      } catch (error) {
        console.error('Erro ao carregar bandas da cena:', error)
        setBandas([])
      } finally {
        setLoading(false)
      }
    }

    loadBandas()
  }, [propBandas])

  // Estado de loading
  if (loading) {
    return (
      <section id="destaques" className="section-spacing bg-metalcore">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-display-section text-metal-text mb-6 font-display">
                BANDAS DA CENA
            </h2>
            <p className="text-body-large text-metal-text-2 max-w-3xl mx-auto">
              As bandas mais pesadas do momento
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-crimson"></div>
          </div>
        </div>
      </section>
    )
  }

  // Estado vazio
  if (bandas.length === 0) {
    return (
      <section id="destaques" className="section-spacing bg-metalcore">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-display-section text-metal-text mb-6 font-display">
              🎸 BANDAS DA CENA
            </h2>
            <p className="text-body-large text-metal-text-2 max-w-3xl mx-auto">
              As bandas mais pesadas do momento
            </p>
          </div>
          
          <div className="text-center">
            <Music className="w-16 h-16 text-metal-text-2 mx-auto mb-4" />
            <p className="text-small text-metal-text-2">Nenhuma banda em destaque no momento</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="destaques" className="section-spacing bg-metalcore">
              <div className="container-max">
        {/* Título da seção */}
        <div className="text-center mb-12">
          <h2 className="text-display-section text-metal-text mb-6 font-display">
            🎸 BANDAS DA CENA
          </h2>
          <p className="text-body-large text-metal-text-2 max-w-3xl mx-auto">
            As bandas mais pesadas do momento
          </p>
        </div>

        {/* Grid em mosaico responsivo com imagens padronizadas */}
        <motion.div 
          className="card-grid card-grid-small image-grid-uniform stagger-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {bandas.map((banda, index) => (
            <BandCard 
              key={banda.id} 
              banda={banda} 
              index={index} 
              animationDelay={Math.min(index * 0.1, 0.5)} // Limita delay máximo para evitar jank
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default MosaicGallery

