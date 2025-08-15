import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Calendar, Star, ExternalLink } from 'lucide-react'

interface Movie {
  id: number
  titulo: string
  imagem: string | null
  ano: number
  nota: number
  descricao: string
  indicacao_do_mes: boolean
  created_at: string
}

const Filmaço = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/filmes')
        const data = await response.json()
        // Garante que indicacao_do_mes é booleano
        const filmesCorrigidos = (data.filmes || []).map((filme: any) => ({
          ...filme,
          indicacao_do_mes: Boolean(filme.indicacao_do_mes)
        }))
        setMovies(filmesCorrigidos)
      } catch (error) {
        console.error('Erro ao carregar filmes:', error)
        // Fallback para dados estáticos em caso de erro com imagens melhoradas
        setMovies([
          {
            id: 1,
            titulo: "O Mal que Nos Habita",
            imagem: "https://m.media-amazon.com/images/M/MV5BYWUwOTIzZDQtMTNhMi00NmRkLWFiYzItMmE0ZTU5OGUwMWU3XkEyXkFqcGdeQXVyMTQyODg5MjQw._V1_.jpg",
            ano: 2023,
            nota: 4.5,
            descricao: "Uma família se muda para uma casa isolada e descobre que há algo sinistro habitando nas paredes.",
            indicacao_do_mes: true,
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            titulo: "Terrifier 2",
            imagem: "https://m.media-amazon.com/images/M/MV5BN2NiZDFlN2QtYzQ5Ni00ZDI4LTljMzgtMGMzNjczNzFiZGMxXkEyXkFqcGdeQXVyMTEyNjQyNzg5._V1_.jpg",
            ano: 2022,
            nota: 4.0,
            descricao: "Art the Clown retorna para aterrorizar uma nova vítima em uma noite de Halloween sangrenta.",
            indicacao_do_mes: false,
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            titulo: "Hereditário",
            imagem: "https://m.media-amazon.com/images/M/MV5BMjA4MzAxMzQzMF5BMl5BanBnXkFtZTgwNjk5NzYzNTM@._V1_.jpg",
            ano: 2018,
            nota: 4.8,
            descricao: "Uma família é atormentada por uma presença demoníaca após a morte da avó matriarca.",
            indicacao_do_mes: false,
            created_at: new Date().toISOString()
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <section id="filmaço" className="py-20 bg-gradient-to-b from-metal-dark to-metal-gray">
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
             FILMAÇO
          </motion.h2>
          <motion.p
            className="text-xl text-metal-text-secondary max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Descubra os filmes de terror mais aterrorizantes e novidades sombrias 
            selecionadas especialmente para os fãs do metal e do horror
          </motion.p>
        </motion.div>

        {/* Grid de filmes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Card do filme */}
                <div className="card overflow-hidden h-full hover:ring-2 hover:ring-metal-orange/30 transition-all duration-300 hover:scale-105">
                  {/* Badge de destaque */}
                  {movie.indicacao_do_mes ? (
                    <motion.div
                      className="absolute top-4 left-4 z-20"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <span className="featured-badge text-xs font-bold px-3 py-1 rounded-full text-white">
                        Indicação do Mês
                      </span>
                    </motion.div>
                  ) : null}

                  {/* Imagem do filme */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={movie.imagem || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='}
                      alt={movie.titulo}
                      className="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback para imagem de erro
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='
                      }}
                    />
                    
                    {/* Overlay sutil com botão play - apenas no canto */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        className="bg-black/70 hover:bg-metal-orange/80 text-white p-2 rounded-full transition-colors duration-200"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-4 h-4 ml-0.5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Informações do filme - SEMPRE VISÍVEIS */}
                  <div className="p-4 space-y-3 bg-metal-card">
                    <h3 className="text-lg font-bold text-metal-text group-hover:text-metal-orange transition-colors duration-300 line-clamp-2">
                      {movie.titulo}
                    </h3>
                    
                    {/* Meta informações */}
                    <div className="flex items-center justify-between text-sm text-metal-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-metal-orange" />
                        <span>{movie.ano}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{movie.nota}</span>
                      </div>
                    </div>

                    {/* Sinopse */}
                    <p className="text-sm text-metal-text-secondary line-clamp-3 leading-relaxed">
                      {movie.descricao}
                    </p>

                    {/* Botão Ver Detalhes */}
                    <motion.button
                      className="btn-secondary w-full mt-4 flex items-center justify-center gap-2 group-hover:bg-metal-orange/10 group-hover:border-metal-orange/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver Detalhes
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Mais Filmes de Terror
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Filmaço 