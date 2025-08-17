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
    const bandName = banda.name.toLowerCase()
    
    // Sleep Token deve ser pequeno (1x1) - mesma altura de Architects
    if (bandName.includes('sleep token')) {
      return 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1'
    }
    
    // Currents deve ser pequeno (1x1) - mesma altura de Spiritbox
    if (bandName.includes('currents')) {
      return 'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1'
    }
    
    // Spiritbox e Architects são cards gigantes (7x1)
    if (bandName.includes('spiritbox') || bandName.includes('architects')) {
      return 'sm:col-span-7 sm:row-span-1 lg:col-span-7 lg:row-span-1'
    }
    
    // Padrão para outras bandas
    const patterns = [
      'sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2', // Card grande (2x2)
      'sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-1', // Card largo (2x1)
      'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1', // Card normal (1x1)
      'sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1', // Card normal (1x1)
    ]
    
    return patterns[index % patterns.length]
  }

  // Determinar se é um card grande para mostrar mais informações
  const isLargeCard = getCardSize(index).includes('col-span-7') || getCardSize(index).includes('row-span-2') || getCardSize(index).includes('col-span-2')

  // Determinar a posição específica para cada banda
  const getCardPosition = (bandName: string) => {
    const name = bandName.toLowerCase()
    
    if (name.includes('spiritbox')) {
      return 'sm:col-start-1 sm:row-start-1 lg:col-start-1 lg:row-start-1 sm:col-span-7 sm:row-span-1 lg:col-span-7 lg:row-span-1'
    }
    if (name.includes('currents')) {
      return 'sm:col-start-8 sm:row-start-1 lg:col-start-8 lg:row-start-1 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1'
    }
    if (name.includes('architects')) {
      return 'sm:col-start-1 sm:row-start-2 lg:col-start-1 lg:row-start-2 sm:col-span-7 sm:row-span-1 lg:col-span-7 lg:row-span-1'
    }
    if (name.includes('sleep token')) {
      return 'sm:col-start-8 sm:row-start-2 lg:col-start-8 lg:row-start-2 sm:col-span-1 sm:row-span-1 lg:col-span-1 lg:row-span-1'
    }
    
    return ''
  }

  return (
    <motion.div
      className={`${getCardSize(index)} ${getCardPosition(banda.name)}`}
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
      <div className={`relative bg-metal-surface border border-white/5 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isLargeCard ? 'aspect-[16/10]' : 'aspect-[4/5]'} min-h-[280px]`}>

        {/* Badge de destaque */}
        {banda.featured === true && (
          <motion.div
            className="absolute top-2 left-2 bg-accent-crimson text-white px-2 py-1 rounded text-xs font-semibold z-10"
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
          className="absolute top-2 right-2 bg-accent-crimson text-white px-2 py-1 rounded text-xs font-semibold z-10"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {banda.featured === true ? '🔥 Hot' : '🎵 New'}
        </motion.div>

        {/* Container da mídia */}
        <div className="relative w-full h-2/5">
          
          {/* Thumbnail padronizado da banda */}
          <StandardizedImage
            src={banda.image_url || ''}
            alt={`Imagem da banda ${banda.name || 'Banda'}`}
            fallbackText={banda.name || 'Banda'}
            variant={isLargeCard ? 'feature' : 'small'}
            filter="moderate"
            showOverlay={true}
            showVignette={true}
            className="w-full h-full object-cover"
          />
          
          {/* Botão de play overlay (aparece no hover) */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="rounded-full p-3" style={{ backgroundColor: 'rgba(211, 47, 47, 0.9)' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          
          {/* Botão de link externo */}
          {banda.official_url && typeof banda.official_url === 'string' && banda.official_url.trim() !== '' && (
            <motion.a
              href={banda.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-12 bg-black/70 text-white p-2 rounded-full hover:bg-accent-crimson transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Visitar site oficial de ${banda.name || 'Banda'}`}
            >
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Conteúdo do card */}
        <div className="p-4 flex flex-col flex-1 min-h-[120px]">
          
          {/* Título da banda */}
          <h3 className="text-white font-bold text-lg mb-3 tracking-wide" id={`banda-${banda.id || 'unknown'}-title`}>
            {banda.name || 'Nome não disponível'}
          </h3>
          
          {/* Descrição - SEMPRE VISÍVEL (truncada se necessário) */}
          {banda.description && (
            <p className="text-metal-text-2 text-sm leading-relaxed mb-3 flex-1 overflow-hidden" id={`banda-${banda.id}-description`}>
              <span className="line-clamp-2 block">
                {typeof banda.description === 'string' ? banda.description : 'Descrição não disponível'}
              </span>
              {typeof banda.description === 'string' && banda.description.length > 80 && (
                <button className="text-accent-crimson text-xs hover:underline mt-1">
                  Ler mais...
                </button>
              )}
            </p>
          )}
          
          {/* Metadata row - SEMPRE VISÍVEL */}
          <div className="flex items-center gap-2 mb-3 text-xs text-metal-text-2">
            {/* Gênero - SEMPRE VISÍVEL */}
            {banda.genre_tags && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-accent-crimson" />
                <span className="bg-metal-light-gray/14 rounded-full px-2 py-0.5">
                  {(() => {
                    try {
                      if (Array.isArray(banda.genre_tags)) {
                        const joined = banda.genre_tags.join(', ')
                        return joined.length > 20 ? `${joined.substring(0, 20)}...` : joined
                      } else if (typeof banda.genre_tags === 'string') {
                        return banda.genre_tags.length > 20 ? `${banda.genre_tags.substring(0, 20)}...` : banda.genre_tags
                      } else {
                        return 'Gênero não especificado'
                      }
                    } catch (error) {
                      console.warn(`Erro ao processar gênero para ${banda.name}:`, error)
                      return 'Gênero não disponível'
                    }
                  })()}
                </span>
              </div>
            )}
            
            {/* Status de destaque - SEMPRE VISÍVEL */}
            {banda.featured === true && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current text-accent-crimson" />
                <span>Em Destaque</span>
              </div>
            )}
          </div>

          {/* Action row - SEMPRE VISÍVEL */}
          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            
            {/* Botão de ação primária - SEMPRE VISÍVEL */}
            <button 
              className="btn-primary flex-1 flex items-center justify-center gap-2"
              aria-label={`Ouvir música da banda ${banda.name || 'Banda'}`}
              aria-describedby={banda.description ? `banda-${banda.id || 'unknown'}-description` : undefined}
              onClick={() => {
                // Implementar ação de play
                console.log(`Playing music for ${banda.name || 'Banda'}`)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Implementar ação de play
                  console.log(`Playing music for ${banda.name || 'Banda'}`)
                }
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Play Music</span>
            </button>
            
            {/* Botão de ação secundária - SEMPRE VISÍVEL se tiver URL */}
            {banda.official_url && typeof banda.official_url === 'string' && banda.official_url.trim() !== '' && (
              <a
                href={banda.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                aria-label={`Visitar site oficial de ${banda.name || 'Banda'}`}
                aria-describedby={banda.description ? `banda-${banda.id || 'unknown'}-description` : undefined}
              >
                <ExternalLink aria-hidden="true" className="w-4 h-4" />
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

  // Função para reordenar bandas para que Currents fique ao lado de Spiritbox e Sleep Token ao lado de Architects
  const reorderBandas = React.useMemo(() => (bandas: Band[]) => {
    const spiritbox = bandas.find(b => b.name.toLowerCase().includes('spiritbox'))
    const currents = bandas.find(b => b.name.toLowerCase().includes('currents'))
    const architects = bandas.find(b => b.name.toLowerCase().includes('architects'))
    const sleepToken = bandas.find(b => b.name.toLowerCase().includes('sleep token'))
    
    const outras = bandas.filter(b => 
      !b.name.toLowerCase().includes('spiritbox') && 
      !b.name.toLowerCase().includes('currents') &&
      !b.name.toLowerCase().includes('architects') &&
      !b.name.toLowerCase().includes('sleep token')
    )
    
    // Ordem desejada: Spiritbox, Currents (ao lado), Architects, Sleep Token (ao lado), outras
    const ordenadas = []
    if (spiritbox) ordenadas.push(spiritbox)
    if (currents) ordenadas.push(currents)
    if (architects) ordenadas.push(architects)
    if (sleepToken) ordenadas.push(sleepToken)
    
    return [...ordenadas, ...outras]
  }, [])

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
  }, [propBandas?.length]) // Só re-executa se o número de bandas mudar

  // Estado de loading
  if (loading) {
    return (
      <section id="destaques" className="section-spacing bg-gradient-to-b from-black to-gray-900">
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
      <section id="destaques" className="section-spacing bg-gradient-to-b from-black to-gray-900">
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
    <section id="destaques" className="section-spacing bg-gradient-to-b from-black to-gray-900">
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
          className="grid grid-cols-12 gap-4"
          style={{ 
            gridTemplateRows: 'repeat(2, minmax(400px, 1fr))',
            gridTemplateAreas: `
              "spiritbox currents"
              "architects sleeptoken"
            `
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {reorderBandas(bandas).map((banda, index) => (
            <BandCard 
              key={`${banda.id}-${index}`} 
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

