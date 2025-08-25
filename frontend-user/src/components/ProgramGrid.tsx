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
        // Como não temos API para programas ainda, vamos usar dados estáticos
        // const apiPrograms = await apiService.getProgramasPublicos()
        // setPrograms(apiPrograms)
        
        // Dados estáticos para demonstração
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
            genre: 'Metalcore'
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
            title: 'Modern Metal Revolution',
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
            genre: 'Metalcore'
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
            title: 'Modern Metal Revolution',
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
      <section className="section section-content">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-center mb-4">
              Programação
            </h2>
            <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
              Confira nossa grade completa de 24 horas de metal ininterrupto
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
            Programação
          </h2>
          <p className="text-body-large text-center text-secondary max-w-2xl mx-auto">
            Confira nossa grade completa de 24 horas de metal ininterrupto
          </p>
        </motion.div>

        {/* Program Grid */}
        <div className="card-grid">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              className={`program-card ${program.isLive ? 'live' : ''}`}
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
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span className="text-xs font-bold">AO VIVO</span>
                </div>
              )}

              {/* Time */}
              <div className="program-time">
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  {program.startTime} - {program.endTime}
                </span>
              </div>

              {/* Title */}
              <h3 className="program-title">
                {program.title}
              </h3>

              {/* Description */}
              <p className="program-description">
                {program.description}
              </p>

              {/* Meta Information */}
              <div className="program-meta">
                {/* Host */}
                <div className="program-meta-item">
                  <Users className="icon" />
                  <span>
                    Apresentado por <span className="text-primary font-medium">{program.host}</span>
                  </span>
                </div>

                {/* Genre */}
                <div className="program-meta-item">
                  <Music className="icon" />
                  <span>{program.genre}</span>
                </div>

                {/* Listeners */}
                <div className="program-meta-item">
                  <Heart className="icon" />
                  <span>{program.listeners} ouvintes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="program-actions">
                {/* Play Button */}
                <motion.button
                  className="btn btn-primary"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Ouvir programa ${program.title}`}
                  onClick={() => handlePlayProgram(program.id)}
                  disabled={playingProgram === program.id}
                >
                  {playingProgram === program.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {playingProgram === program.id ? 'Carregando...' : 'Ouvir'}
                  </span>
                </motion.button>

                {/* Details Button */}
                <motion.button
                  className="btn btn-secondary"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Ver detalhes do programa ${program.title}`}
                  onClick={() => handleProgramDetails(program.id)}
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Detalhes</span>
                </motion.button>

                {/* Request Button */}
                <motion.button
                  className="btn btn-outline"
                  whileHover={shouldReduceMotion() ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion() ? {} : { scale: 0.95 }}
                  aria-label={`Solicitar música para o programa ${program.title}`}
                  onClick={() => handleRequestSong(program.id)}
                  disabled={requestingProgram === program.id}
                >
                  {requestingProgram === program.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
                  ) : (
                    <Calendar className="w-4 h-4" />
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
            className="btn btn-secondary btn-lg"
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
