import { motion } from 'framer-motion'
import { Clock, Music, Users, Heart, Play, Info, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, Program } from '../services/api'
import { useToast } from './ui/Toast'

const ProgramGrid = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [requestingProgram, setRequestingProgram] = useState<number | null>(null)
  const [playingProgram, setPlayingProgram] = useState<number | null>(null)
  const { showSuccess, showError, showInfo } = useToast()

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true)
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
        setLoading(false)
      }
    }

    loadPrograms()
  }, [])

  // Função para lidar com preferências de movimento reduzido
  const shouldReduceMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  // Função para reproduzir programa
  const handlePlayProgram = async (programId: number) => {
    try {
      setPlayingProgram(programId)
      const success = await apiService.playProgram(programId)
      
      if (success) {
        showSuccess('Programa iniciado', 'O programa está sendo reproduzido agora')
      } else {
        showError('Erro ao reproduzir', 'Não foi possível iniciar o programa')
      }
    } catch (error) {
      showError('Erro ao reproduzir', 'Falha na conexão com o servidor')
    } finally {
      setPlayingProgram(null)
    }
  }

  // Função para ver detalhes do programa
  const handleProgramDetails = async (programId: number) => {
    try {
      const program = await apiService.getProgramDetails(programId)
      if (program) {
        // Navegar para página de detalhes ou mostrar modal
        showInfo('Detalhes do programa', `${program.title} - ${program.description}`)
      } else {
        showError('Erro', 'Não foi possível carregar os detalhes do programa')
      }
    } catch (error) {
      showError('Erro', 'Falha ao carregar detalhes do programa')
    }
  }

  // Função para solicitar música
  const handleRequestSong = async (programId: number) => {
    try {
      setRequestingProgram(programId)
      
      // Aqui você poderia abrir um modal para coletar informações da solicitação
      const request = {
        programId,
        songName: 'Música solicitada pelo usuário',
        artistName: 'Artista',
        message: 'Solicitação via interface web',
        contactEmail: 'user@example.com'
      }
      
      const success = await apiService.requestProgramSong(request)
      
      if (success) {
        showSuccess('Solicitação enviada', 'Sua música foi solicitada com sucesso!')
      } else {
        showError('Erro na solicitação', 'Não foi possível enviar sua solicitação')
      }
    } catch (error) {
      showError('Erro na solicitação', 'Falha ao processar sua solicitação')
    } finally {
      setRequestingProgram(null)
    }
  }

  // Estado de loading
  if (loading) {
    return (
      <section id="programacao" className="py-16 px-4 sm:px-6 lg:px-8 bg-metal-gray/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metal-text mb-4 tracking-widest uppercase">
              Programação
            </h2>
            <p className="text-xl text-metal-text-secondary max-w-2xl mx-auto">
              Confira nossa grade completa de 24 horas de metal ininterrupto
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-crimson"></div>
          </div>
        </div>
      </section>
    )
  }

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
              transition={{ 
                duration: shouldReduceMotion() ? 0 : 0.6, 
                delay: shouldReduceMotion() ? 0 : index * 0.1 
              }}
              viewport={{ once: true }}
              whileHover={shouldReduceMotion() ? {} : { scale: 1.02 }}
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
                <Clock className="w-4 h-4 text-accent-crimson" />
                <span className="text-sm font-mono text-accent-crimson">
                  {program.startTime} - {program.endTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-metal-text mb-2 group-hover:text-accent-crimson transition-colors">
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
                  Apresentado por <span className="text-accent-crimson font-medium">{program.host}</span>
                </span>
              </div>

              {/* Genre */}
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-metal-text-secondary" />
                <span className="text-sm text-metal-text-secondary">
                  {program.genre}
                </span>
              </div>

              {/* Listeners */}
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-accent-crimson" />
                <span className="text-sm text-metal-text-secondary">
                  {program.listeners} ouvintes
                </span>
              </div>

              {/* Action Buttons Container */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                {/* Play Button */}
                <motion.button
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-accent-crimson text-white text-sm font-medium hover:bg-accent-crimson/90 transition-colors min-w-[80px] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent-crimson focus:ring-offset-2 focus:ring-offset-metal-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Ouvir programa ${program.title}`}
                  onClick={() => handlePlayProgram(program.id)}
                  disabled={playingProgram === program.id}
                >
                  {playingProgram === program.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">
                    {playingProgram === program.id ? 'Carregando...' : 'Ouvir'}
                  </span>
                </motion.button>

                {/* Details Button */}
                <motion.button
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-transparent text-accent-crimson border border-accent-crimson text-sm font-medium hover:bg-accent-crimson/10 transition-colors min-w-[80px] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent-crimson focus:ring-offset-2 focus:ring-offset-metal-dark"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Ver detalhes do programa ${program.title}`}
                  onClick={() => handleProgramDetails(program.id)}
                >
                  <Info className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Detalhes</span>
                </motion.button>

                {/* Request Button */}
                <motion.button
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-transparent text-accent-amber border border-accent-amber text-sm font-medium hover:bg-accent-amber/10 transition-colors min-w-[80px] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2 focus:ring-offset-metal-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Solicitar música para o programa ${program.title}`}
                  onClick={() => handleRequestSong(program.id)}
                  disabled={requestingProgram === program.id}
                >
                  {requestingProgram === program.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-amber"></div>
                  ) : (
                    <Calendar className="w-4 h-4 mr-1" />
                  )}
                  <span className="hidden sm:inline">
                    {requestingProgram === program.id ? 'Enviando...' : 'Solicitar'}
                  </span>
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
            whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
          >
            <Music className="w-5 h-5" />
            Ver Grade Completa
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramGrid
