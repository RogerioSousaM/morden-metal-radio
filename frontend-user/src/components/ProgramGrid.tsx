import { motion } from 'framer-motion'
import { Clock, Music, Users, Heart } from 'lucide-react'

const ProgramGrid = () => {
  const programs = [
    {
      id: 1,
      time: '00:00 - 06:00',
      title: 'Metal Noturno',
      description: 'Os melhores clássicos do metal para acompanhar a madrugada',
      host: 'DJ Shadow',
      listeners: '234',
      isLive: false,
      genre: 'Classic Metal'
    },
    {
      id: 2,
      time: '06:00 - 10:00',
      title: 'Wake Up Metal',
      description: 'Energia pura para começar o dia com força total',
      host: 'DJ Thunder',
      listeners: '567',
      isLive: true,
      genre: 'Power Metal'
    },
    {
      id: 3,
      time: '10:00 - 14:00',
      title: 'Metal Industrial',
      description: 'Sintetizadores e guitarras distorcidas em harmonia',
      host: 'DJ Cyber',
      listeners: '432',
      isLive: false,
      genre: 'Industrial Metal'
    },
    {
      id: 4,
      time: '14:00 - 18:00',
      title: 'Death Metal Hour',
      description: 'As bandas mais pesadas do cenário underground',
      host: 'DJ Brutal',
      listeners: '789',
      isLive: false,
      genre: 'Death Metal'
    },
    {
      id: 5,
      time: '18:00 - 22:00',
      title: 'Metal Core Revolution',
      description: 'A nova geração do metal com breakdowns épicos',
      host: 'DJ Core',
      listeners: '1,234',
      isLive: false,
      genre: 'Metalcore'
    },
    {
      id: 6,
      time: '22:00 - 00:00',
      title: 'Black Metal Nights',
      description: 'Atmosfera sombria e riffs melódicos para a noite',
      host: 'DJ Frost',
      listeners: '456',
      isLive: false,
      genre: 'Black Metal'
    }
  ]

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
              className={`program-card group ${program.isLive ? 'live' : ''}`}
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
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-metal-orange" />
                <span className="text-sm font-mono text-metal-orange">
                  {program.time}
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
            VER PROGRAMAÇÃO COMPLETA
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramGrid
