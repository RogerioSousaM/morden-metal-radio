import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Users, Music, Save, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type Band } from '@/services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const BandsManagement = () => {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    listeners: '',
    rating: 0,
    isFeatured: false,
    image: ''
  })

  useEffect(() => {
    loadBands()
  }, [])

  const loadBands = async () => {
    try {
      setLoading(true)
      const data = await apiService.getBands()
      setBands(data)
    } catch (error) {
      setError('Erro ao carregar bandas')
      console.error('Erro ao carregar bandas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingBand) {
        await apiService.updateBand(editingBand.id, formData)
      } else {
        await apiService.createBand(formData)
      }
      
      await loadBands()
      setIsModalOpen(false)
      setEditingBand(null)
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar banda:', error)
      setError('Erro ao salvar banda')
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      genre: '',
      description: '',
      listeners: '',
      rating: 0,
      isFeatured: false,
      image: ''
    })
  }

  const handleEdit = (band: Band) => {
    setEditingBand(band)
    setFormData(band)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta banda?')) {
      try {
        await apiService.deleteBand(id)
        await loadBands()
      } catch (error) {
        console.error('Erro ao deletar banda:', error)
        setError('Erro ao deletar banda')
      }
    }
  }

  const handleAddNew = () => {
    setEditingBand(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBand(null)
    resetForm()
  }

  return (
    <PageLayout
      title="Gestão de Bandas"
      subtitle="Gerencie as bandas da rádio, adicione novas bandas e configure informações"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Nova Banda"
      loading={loading}
    >
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border bg-red-500/10 border-red-500/30 text-red-400"
          >
            <div className="flex items-center gap-2">
              <X className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bands.map((band, index) => (
          <Card
            key={band.id}
            delay={index * 0.1}
            hover={true}
            className="p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-metal-orange to-orange-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-metal-text">{band.name}</h3>
                  <p className="text-sm text-metal-text-secondary">{band.genre}</p>
                </div>
              </div>
              {band.isFeatured && (
                <Star className="w-5 h-5 text-metal-orange fill-current" />
              )}
            </div>

            <p className="text-sm text-metal-text-secondary mb-4 line-clamp-2">
              {band.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-metal-text-secondary">
                <Users className="w-4 h-4" />
                <span>{band.listeners} ouvintes</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < band.rating 
                        ? 'text-metal-orange fill-current' 
                        : 'text-metal-text-secondary'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => handleEdit(band)}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Edit className="w-4 h-4" />
                Editar
              </motion.button>
              <motion.button
                onClick={() => handleDelete(band.id)}
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
        title={editingBand ? 'Editar Banda' : 'Nova Banda'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nome da Banda</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                placeholder="Digite o nome da banda"
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

          <div>
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="Descreva a banda..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Ouvintes</label>
              <input
                type="text"
                value={formData.listeners}
                onChange={(e) => setFormData({ ...formData, listeners: e.target.value })}
                className="form-input"
                placeholder="Ex: 1.2M"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Avaliação (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="form-input"
                required
              />
            </div>
            
            <div>
              <label className="form-label">URL da Imagem</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="form-input"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="form-checkbox"
            />
            <label htmlFor="isFeatured" className="text-sm text-metal-text-secondary">
              Banda em Destaque
            </label>
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
              {saving ? 'Salvando...' : (editingBand ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default BandsManagement 