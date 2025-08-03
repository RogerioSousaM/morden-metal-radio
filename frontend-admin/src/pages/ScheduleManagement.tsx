import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Clock, Users, Music, Save, X, AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

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
  const [saving, setSaving] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    const conflict = checkTimeConflict(
      formData.startTime, 
      formData.endTime, 
      editingProgram?.id
    )
    
    if (conflict) {
      setTimeConflict(conflict)
      setSaving(false)
      return
    }
    
    setTimeConflict(null)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingProgram) {
      setPrograms(programs.map(program => 
        program.id === editingProgram.id ? { ...formData, id: program.id } : program
      ))
    } else {
      const newProgram = {
        ...formData,
        id: Math.max(...programs.map(p => p.id)) + 1
      }
      setPrograms([...programs, newProgram])
    }
    
    setIsModalOpen(false)
    setEditingProgram(null)
    resetForm()
    setSaving(false)
  }

  const resetForm = () => {
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
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleAddNew = () => {
    setEditingProgram(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProgram(null)
    resetForm()
    setTimeConflict(null)
  }

  return (
    <PageLayout
      title="Gestão de Programação"
      subtitle="Gerencie a programação da rádio, horários e apresentadores"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Novo Programa"
    >
      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((program, index) => (
          <Card
            key={program.id}
            delay={index * 0.1}
            hover={true}
            className="p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-metal-accent to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-metal-text">{program.title}</h3>
                  <p className="text-sm text-metal-text-secondary">{program.genre}</p>
                </div>
              </div>
              {program.isLive && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400 font-medium">AO VIVO</span>
                </div>
              )}
            </div>

            <p className="text-sm text-metal-text-secondary mb-4 line-clamp-2">
              {program.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-metal-text-secondary">Horário:</span>
                <span className="font-medium">
                  {formatTime(program.startTime)} - {formatTime(program.endTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-metal-text-secondary">Apresentador:</span>
                <span className="font-medium">{program.host}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-metal-text-secondary">Ouvintes:</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{program.listeners}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => handleEdit(program)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit className="w-4 h-4" />
                Editar
              </motion.button>
              <motion.button
                onClick={() => handleDelete(program.id)}
                className="btn-danger flex items-center justify-center gap-2 text-sm px-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProgram ? 'Editar Programa' : 'Novo Programa'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Time Conflict Warning */}
          <AnimatePresence>
            {timeConflict && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{timeConflict}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Título do Programa</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
                placeholder="Digite o título do programa"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Gênero</label>
              <input
                type="text"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="form-input"
                placeholder="Ex: Heavy Metal, Thrash Metal"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Horário de Início</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Horário de Fim</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Apresentador</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                className="form-input"
                placeholder="Nome do apresentador"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="Descreva o programa..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Ouvintes Atuais</label>
              <input
                type="text"
                value={formData.listeners}
                onChange={(e) => setFormData({ ...formData, listeners: e.target.value })}
                className="form-input"
                placeholder="Ex: 1.2K"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isLive"
                checked={formData.isLive}
                onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="isLive" className="text-sm text-metal-text-secondary">
                Programa ao Vivo
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-metal-border">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Salvando...' : (editingProgram ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default ScheduleManagement 