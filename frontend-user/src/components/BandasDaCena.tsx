import React, { useState, useEffect } from 'react'
import { ExternalLink, Music } from 'lucide-react'
import { apiService } from '../services/api'

interface Banda {
  id: number
  name: string
  slug: string
  description: string
  official_url: string
  image_url: string
  genre_tags: string
  featured: boolean
  created_at: string
}

const BandasDaCena: React.FC = () => {
  const [bandas, setBandas] = useState<Banda[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBandas = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const bandasDestaque = await apiService.getFeaturedBands()
        setBandas(bandasDestaque.slice(0, 8))
      } catch (err) {
        console.error('Erro ao buscar bandas:', err)
        setError('Erro ao carregar bandas da cena')
      } finally {
        setLoading(false)
      }
    }

    fetchBandas()
  }, [])

  const parseGenreTags = (tags: string): string[] => {
    try {
      const parsed = JSON.parse(tags)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando bandas da cena...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Music className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (bandas.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Nenhuma banda encontrada</h2>
            <p className="text-gray-400">As bandas da cena serão adicionadas em breve</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <div className="text-center mb-12">
                                <h2 className="heading-1 text-white mb-4">
                        Bandas da Cena
                      </h2>
                      <p className="text-body-large text-gray-400 max-w-2xl mx-auto">
                        Descubra as bandas que estão fazendo história no cenário metal moderno
                      </p>
        </div>

        {/* Grid de bandas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {bandas.map((banda) => (
            <div
              key={banda.id}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            >
              {/* Imagem da banda */}
              <div className="relative h-48 overflow-hidden">
                {banda.image_url ? (
                  <img
                    src={banda.image_url}
                    alt={banda.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center bg-gray-700 ${banda.image_url ? 'hidden' : ''}`}>
                  <Music className="w-16 h-16 text-gray-500" />
                </div>
                
                {/* Overlay com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Informações da banda */}
              <div className="p-6">
                                            <h3 className="heading-5 text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                              {banda.name}
                            </h3>
                
                {banda.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {banda.description}
                  </p>
                )}

                {/* Tags de gênero */}
                {banda.genre_tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parseGenreTags(banda.genre_tags).slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                    {parseGenreTags(banda.genre_tags).length > 3 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                        +{parseGenreTags(banda.genre_tags).length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Botão para site oficial */}
                {banda.official_url && (
                  <a
                    href={banda.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-300 group-hover:bg-red-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Site Oficial
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botão "Ver mais" */}
        <div className="text-center">
          <button className="px-8 py-3 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
            Ver Todas as Bandas
          </button>
        </div>
      </div>
    </section>
  )
}

export default BandasDaCena
