import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Star, Users, Save, X } from 'lucide-react'
import { useState } from 'react'

interface Band {
  id: number
  name: string
  genre: string
  description: string
  listeners: number
  image: string
  featured: boolean
  rating: number
}

const BandsManagement = () => {
  const [bands, setBands] = useState<Band[]>([
    {
      id: 1,
      name: 'Sleep Token',
      genre: 'Alternative Metal',
      description: 'Misturando metal progressivo com elementos eletrônicos e vocais únicos.',
      listeners: 15420,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      featured: true,
      rating: 5
    },
    {
      id: 2,
      name: 'Spiritbox',
      genre: 'Progressive Metal',
      description: 'Metal progressivo com influências de djent e metalcore.',
      listeners: 12850,
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
      featured: true,
      rating: 4
    },
    {
      id: 3,
      name: 'Bad Omens',
      genre: 'Metalcore',
      description: 'Metalcore moderno com elementos eletrônicos e vocais melódicos.',
      listeners: 11230,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      featured: false,
      rating: 4
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingBand, setEditingBand] = useState<Band | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    listeners: 0,
    image: '',
    featured: false
  })

  const handleAddBand = () => {
    setEditingBand(null)
    setFormData({
      name: '',
      genre: '',
      description: '',
      listeners: 0,
      image: '',
      featured: false
    })
    setShowModal(true)
  }

  const handleEditBand = (band: Band) => {
    setEditingBand(band)
    setFormData({
      name: band.name,
      genre: band.genre,
      description: band.description,
      listeners: band.listeners,
      image: band.image,
      featured: band.featured
    })
    setShowModal(true)
  }

  const handleDeleteBand = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta banda?')) {
      setBands(bands.filter(band => band.id !== id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sanitização básica contra XSS
    const sanitizedData = {
      ...formData,
      name: formData.name.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
      description: formData.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }

    if (editingBand) {
      // Editar banda existente
      setBands(bands.map(band => 
        band.id === editingBand.id 
          ? { ...band, ...sanitizedData }
          : band
      ))
    } else {
      // Adicionar nova banda
      const newBand: Band = {
        id: Date.now(),
        ...sanitizedData,
        rating: Math.floor(Math.random() * 5) + 1
      }
      setBands([...bands, newBand])
    }
    
    setShowModal(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
      />
    ))
  }

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
          <h1 className="text-3xl font-bold text-white">Gestão de Bandas</h1>
          <p className="text-gray-400">Gerencie as bandas em destaque</p>
        </div>
        <button
          onClick={handleAddBand}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Adicionar Banda
        </button>
      </motion.div>

      {/* Lista de Bandas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {bands.map((band, index) => (
          <motion.div
            key={band.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all duration-300"
          >
            {/* Imagem da Banda */}
            <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800">
              <img
                src={band.image}
                alt={band.name}
                className="w-full h-full object-cover"
              />
              {band.featured && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  DESTAQUE
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-1">
                {renderStars(band.rating)}
              </div>
            </div>

            {/* Informações da Banda */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{band.name}</h3>
                  <p className="text-orange-400 text-sm font-medium">{band.genre}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />
                  {band.listeners.toLocaleString()}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{band.description}</p>

              {/* Ações */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditBand(band)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 py-2 rounded-lg transition-all duration-300"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteBand(band.id)}
                  className="flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 p-2 rounded-lg transition-all duration-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal para Adicionar/Editar Banda */}
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
                {editingBand ? 'Editar Banda' : 'Adicionar Nova Banda'}
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
                  Nome da Banda
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Digite o nome da banda"
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
                  placeholder="Ex: Alternative Metal"
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
                  placeholder="Descreva a banda..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Ouvintes
                </label>
                <input
                  type="number"
                  value={formData.listeners}
                  onChange={(e) => setFormData({ ...formData, listeners: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-orange-500 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                  Marcar como DESTAQUE
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
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingBand ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default BandsManagement 