import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Clock, Users, Music, Save, X, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface Program {
  id: number
  name: string
  startTime: string
  endTime: string
  host: string
  genre: string
  description: string
  live: boolean
}

const ScheduleManagement = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: 'Metal Noturno',
      startTime: '00:00',
      endTime: '06:00',
      host: 'DJ Shadow',
      genre: 'Classic Metal',
      description: 'Os melhores clássicos do metal para acompanhar suas noites.',
      live: true
    },
    {
      id: 2,
      name: 'Morning Metal',
      startTime: '06:00',
      endTime: '12:00',
      host: 'DJ Thunder',
      genre: 'Modern Metal',
      description: 'Energia para começar o dia com o melhor do metal moderno.',
      live: false
    },
    {
      id: 3,
      name: 'Afternoon Crush',
      startTime: '12:00',
      endTime: '18:00',
      host: 'DJ Phoenix',
      genre: 'Progressive Metal',
      description: 'Metal progressivo para acompanhar sua tarde.',
      live: false
    },
    {
      id: 4,
      name: 'Evening Storm',
      startTime: '18:00',
      endTime: '00:00',
      host: 'DJ Storm',
      genre: 'Heavy Metal',
      description: 'Fechando o dia com o melhor do heavy metal.',
      live: false
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    host: '',
    genre: '',
    description: '',
    live: false
  })
  const [timeConflict, setTimeConflict] = useState(false)

  const handleAddProgram = () => {
    setEditingProgram(null)
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      host: '',
      genre: '',
      description: '',
      live: false
    })
    setTimeConflict(false)
    setShowModal(true)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      startTime: program.startTime,
      endTime: program.endTime,
      host: program.host,
      genre: program.genre,
      description: program.description,
      live: program.live
    })
    setTimeConflict(false)
    setShowModal(true)
  }

  const handleDeleteProgram = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este programa?')) {
      setPrograms(programs.filter(program => program.id !== id))
    }
  }

  const checkTimeConflict = (startTime: string, endTime: string, excludeId?: number) => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    
    if (end <= start) {
      return true // Conflito se o horário de fim é menor ou igual ao início
    }

    return programs.some(program => {
      if (excludeId && program.id === excludeId) return false
      
      const programStart = new Date(`2000-01-01T${program.startTime}:00`)
      const programEnd = new Date(`2000-01-01T${program.endTime}:00`)
      
      return (start < programEnd && end > programStart)
    })
  }

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    if (newFormData.startTime && newFormData.endTime) {
      const conflict = checkTimeConflict(
        newFormData.startTime, 
        newFormData.endTime, 
        editingProgram?.id
      )
      setTimeConflict(conflict)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (timeConflict) {
      alert('Conflito de horário detectado! Verifique os horários dos programas.')
      return
    }
    
    // Sanitização básica contra XSS
    const sanitizedData = {
      ...formData,
      name: formData.name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
      description: formData.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
      host: formData.host.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }

    if (editingProgram) {
      // Editar programa existente
      setPrograms(programs.map(program => 
        program.id === editingProgram.id 
          ? { ...program, ...sanitizedData }
          : program
      ))
    } else {
      // Adicionar novo programa
      const newProgram: Program = {
        id: Date.now(),
        ...sanitizedData
      }
      setPrograms([...programs, newProgram])
    }
    
    setShowModal(false)
  }

  const formatTime = (time: string) => {
    return time
  }

  const getCurrentProgram = () => {
    const now = new Date()
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    return programs.find(program => {
      const start = program.startTime
      const end = program.endTime
      
      if (start <= end) {
        return currentTime >= start && currentTime < end
      } else {
        // Programa que passa da meia-noite
        return currentTime >= start || currentTime < end
      }
    })
  }

  const currentProgram = getCurrentProgram()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Programação</h1>
          <p className="text-gray-400">Gerencie a programação da rádio</p>
        </div>
        <button
          onClick={handleAddProgram}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Adicionar Programa
        </button>
      </motion.div>

      {/* Programa Atual */}
      {currentProgram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">AO VIVO AGORA</h2>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{currentProgram.name}</h3>
              <p className="text-orange-300">{currentProgram.host}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm">Horário</p>
              <p className="text-white font-semibold">{formatTime(currentProgram.startTime)} - {formatTime(currentProgram.endTime)}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Lista de Programas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className={`bg-gray-800/50 border rounded-xl p-6 transition-all duration-300 ${
              program.live 
                ? 'border-orange-500/50 hover:border-orange-500/70' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{program.name}</h3>
                  {program.live && (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      AO VIVO
                    </span>
                  )}
                </div>
                <p className="text-orange-400 text-sm font-medium mb-1">{program.genre}</p>
                <p className="text-gray-300 text-sm">{program.host}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(program.startTime)} - {formatTime(program.endTime)}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />
                  <span>1.2k ouvintes</span>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4">{program.description}</p>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditProgram(program)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 py-2 rounded-lg transition-all duration-300"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDeleteProgram(program.id)}
                className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-lg transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal para Adicionar/Editar Programa */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingProgram ? 'Editar Programa' : 'Adicionar Novo Programa'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Programa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Digite o nome do programa"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Horário de Fim
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {timeConflict && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  Conflito de horário detectado!
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Apresentador
                </label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nome do apresentador"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gênero
                </label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: Classic Metal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Descreva o programa..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="live"
                  checked={formData.live}
                  onChange={(e) => setFormData({ ...formData, live: e.target.checked })}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="live" className="text-sm font-medium text-gray-300">
                  Marcar como AO VIVO
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={timeConflict}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingProgram ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ScheduleManagement 