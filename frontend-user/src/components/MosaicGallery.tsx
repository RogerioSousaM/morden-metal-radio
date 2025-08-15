import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Star, ExternalLink } from 'lucide-react'
import { DestaqueItem, fetchFeaturedDestaques } from '../data/featuredGallery'

interface MosaicGalleryProps {
  destaques?: DestaqueItem[]
}



const MosaicGallery: React.FC<MosaicGalleryProps> = ({ 
  destaques: propDestaques 
}) => {
  const [destaques, setDestaques] = useState<DestaqueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDestaques = async () => {
      try {
        setLoading(true)
        // Se não foram passados via props, buscar da API
        if (!propDestaques || propDestaques.length === 0) {
          const apiDestaques = await fetchFeaturedDestaques()
          setDestaques(apiDestaques)
        } else {
          setDestaques(propDestaques)
        }
      } catch (error) {
        console.error('Erro ao carregar destaques da cena:', error)
        setDestaques([])
      } finally {
        setLoading(false)
      }
    }

    loadDestaques()
  }, [propDestaques])

  // Se não há destaques, mostrar placeholder
  if (!loading && destaques.length === 0) {
    return (
      <section id="destaques" className="py-20 bg-gradient-to-b from-metal-dark to-metal-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da seção */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-metal-text mb-4 tracking-wider"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
               DESTAQUES DA CENA
            </motion.h2>
            <motion.p
              className="text-xl text-metal-text-secondary max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              As mais pesadas do momento
            </motion.p>
            
            {/* Placeholder estilizado */}
            <div className="bg-metal-black/50 border-2 border-dashed border-metal-orange/30 rounded-2xl p-16 max-w-2xl mx-auto">
              <div className="text-metal-text-secondary">
                <svg 
                  className="w-16 h-16 mx-auto mb-4 text-metal-orange/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <h3 className="text-lg font-semibold text-metal-orange mb-2">
                  Nenhum Destaque Disponível
                </h3>
                <p className="text-sm">
                  Será populado pelo painel de administração via aba Filmaço
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  // Loading state
  if (loading) {
    return (
      <section id="destaques" className="py-20 bg-gradient-to-b from-metal-dark to-metal-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-8"></div>
            <p className="text-metal-text-secondary">Carregando destaques...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="destaques" className="py-20 bg-gradient-to-b from-metal-dark to-metal-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-metal-text mb-4 tracking-wider"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            🎬 DESTAQUES DA CENA
          </motion.h2>
          <motion.p
            className="text-xl text-metal-text-secondary max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Os melhores filmes de terror e novidades sombrias selecionadas especialmente para os fãs do metal
          </motion.p>
        </motion.div>

        {/* Grid em mosaico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destaques.map((destaque, index) => (
            <motion.div
              key={destaque.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Card do destaque */}
              <div className="card overflow-hidden h-full hover:ring-2 hover:ring-metal-orange/30 transition-all duration-300 hover:scale-105">
                {/* Badge de destaque */}
                {destaque.ativo ? (
                  <motion.div
                    className="absolute top-4 left-4 z-20"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <span className="featured-badge text-xs font-bold px-3 py-1 rounded-full text-white">
                      Destaque
                    </span>
                  </motion.div>
                ) : null}

                {/* Imagem do filme */}
                <div className="relative overflow-hidden">
                  <motion.img
                    src={destaque.imagem || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='}
                    alt={destaque.titulo}
                    className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback para imagem de erro
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='
                    }}
                  />
                  
                  {/* Overlay sutil com botão de link - apenas no canto */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      className="bg-black/70 hover:bg-metal-orange/80 text-white p-2 rounded-full transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Informações do destaque */}
                <div className="p-4 space-y-3 bg-metal-card">
                  <h3 className="text-lg font-bold text-metal-text group-hover:text-metal-orange transition-colors duration-300 line-clamp-2">
                    {destaque.titulo}
                  </h3>
                  
                  {/* Meta informações */}
                  <div className="flex items-center justify-between text-sm text-metal-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Ordem: {destaque.ordem}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>Ativo</span>
                    </div>
                  </div>
                  
                  {/* Descrição */}
                  <p className="text-sm text-metal-text-secondary line-clamp-3">
                    {destaque.descricao}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MosaicGallery
