import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Users, Music, Save, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type Band } from '@/services/api'

const BandsManagement = () => {
  const [bands, setBands] = useState<Band[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    listeners: '',
    rating: 0,
    isFeatured: false,
    image: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBand) {
        await apiService.updateBand(editingBand.id, formData)
      } else {
        await apiService.createBand(formData)
      }
      
      await loadBands() // Recarregar dados
      setIsModalOpen(false)
      setEditingBand(null)
      setFormData({
        name: '',
        genre: '',
        description: '',
        listeners: '',
        rating: 0,
        isFeatured: false,
        image: ''
      })
    } catch (error) {
      console.error('Erro ao salvar banda:', error)
      setError('Erro ao salvar banda')
    }
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
        await loadBands() // Recarregar dados
      } catch (error) {
        console.error('Erro ao deletar banda:', error)
        setError('Erro ao deletar banda')
      }
    }
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
                Gestão de Bandas
              </h1>
              <p className="text-metal-text-secondary">
                Gerencie as bandas em destaque do site
              </p>
            </div>
            <motion.button
              className="btn-primary flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Adicionar Banda
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="mb-6 p-4 bg-metal-red/20 border border-metal-red/30 rounded-lg text-metal-red"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex items-center justify-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-metal-orange border-t-transparent rounded-full animate-spin"></div>
              <span className="text-metal-text-secondary">Carregando bandas...</span>
            </div>
          </motion.div>
        )}

        {/* Bands Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bands.map((band, index) => (
            <motion.div
              key={band.id}
              className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Band Image */}
              <div className="relative h-48">
                <img
                  src={band.image}
                  alt={band.name}
                  className="w-full h-full object-cover"
                />
                {band.isFeatured && (
                  <div className="absolute top-4 left-4">
                    <div className="featured-badge text-white px-3 py-1 rounded-full text-xs font-bold">
                      DESTAQUE
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    className="w-8 h-8 bg-metal-card/80 rounded-full flex items-center justify-center hover:bg-metal-orange/20 transition-colors"
                    onClick={() => handleEdit(band)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="w-8 h-8 bg-metal-card/80 rounded-full flex items-center justify-center hover:bg-metal-red/20 transition-colors"
                    onClick={() => handleDelete(band.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4 text-metal-red" />
                  </motion.button>
                </div>
              </div>

              {/* Band Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold">{band.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{band.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Music className="w-4 h-4 text-metal-orange" />
                  <span className="text-sm text-metal-orange font-medium">{band.genre}</span>
                </div>

                <p className="text-metal-text-secondary text-sm mb-4 leading-relaxed">
                  {band.description}
                </p>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-metal-text-secondary" />
                  <span className="text-sm text-metal-text-secondary">
                    {band.listeners} ouvintes
                  </span>
                                 </div>
               </div>
             </motion.div>
           ))}
           </div>
         )}

        {/* Modal */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-metal-card rounded-lg p-6 w-full max-w-md mx-4 border border-metal-light-gray/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingBand ? 'Editar Banda' : 'Adicionar Banda'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingBand(null)
                    setFormData({
                      name: '',
                      genre: '',
                      description: '',
                      listeners: '',
                      rating: 0,
                      isFeatured: false,
                      image: ''
                    })
                  }}
                  className="text-metal-text-secondary hover:text-metal-orange"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Banda</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    required
                    maxLength={100}
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ouvintes</label>
                    <input
                      type="text"
                      value={formData.listeners}
                      onChange={(e) => setFormData({...formData, listeners: e.target.value})}
                      className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                      placeholder="15.2k"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Avaliação</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full bg-metal-gray border border-metal-light-gray/30 rounded-lg px-4 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-4 h-4 text-metal-orange bg-metal-gray border-metal-light-gray/30 rounded focus:ring-metal-orange"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium">
                    Marcar como DESTAQUE
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="submit"
                    className="btn-primary flex items-center gap-2 flex-1 justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-4 h-4" />
                    {editingBand ? 'Atualizar' : 'Adicionar'}
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

export default BandsManagement 