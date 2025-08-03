import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoveUp, 
  MoveDown,
  Image as ImageIcon,
  Video,
  Upload,
  X,
  Save,
  Loader2
} from 'lucide-react'
import { apiService, CarouselSlide } from '../services/api'



const CarouselManagement = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    type: 'image' as 'image' | 'video',
    isActive: true
  })
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  // Carregar slides da API
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const slidesData = await apiService.getCarouselSlides()
        setSlides(slidesData)
      } catch (error) {
        console.error('Erro ao carregar slides:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSlides()
  }, [])

  const handleAddSlide = () => {
    setEditingSlide(null)
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      videoUrl: '',
      type: 'image',
      isActive: true
    })
    setPreviewUrl('')
    setShowModal(true)
  }

  const handleEditSlide = (slide: CarouselSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      videoUrl: slide.videoUrl || '',
      type: slide.type,
      isActive: slide.isActive
    })
    setPreviewUrl(slide.type === 'image' ? slide.imageUrl : slide.videoUrl || '')
    setShowModal(true)
  }

  const handleDeleteSlide = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este slide?')) {
      try {
        await apiService.deleteCarouselSlide(id)
        setSlides(slides.filter(slide => slide.id !== id))
      } catch (error) {
        console.error('Erro ao excluir slide:', error)
      }
    }
  }

  const handleToggleStatus = async (id: number) => {
    try {
      const updatedSlide = await apiService.toggleCarouselSlideStatus(id)
      setSlides(slides.map(slide => 
        slide.id === id ? updatedSlide : slide
      ))
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  const handleMoveSlide = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(slide => slide.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return

    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(currentIndex, 1)
    newSlides.splice(newIndex, 0, movedSlide)

    // Atualizar ordem
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }))

    try {
      const slideIds = updatedSlides.map(slide => slide.id)
      const reorderedSlides = await apiService.reorderCarouselSlides(slideIds)
      setSlides(reorderedSlides)
    } catch (error) {
      console.error('Erro ao reordenar slide:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      if (editingSlide) {
        const updatedSlide = await apiService.updateCarouselSlide(editingSlide.id, formData)
        setSlides(slides.map(slide => 
          slide.id === editingSlide.id ? updatedSlide : slide
        ))
      } else {
        const newSlide = await apiService.createCarouselSlide(formData)
        setSlides([...slides, newSlide])
      }

      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        imageUrl: '',
        videoUrl: '',
        type: 'image',
        isActive: true
      })
      setPreviewUrl('')
    } catch (error) {
      console.error('Erro ao salvar slide:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      // TODO: Implementar upload real
      const fakeUrl = URL.createObjectURL(file)
      if (formData.type === 'image') {
        setFormData({ ...formData, imageUrl: fakeUrl })
        setPreviewUrl(fakeUrl)
      } else {
        setFormData({ ...formData, videoUrl: fakeUrl })
        setPreviewUrl(fakeUrl)
      }
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-metal-orange" />
      </div>
    )
  }

  return (
    <div className="p-6">
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
              Gestão do Carrossel
            </h1>
            <p className="text-metal-text-secondary">
              Gerencie os slides do carrossel principal do site
            </p>
          </div>
          <motion.button
            onClick={handleAddSlide}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Adicionar Slide
          </motion.button>
        </div>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div 
          className="bg-metal-card p-6 rounded-lg border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-metal-orange/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-metal-orange" />
            </div>
            <div>
              <p className="text-2xl font-bold text-metal-text">
                {slides.length}
              </p>
              <p className="text-sm text-metal-text-secondary">Total de Slides</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-metal-card p-6 rounded-lg border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-metal-text">
                {slides.filter(s => s.isActive).length}
              </p>
              <p className="text-sm text-metal-text-secondary">Ativos</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-metal-card p-6 rounded-lg border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-metal-text">
                {slides.filter(s => s.type === 'image').length}
              </p>
              <p className="text-sm text-metal-text-secondary">Imagens</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-metal-card p-6 rounded-lg border border-metal-light-gray/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-metal-text">
                {slides.filter(s => s.type === 'video').length}
              </p>
              <p className="text-sm text-metal-text-secondary">Vídeos</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Slides List */}
      <div className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden">
        <div className="p-6 border-b border-metal-light-gray/20">
          <h2 className="text-xl font-semibold text-metal-text">
            Slides do Carrossel
          </h2>
        </div>

        <div className="divide-y divide-metal-light-gray/20">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="p-6 hover:bg-metal-gray/30 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-metal-gray flex-shrink-0">
                  {slide.type === 'video' ? (
                    <video
                      src={slide.videoUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-metal-text truncate">
                      {slide.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {slide.type === 'video' ? (
                        <Video className="w-4 h-4 text-purple-500" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-blue-500" />
                      )}
                      {slide.isActive ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-metal-text-secondary text-sm mb-2">
                    {slide.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-metal-text-secondary">
                    <span>Ordem: {slide.order}</span>
                    <span>•</span>
                    <span>
                      {new Date(slide.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleMoveSlide(slide.id, 'up')}
                    disabled={index === 0}
                    className="p-2 text-metal-text-secondary hover:text-metal-orange disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoveUp className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleMoveSlide(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                    className="p-2 text-metal-text-secondary hover:text-metal-orange disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoveDown className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleToggleStatus(slide.id)}
                    className="p-2 text-metal-text-secondary hover:text-metal-orange"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {slide.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => handleEditSlide(slide)}
                    className="p-2 text-metal-text-secondary hover:text-metal-orange"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 text-metal-text-secondary hover:text-red-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {slides.length === 0 && (
          <div className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-metal-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-metal-text mb-2">
              Nenhum slide encontrado
            </h3>
            <p className="text-metal-text-secondary mb-4">
              Comece adicionando o primeiro slide do carrossel
            </p>
            <motion.button
              onClick={handleAddSlide}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Slide
            </motion.button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-metal-card rounded-lg border border-metal-light-gray/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-metal-light-gray/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-metal-text">
                    {editingSlide ? 'Editar Slide' : 'Adicionar Slide'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-metal-text-secondary hover:text-metal-orange"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-metal-text mb-2">
                    Tipo de Mídia
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="image"
                        checked={formData.type === 'image'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                        className="text-metal-orange"
                      />
                      <ImageIcon className="w-4 h-4" />
                      <span>Imagem</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="video"
                        checked={formData.type === 'video'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                        className="text-metal-orange"
                      />
                      <Video className="w-4 h-4" />
                      <span>Vídeo</span>
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-metal-text mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:border-metal-orange"
                    placeholder="Ex: MORDEN METAL"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-metal-text mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:border-metal-orange resize-none"
                    rows={3}
                    placeholder="Descrição do slide..."
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-metal-text mb-2">
                    {formData.type === 'image' ? 'Imagem' : 'Vídeo'} *
                  </label>
                  
                  {/* URL Input */}
                  <input
                    type="url"
                    value={formData.type === 'image' ? formData.imageUrl : formData.videoUrl}
                    onChange={(e) => {
                      if (formData.type === 'image') {
                        setFormData({ ...formData, imageUrl: e.target.value })
                        setPreviewUrl(e.target.value)
                      } else {
                        setFormData({ ...formData, videoUrl: e.target.value })
                        setPreviewUrl(e.target.value)
                      }
                    }}
                    className="w-full px-4 py-3 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:border-metal-orange mb-3"
                    placeholder={`URL da ${formData.type === 'image' ? 'imagem' : 'vídeo'}...`}
                    required
                  />

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-metal-light-gray/20 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-metal-text-secondary mx-auto mb-2" />
                    <p className="text-metal-text-secondary mb-2">
                      Ou arraste e solte um arquivo aqui
                    </p>
                    <input
                      type="file"
                      accept={formData.type === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file)
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-secondary cursor-pointer"
                    >
                      Escolher Arquivo
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div>
                    <label className="block text-sm font-medium text-metal-text mb-2">
                      Preview
                    </label>
                    <div className="w-full h-48 rounded-lg overflow-hidden bg-metal-gray">
                      {formData.type === 'video' ? (
                        <video
                          src={previewUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="text-metal-orange"
                  />
                  <label htmlFor="isActive" className="text-sm text-metal-text">
                    Slide ativo
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <motion.button
                    type="submit"
                    disabled={uploading}
                    className="btn-primary flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {editingSlide ? 'Atualizar' : 'Adicionar'} Slide
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CarouselManagement 