import { motion, AnimatePresence } from 'framer-motion'
import { Edit, Trash2, Clock, Users, Save, AlertTriangle, Loader2, Plus, Calendar, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

interface Schedule {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  type: 'show' | 'event' | 'interview' | 'special'
  isActive: boolean
  maxAttendees: number
  currentAttendees: number
  host: string
  genre: string
  createdAt: string
  updatedAt: string
}

interface ScheduleFormData {
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  type: 'show' | 'event' | 'interview' | 'special'
  maxAttendees: number
  host: string
  genre: string
}

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'show',
    maxAttendees: 100,
    host: '',
    genre: ''
  })
  const [timeConflict, setTimeConflict] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewSchedule, setPreviewSchedule] = useState<Schedule | null>(null)

  // Carregar agenda
  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      setLoading(true)
      const data = await apiService.getSchedule()
      // Garantir que data seja sempre um array
      const schedulesArray = Array.isArray(data) ? data : []
      setSchedules(schedulesArray)
    } catch (error) {
      setError('Erro ao carregar agenda')
      console.error('Erro ao carregar agenda:', error)
      setSchedules([]) // Definir como array vazio em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const checkTimeConflict = (startDate: string, startTime: string, endDate: string, endTime: string, excludeId?: number) => {
    const start = new Date(`${startDate} ${startTime}`)
    const end = new Date(`${endDate} ${endTime}`)
    
    if (start >= end) {
      return 'Data/horário de início deve ser menor que data/horário de fim'
    }

    for (const schedule of schedules) {
      if (excludeId && schedule.id === excludeId) continue
      
      const scheduleStart = new Date(`${schedule.startDate} ${schedule.startTime}`)
      const scheduleEnd = new Date(`${schedule.endDate} ${schedule.endTime}`)
      
      if ((start < scheduleEnd && end > scheduleStart)) {
        return `Conflito com "${schedule.title}" (${schedule.startDate} ${schedule.startTime} - ${schedule.endDate} ${schedule.endTime})`
      }
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    const conflict = checkTimeConflict(
      formData.startDate, 
      formData.startTime,
      formData.endDate,
      formData.endTime,
      editingSchedule?.id
    )
    
    if (conflict) {
      setTimeConflict(conflict)
      setSaving(false)
      return
    }
    
    try {
      if (editingSchedule) {
        await apiService.updateSchedule(editingSchedule.id, formData)
      } else {
        await apiService.createSchedule(formData)
      }
      
      setIsModalOpen(false)
      setEditingSchedule(null)
      resetForm()
      loadSchedules()
    } catch (error) {
      setError('Erro ao salvar evento na agenda')
      console.error('Erro ao salvar evento na agenda:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      title: schedule.title,
      description: schedule.description,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location,
      type: schedule.type,
      maxAttendees: schedule.maxAttendees,
      host: schedule.host,
      genre: schedule.genre
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await apiService.deleteSchedule(id)
        loadSchedules()
      } catch (error) {
        setError('Erro ao excluir evento')
        console.error('Erro ao excluir evento:', error)
      }
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      await apiService.toggleScheduleStatus(id)
      loadSchedules()
    } catch (error) {
      setError('Erro ao alternar status do evento')
      console.error('Erro ao alternar status do evento:', error)
    }
  }

  const handlePreview = (schedule: Schedule) => {
    setPreviewSchedule(schedule)
    setIsPreviewOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      location: '',
      type: 'show',
      maxAttendees: 100,
      host: '',
      genre: ''
    })
    setTimeConflict(null)
    setError('')
  }

  const openCreateModal = () => {
    setEditingSchedule(null)
    resetForm()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSchedule(null)
    resetForm()
  }

  const formatDate = (date: string | undefined | null) => {
    if (!date) return 'N/A'
    try {
      const d = new Date(date)
      if (isNaN(d.getTime())) return 'N/A'
      
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2)
        month = '0' + month
      if (day.length < 2)
        day = '0' + day

      return [year, month, day].join('-')
    } catch (error) {
      return 'N/A'
    }
  }

  const formatTime = (time: string | undefined | null) => {
    if (!time) return 'N/A'
    try {
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch (error) {
      return 'N/A'
    }
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
    setPreviewSchedule(null)
  }

  return (
    <PageLayout
      title="Gestão de Programação"
      subtitle="Gerencie a programação da rádio, horários e apresentadores"
      showAddButton={true}
      onAddClick={openCreateModal}
      addButtonLabel="Novo Programa"
    >
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-12 h-12 text-metal-accent animate-spin" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">
          <AlertTriangle className="w-12 h-12 mr-2" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(schedules) && schedules.map((schedule, index) => (
            <Card
              key={schedule.id}
              delay={index * 0.1}
              hover={true}
              className="p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-metal-accent to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                    <p className="text-sm text-gray-600">{schedule.type}</p>
                  </div>
                </div>
                {schedule.isActive && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">ATIVO</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {schedule.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Data:</span>
                  <span className="font-medium">
                    {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Horário:</span>
                  <span className="font-medium">
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Local:</span>
                  <span className="font-medium">{schedule.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Apresentador:</span>
                  <span className="font-medium">{schedule.host}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Gênero:</span>
                  <span className="font-medium">{schedule.genre}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Ouvintes:</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{schedule.currentAttendees} / {schedule.maxAttendees}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleEdit(schedule)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(schedule.id)}
                  className="btn-danger flex items-center justify-center gap-2 text-sm px-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => handleToggleStatus(schedule.id)}
                  className="btn-info flex items-center justify-center gap-2 text-sm px-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {schedule.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  onClick={() => handlePreview(schedule)}
                  className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Visualizar como usuário
                </motion.button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSchedule ? 'Editar Programa' : 'Novo Programa'}
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
              <label className="form-label">Data de Início</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Data de Fim</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="form-input"
                required
              />
            </div>
            
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
            <label className="form-label">Local</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
              placeholder="Ex: Sala Principal, Auditório"
              required
            />
          </div>

          <div>
            <label className="form-label">Tipo de Evento</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'show' | 'event' | 'interview' | 'special' })}
              className="form-select"
              required
            >
              <option value="show">Show</option>
              <option value="event">Evento</option>
              <option value="interview">Entrevista</option>
              <option value="special">Especial</option>
            </select>
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
              <label className="form-label">Máximo de Ouvintes</label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || 0 })}
                className="form-input"
                placeholder="Ex: 100"
                min="1"
                max="1000"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="isActive" className="text-sm text-gray-600">
                Evento Ativo
              </label>
            </div>
          </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModal}
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
              {saving ? 'Salvando...' : (editingSchedule ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de preview */}
      <Modal isOpen={isPreviewOpen} onClose={handleClosePreview} title="Visualização do Usuário">
        {previewSchedule && (
          <div className="flex flex-col items-center p-4">
            <h2 className="text-xl font-bold mb-2">{previewSchedule.title}</h2>
            <span className="text-sm text-gray-500 mb-1">{previewSchedule.type}</span>
            <p className="mb-2 text-center">{previewSchedule.description}</p>
            <div className="flex gap-4 mb-2">
              <span><Calendar size={18}/> {formatDate(previewSchedule.startDate)} - {formatDate(previewSchedule.endDate)}</span>
              <span><Clock size={18}/> {formatTime(previewSchedule.startTime)} - {formatTime(previewSchedule.endTime)}</span>
              <span><Users size={18}/> {previewSchedule.currentAttendees} / {previewSchedule.maxAttendees} ouvintes</span>
              {previewSchedule.isActive && (
                <span className="bg-green-300 text-green-900 px-2 py-1 rounded">Ativo</span>
              )}
            </div>
            <span className="text-sm text-gray-500">Local: {previewSchedule.location}</span>
            <span className="text-sm text-gray-500">Apresentador: {previewSchedule.host}</span>
            <span className="text-sm text-gray-500">Gênero: {previewSchedule.genre}</span>
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}

export default ScheduleManagement