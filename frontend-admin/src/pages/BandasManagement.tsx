import React, { useState, useEffect } from 'react'
import ActionButton from '../components/ui/ActionButton'
import SearchBar from '../components/ui/SearchBar'
import FilterSelect from '../components/ui/FilterSelect'
import Modal from '../components/ui/Modal'
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Plus, Edit, Trash2, Music, Star, ExternalLink, Eye } from 'lucide-react'
import { apiService } from '../services/api'

interface Banda {
  id: number
  name: string
  slug: string
  description: string
  official_url: string
  image_url: string
  genre_tags: string
  featured: boolean
  created_at: string
  updated_at: string
}

interface BandaFormData {
  name: string
  slug: string
  description: string
  official_url: string
  image_url: string
  genre_tags: string
  featured: boolean
}

const BandasManagement: React.FC = () => {
  const [bandas, setBandas] = useState<Banda[]>([])
  const [filteredBandas, setFilteredBandas] = useState<Banda[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [featuredFilter, setFeaturedFilter] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingBanda, setEditingBanda] = useState<Banda | null>(null)
  const [formData, setFormData] = useState<BandaFormData>({
    name: '',
    slug: '',
    description: '',
    official_url: '',
    image_url: '',
    genre_tags: '[]',
    featured: false
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Buscar bandas
  const fetchBandas = async (page = 1, limit = 10) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (featuredFilter !== 'all') {
        params.append('featured', featuredFilter === 'featured' ? '1' : '0')
      }

      const response = await apiService.getBands()
      setBandas(response)
      setPagination({
        page: page,
        limit: limit,
        total: response.length,
        pages: Math.ceil(response.length / limit)
      })
    } catch (error) {
      console.error('Erro ao buscar bandas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar bandas
  const filterBandas = () => {
    let filtered = bandas

    if (searchTerm) {
      filtered = filtered.filter(banda =>
        banda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banda.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBandas(filtered)
  }

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens'
    }

    if (formData.image_url && !formData.image_url.startsWith('https://')) {
      newErrors.image_url = 'URL da imagem deve usar HTTPS'
    }

    if (formData.official_url && !formData.official_url.startsWith('https://')) {
      newErrors.official_url = 'URL oficial deve usar HTTPS'
    }

    // Validar se genre_tags é um JSON válido
    if (formData.genre_tags.trim()) {
      try {
        const parsed = JSON.parse(formData.genre_tags)
        if (!Array.isArray(parsed)) {
          newErrors.genre_tags = 'Tags devem ser um array JSON válido'
        }
      } catch (error) {
        newErrors.genre_tags = 'Formato JSON inválido para as tags'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Preview da imagem
  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, image_url: url }))
    if (url && url.startsWith('https://')) {
      setImagePreview(url)
    } else {
      setImagePreview('')
    }
  }

  // Abrir modal de criação
  const openCreateModal = () => {
    setEditingBanda(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      official_url: '',
      image_url: '',
      genre_tags: '[]',
      featured: false
    })
    setImagePreview('')
    setErrors({})
    setShowModal(true)
  }

  // Abrir modal de edição
  const openEditModal = (banda: Banda) => {
    setEditingBanda(banda)
    setFormData({
      name: banda.name,
      slug: banda.slug,
      description: banda.description || '',
      official_url: banda.official_url || '',
      image_url: banda.image_url || '',
      genre_tags: banda.genre_tags || '[]',
      featured: banda.featured
    })
    setImagePreview(banda.image_url || '')
    setErrors({})
    setShowModal(true)
  }

  // Fechar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingBanda(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      official_url: '',
      image_url: '',
      genre_tags: '[]',
      featured: false
    })
    setImagePreview('')
    setErrors({})
  }

  // Salvar banda
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        // Garantir que genre_tags seja sempre um array JSON válido
        genre_tags: formData.genre_tags.trim() || '[]'
      }

      if (editingBanda) {
        // Atualizar banda existente
        await apiService.updateBand(editingBanda.id, dataToSend)
      } else {
        // Criar nova banda
        await apiService.createBand(dataToSend)
      }
      
      closeModal()
      fetchBandas(pagination.page, pagination.limit)
    } catch (error: any) {
      console.error('Erro ao salvar banda:', error)
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error })
      }
    }
  }

  // Excluir banda
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta banda?')) return

    try {
      await apiService.deleteBand(id)
      fetchBandas(pagination.page, pagination.limit)
    } catch (error) {
      console.error('Erro ao excluir banda:', error)
    }
  }

  // Gerar slug automático
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Formatar tags de gênero
  const formatGenreTags = (tags: string) => {
    if (!tags.trim()) return '[]'
    
    try {
      // Se já é um JSON válido, retornar como está
      const parsed = JSON.parse(tags)
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed, null, 2)
      }
    } catch (error) {
      // Se não é JSON válido, tentar converter de texto simples
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      
      if (tagList.length > 0) {
        return JSON.stringify(tagList)
      }
    }
    
    return '[]'
  }

  // Efeitos
  useEffect(() => {
    fetchBandas()
  }, [featuredFilter])

  useEffect(() => {
    filterBandas()
  }, [bandas, searchTerm])

  // Renderizar formulário
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="status-error">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna do Formulário */}
        <div className="lg:col-span-2 space-y-6">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Banda *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }))
              if (!formData.slug) {
                setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
              }
            }}
            className={`form-input w-full ${errors.name ? 'border-metal-red' : ''}`}
            placeholder="Ex: Sleep Token"
          />
          {errors.name && <p className="text-metal-red text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            className={`form-input w-full ${errors.slug ? 'border-metal-red' : ''}`}
            placeholder="Ex: sleep-token"
          />
          {errors.slug && <p className="text-metal-red text-sm mt-1">{errors.slug}</p>}
        </div>

        {/* URL Oficial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Oficial
          </label>
          <input
            type="url"
            value={formData.official_url}
            onChange={(e) => setFormData(prev => ({ ...prev, official_url: e.target.value }))}
            className={`form-input w-full ${errors.official_url ? 'border-metal-red' : ''}`}
            placeholder="https://sleeptoken.com"
          />
          {errors.official_url && <p className="text-metal-red text-sm mt-1">{errors.official_url}</p>}
        </div>

        {/* URL da Imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL da Imagem
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className={`form-input w-full ${errors.image_url ? 'border-metal-red' : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image_url && <p className="text-metal-red text-sm mt-1">{errors.image_url}</p>}
        </div>

        {/* Tags de Gênero */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags de Gênero (JSON)
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={formData.genre_tags}
              onChange={(e) => setFormData(prev => ({ ...prev, genre_tags: e.target.value }))}
              className={`form-input flex-1 ${errors.genre_tags ? 'border-metal-red' : ''}`}
              placeholder='["metal alternativo", "metalcore", "djent"]'
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, genre_tags: formatGenreTags(prev.genre_tags) }))}
              className="px-3 py-2 text-xs bg-metal-accent/10 text-metal-accent border border-metal-accent/20 rounded hover:bg-metal-accent/20 transition-colors"
              title="Formatar tags automaticamente"
            >
              Formatar
            </button>
          </div>
          {errors.genre_tags && <p className="text-metal-red text-sm mt-1">{errors.genre_tags}</p>}
          <p className="text-gray-500 text-xs mt-1">
            Formato: array JSON de strings (ex: ["metal alternativo", "metalcore"]) ou texto simples separado por vírgulas
          </p>
        </div>

        {/* Destaque */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 text-metal-accent bg-metal-card border-metal-border rounded focus:ring-metal-accent"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">
            Banda em Destaque
          </label>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="form-textarea w-full"
            rows={4}
            placeholder="Descreva a banda, seu estilo musical, história..."
          />
        </div>

        {/* Ações */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {editingBanda ? 'Atualizar' : 'Criar'} Banda
          </button>
        </div>
      </div>

        {/* Painel de Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview ao Vivo
              </h3>
              
              {/* Preview do Card da Banda */}
                              <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                {/* Imagem */}
                                  <div className="w-full h-32 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden mb-3">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt={formData.name || 'Preview da banda'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${formData.image_url ? 'hidden' : ''}`}>
                    <Music className="w-12 h-12 text-gray-400" />
                  </div>
                </div>

                {/* Nome da Banda */}
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {formData.name || 'Nome da Banda'}
                </h4>

                {/* Descrição */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {formData.description || 'Descrição da banda aparecerá aqui...'}
                </p>

                {/* Tags de Gênero */}
                {formData.genre_tags && formData.genre_tags !== '[]' && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(() => {
                      try {
                        const tags = JSON.parse(formData.genre_tags)
                        return Array.isArray(tags) ? tags.slice(0, 3).map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-metal-accent/10 text-metal-accent text-xs rounded-full border border-metal-accent/20"
                          >
                            {tag}
                          </span>
                        )) : null
                      } catch (error) {
                        return null
                      }
                    })()}
                  </div>
                )}

                {/* Status de Destaque */}
                {formData.featured && (
                  <div className="flex items-center gap-2 text-metal-accent text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>Em Destaque</span>
                  </div>
                )}

                {/* Slug */}
                <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                  <span className="font-medium">Slug:</span> {formData.slug || 'slug-da-banda'}
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-metal-accent rounded-full"></span>
                  <span>Preview em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-metal-accent rounded-full"></span>
                  <span>Atualiza conforme você digita</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )

  // Renderizar lista de bandas
  const renderBandasList = () => (
    <div className="space-y-4">
      {filteredBandas.map((banda) => (
        <Card key={banda.id} className="hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Imagem da banda */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                  {banda.image_url ? (
                    <img
                      src={banda.image_url}
                      alt={banda.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center ${banda.image_url ? 'hidden' : ''}`}>
                    <Music className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Informações da banda */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {banda.name}
                </h3>
                  {banda.featured && (
                    <Star className="w-5 h-5 text-metal-accent fill-current" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {banda.description || 'Sem descrição'}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-metal-accent rounded-full"></span>
                    <span>{banda.slug}</span>
                  </span>
                  
                  {banda.official_url && (
                    <a
                      href={banda.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 hover:text-metal-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Site Oficial</span>
                    </a>
                  )}
                </div>

                {banda.genre_tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const tags = JSON.parse(banda.genre_tags)
                        return Array.isArray(tags) ? tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-metal-accent/10 text-metal-accent text-xs rounded-full border border-metal-accent/20"
                          >
                            {tag}
                          </span>
                        )) : null
                      } catch (error) {
                        return null
                      }
                    })()}
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex-shrink-0 flex space-x-2">
                <ActionButton
                  variant="secondary"
                  onClick={() => openEditModal(banda)}
                  icon={Edit}
                  label="Editar"
                />
                <ActionButton
                  variant="danger"
                  onClick={() => handleDelete(banda.id)}
                  icon={Trash2}
                  label="Excluir"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Bandas</h1>
            <p className="text-sm text-gray-600">
              Gerencie as bandas da cena metal no sistema
            </p>
          </div>
          <ActionButton
            onClick={openCreateModal}
            icon={Plus}
            variant="primary"
            label="Nova Banda"
          />
        </div>

        {/* Filtros e Busca */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SearchBar
                placeholder="Buscar por nome ou slug..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
              <FilterSelect
                value={featuredFilter}
                onChange={setFeaturedFilter}
                options={[
                  { value: 'all', label: 'Todas as bandas' },
                  { value: 'featured', label: 'Em destaque' },
                  { value: 'not-featured', label: 'Não destacadas' }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Bandas */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Music className="w-6 h-6" />
              <span className="text-xl font-semibold text-gray-900">Bandas ({filteredBandas.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metal-accent"></div>
              </div>
            ) : filteredBandas.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhuma banda encontrada
                </h3>
                <p className="text-sm text-gray-500">
                  {searchTerm || featuredFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira banda'
                  }
                </p>
              </div>
            ) : (
              renderBandasList()
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {pagination.pages > 1 && (
          <Card className="card-base">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Página {pagination.page} de {pagination.pages} • 
                  Total: {pagination.total} bandas
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchBandas(pagination.page - 1, pagination.limit)}
                    disabled={pagination.page <= 1}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => fetchBandas(pagination.page + 1, pagination.limit)}
                    disabled={pagination.page >= pagination.pages}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de Formulário */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingBanda ? 'Editar Banda' : 'Nova Banda'}
        size="lg"
      >
        {renderForm()}
      </Modal>
    </div>
  )
}

export default BandasManagement
