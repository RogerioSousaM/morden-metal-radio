import { motion } from 'framer-motion'
import { Clock, Music, Users, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

interface Program {
  id: number
  title: string
  startTime: string
  endTime: string
  host: string
  genre: string
  description: string
  isLive: boolean
  listeners: string
}

const ProgramGrid = () => {
  const [programs, setPrograms] = useState<Program[]>([])

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const apiPrograms = await apiService.getProgramasPublicos()
        setPrograms(apiPrograms)
      } catch (error) {
        console.error('Erro ao carregar programas:', error)
        // Fallback para dados estáticos em caso de erro
        setPrograms([
          {
            id: 1,
            title: 'Metal Noturno',
            startTime: '00:00',
            endTime: '06:00',
            description: 'Os melhores clássicos do metal para acompanhar a madrugada',
            host: 'DJ Shadow',
            listeners: '234',
            isLive: false,
            genre: 'Classic Metal'
          },
          {
            id: 2,
            title: 'Wake Up Metal',
            startTime: '06:00',
            endTime: '10:00',
            description: 'Energia pura para começar o dia com força total',
            host: 'DJ Thunder',
            listeners: '567',
            isLive: true,
            genre: 'Power Metal'
          },
          {
            id: 3,
            title: 'Metal Industrial',
            startTime: '10:00',
            endTime: '14:00',
            description: 'Sintetizadores e guitarras distorcidas em harmonia',
            host: 'DJ Cyber',
            listeners: '432',
            isLive: false,
            genre: 'Industrial Metal'
          },
          {
            id: 4,
            title: 'Death Metal Hour',
            startTime: '14:00',
            endTime: '18:00',
            description: 'As bandas mais pesadas do cenário underground',
            host: 'DJ Brutal',
            listeners: '789',
            isLive: false,
            genre: 'Death Metal'
          },
          {
            id: 5,
            title: 'Metal Core Revolution',
            startTime: '18:00',
            endTime: '22:00',
            description: 'A nova geração do metal com breakdowns épicos',
            host: 'DJ Core',
            listeners: '1,234',
            isLive: false,
            genre: 'Metalcore'
          },
          {
            id: 6,
            title: 'Black Metal Nights',
            startTime: '22:00',
            endTime: '00:00',
            description: 'Atmosfera sombria e riffs melódicos para a noite',
            host: 'DJ Frost',
            listeners: '456',
            isLive: false,
            genre: 'Black Metal'
          }
        ])
      } finally {
        // setLoading(false) // Removed as per edit hint
      }
    }

    loadPrograms()
  }, [])

  return (
    <section id="programacao" className="py-16 px-4 sm:px-6 lg:px-8 bg-metal-gray/30">
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
            Programação
          </h2>
          <p className="text-xl text-metal-text-secondary max-w-2xl mx-auto">
            Confira nossa grade completa de 24 horas de metal ininterrupto
          </p>
        </motion.div>

        {/* Program Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              className={`card card-compact group ${program.isLive ? 'live' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Live Indicator */}
              {program.isLive && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="live-indicator">
                    <div className="live-dot"></div>
                    <span className="text-xs font-bold">AO VIVO</span>
                  </div>
                </div>
              )}

              {/* Time */}
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-metal-orange" />
                <span className="text-sm font-mono text-metal-orange">
                  {program.startTime} - {program.endTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-metal-text mb-2 group-hover:text-metal-orange transition-colors">
                {program.title}
              </h3>

              {/* Description */}
              <p className="text-metal-text-secondary text-sm mb-4 leading-relaxed">
                {program.description}
              </p>

              {/* Host */}
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-metal-text-secondary" />
                <span className="text-sm text-metal-text-secondary">
                  Apresentado por <span className="text-metal-orange font-medium">{program.host}</span>
                </span>
              </div>

              {/* Genre */}
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-metal-text-secondary tooltip" data-tooltip="Gênero musical" />
                <span className="text-sm text-metal-text-secondary">
                  {program.genre}
                </span>
              </div>

              {/* Listeners */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-metal-red tooltip" data-tooltip="Ouvintes ativos" />
                  <span className="text-sm text-metal-text-secondary">
                    {program.listeners} ouvintes
                  </span>
                </div>
                
                <motion.button
                  className="text-metal-orange hover:text-metal-accent transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Ver detalhes do programa"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
            className="btn-secondary flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Music className="w-5 h-5" />
            View Full Schedule
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramGrid
