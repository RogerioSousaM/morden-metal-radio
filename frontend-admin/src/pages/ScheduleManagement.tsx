import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Clock, Users, Music, Save, X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

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

const ScheduleManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      title: 'Metal Noturno',
      startTime: '00:00',
      endTime: '06:00',
      host: 'DJ Shadow',
      genre: 'Classic Metal',
      description: 'Os melhores clássicos do metal para acompanhar a madrugada',
      isLive: false,
      listeners: '234'
    },
    {
      id: 2,
      title: 'Wake Up Metal',
      startTime: '06:00',
      endTime: '10:00',
      host: 'DJ Thunder',
      genre: 'Power Metal',
      description: 'Energia pura para começar o dia com força total',
      isLive: true,
      listeners: '567'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    host: '',
    genre: '',
    description: '',
    isLive: false,
    listeners: ''
  })
  const [timeConflict, setTimeConflict] = useState<string | null>(null)

  const checkTimeConflict = (startTime: string, endTime: string, excludeId?: number) => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    
    if (start >= end) {
      return 'Horário de início deve ser menor que o horário de fim'
    }

    for (const program of programs) {
      if (excludeId && program.id === excludeId) continue
      
      const programStart = new Date(`2000-01-01 ${program.startTime}`)
      const programEnd = new Date(`2000-01-01 ${program.endTime}`)
      
      if ((start < programEnd && end > programStart)) {
        return `Conflito com "${program.title}" (${program.startTime} - ${program.endTime})`
      }
    }
    
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const conflict = checkTimeConflict(
      formData.startTime, 
      formData.endTime, 
      editingProgram?.id
    )
    
    if (conflict) {
      setTimeConflict(conflict)
      return
    }
    
    setTimeConflict(null)
    
    // Validação de segurança
    const sanitizedTitle = formData.title.replace(/[<>]/g, '')
    const sanitizedDescription = formData.description.replace(/[<>]/g, '')
    
    if (editingProgram) {
      setPrograms(programs.map(program => 
        program.id === editingProgram.id 
          ? { ...formData, id: program.id, title: sanitizedTitle, description: sanitizedDescription }
          : program
      ))
    } else {
      const newProgram: Program = {
        id: Date.now(),
        ...formData,
        title: sanitizedTitle,
        description: sanitizedDescription
      }
      setPrograms([...programs, newProgram])
    }
    
    setIsModalOpen(false)
    setEditingProgram(null)
    setFormData({
      title: '',
      startTime: '',
      endTime: '',
      host: '',
      genre: '',
      description: '',
      isLive: false,
      listeners: ''
    })
  }

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormData(program)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este programa?')) {
      setPrograms(programs.filter(program => program.id !== id))
    }
  }

  const formatTime = (time: string) => {
    return time.replace(':', 'h')
  }

  return (
    <div className="min-h-screen bg-metal-dark text-metal-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-widest uppercase mb-2">
                Gestão da Programação
              </h1>
              <p className="text-metal-text-secondary">
                Gerencie a grade de programação da rádio
              </p>
            </div>
            <motion.button
              className="btn-primary flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Adicionar Programa
            </motion.button>
          </div>
        </motion.div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              className={`program-card group ${program.isLive ? 'live' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
                  {formatTime(program.startTime)} - {formatTime(program.endTime)}
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
                <Music className="w-4 h-4 text-metal-text-secondary" />
                <span className="text-sm text-metal-text-secondary">
                  {program.genre}
                </span>
              </div>

              {/* Listeners */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-metal-text-secondary">
                    {program.listeners} ouvintes
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <motion.button
                    className="text-metal-orange hover:text-metal-accent transition-colors"
                    onClick={() => handleEdit(program)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="text-metal-red hover:text-metal-red/80 transition-colors"
                    onClick={() => handleDelete(program.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-metal-card rounded-lg p-6 w-full max-w-md mx-4 border border-metal-light-gray/20 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingProgram ? 'Editar Programa' : 'Adicionar Programa'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingProgram(null)
                    setTimeConflict(null)
                    setFormData({
                      title: '',
                      startTime: '',
                      endTime: '',
                      host: '',
                      genre: '',
                      description: '',
                      isLive: false,
                      listeners: ''
                    })
                  }}
                  className="text-metal-text-secondary hover:text-metal-orange"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {timeConflict && (
                <motion.div
                  className="mb-4 p-3 bg-metal-red/10 border border-metal-red/30 rounded-lg flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertTriangle className="w-4 h-4 text-metal-red" />
                  <span className="text-sm text-metal-red">{timeConflict}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Programa</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    required
                    maxLength={100}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Horário de Início</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        setFormData({...formData, startTime: e.target.value})
                        setTimeConflict(null)
                      }}
                      className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Horário de Fim</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => {
                        setFormData({...formData, endTime: e.target.value})
                        setTimeConflict(null)
                      }}
                      className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Apresentador</label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({...formData, host: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    required
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gênero Musical</label>
                  <input
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    required
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none h-24 resize-none"
                    required
                    maxLength={300}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ouvintes</label>
                  <input
                    type="text"
                    value={formData.listeners}
                    onChange={(e) => setFormData({...formData, listeners: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="234"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLive"
                    checked={formData.isLive}
                    onChange={(e) => setFormData({...formData, isLive: e.target.checked})}
                    className="w-4 h-4 text-metal-orange bg-metal-gray border-metal-light-gray/30 rounded focus:ring-metal-orange"
                  />
                  <label htmlFor="isLive" className="text-sm font-medium">
                    Marcar como AO VIVO
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2 flex-1 justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!!timeConflict}
                  >
                    <Save className="w-4 h-4" />
                    {editingProgram ? 'Atualizar' : 'Adicionar'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ScheduleManagement 