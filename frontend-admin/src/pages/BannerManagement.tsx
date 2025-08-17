import React, { useState, useEffect } from 'react'
import ActionButton from '../components/ui/ActionButton'
import SearchBar from '../components/ui/SearchBar'
import FilterSelect from '../components/ui/FilterSelect'
import Modal from '../components/ui/Modal'
import Card, { CardHeader, CardTitle, CardContent, CardActions } from '../components/ui/Card'
import { Plus, Edit, Trash2, Eye, Calendar, Target, BarChart3 } from 'lucide-react'
import { apiService, type Banner } from '../services/api'

interface BannerFormData {
  title: string
  image_url: string
  target_url: string
  start_at: string
  end_at: string
  priority: number
  locations: string[]
  active: boolean
}

const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([])
  const [filteredBanners, setFilteredBanners] = useState<Banner[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')

  const [formData, setFormData] = useState<BannerFormData>({
    title: '',
    image_url: '',
    target_url: '',
    start_at: '',
    end_at: '',
    priority: 1,
    locations: ['hero'],
    active: true
  })

  const locationOptions = [
    { value: 'hero', label: 'Hero (Topo)' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'footer', label: 'Footer' },
    { value: 'content', label: 'Conteúdo' }
  ]

  const priorityOptions = [
    { value: 1, label: 'Baixa (1)' },
    { value: 5, label: 'Média (5)' },
    { value: 10, label: 'Alta (10)' }
  ]

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    filterBanners()
  }, [banners, searchTerm, statusFilter, locationFilter])

  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getBanners()
      setBanners(response || [])
    } catch (error) {
      console.error('Erro ao buscar banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterBanners = () => {
    let filtered = banners

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(banner =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.image_url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(banner =>
        statusFilter === 'active' ? banner.active : !banner.active
      )
    }

    // Filtro por localização
    if (locationFilter !== 'all') {
      filtered = filtered.filter(banner => {
        const locations = JSON.parse(banner.locations)
        return locations.includes(locationFilter)
      })
    }

    setFilteredBanners(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBanner) {
        await apiService.updateBanner(editingBanner.id, formData)
      } else {
        await apiService.createBanner(formData)
      }
      
      setIsModalOpen(false)
      setEditingBanner(null)
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      image_url: banner.image_url,
      target_url: banner.target_url || '',
      start_at: banner.start_at.split('T')[0],
      end_at: banner.end_at.split('T')[0],
      priority: banner.priority,
      locations: JSON.parse(banner.locations),
      active: banner.active
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este banner?')) {
      try {
        await apiService.deleteBanner(id)
        fetchBanners()
      } catch (error) {
        console.error('Erro ao deletar banner:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      target_url: '',
      start_at: '',
      end_at: '',
      priority: 1,
      locations: ['hero'],
      active: true
    })
  }

  const openCreateModal = () => {
    setEditingBanner(null)
    resetForm()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
    resetForm()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (active: boolean) => {
    return active ? 'text-green-600' : 'text-red-600'
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600'
    if (priority >= 5) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando banners...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Banners</h1>
        <ActionButton onClick={openCreateModal} icon={Plus}>
          Novo Banner
        </ActionButton>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SearchBar
          placeholder="Buscar por título ou URL..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Todos os status' },
            { value: 'active', label: 'Ativos' },
            { value: 'inactive', label: 'Inativos' }
          ]}
        />
        <FilterSelect
          value={locationFilter}
          onChange={setLocationFilter}
          options={[
            { value: 'all', label: 'Todas as localizações' },
            { value: 'hero', label: 'Hero' },
            { value: 'sidebar', label: 'Sidebar' },
            { value: 'footer', label: 'Footer' },
            { value: 'content', label: 'Conteúdo' }
          ]}
        />
      </div>

      {/* Lista de Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanners.map((banner) => (
          <Card key={banner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
                <div className="flex space-x-2">
                  <ActionButton
                    onClick={() => handleEdit(banner)}
                    variant="secondary"
                    icon={Edit}
                  />
                  <ActionButton
                    onClick={() => handleDelete(banner.id)}
                    variant="danger"
                    icon={Trash2}
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Imagem */}
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://via.placeholder.com/400x225?text=Imagem+não+encontrada'
                  }}
                />
              </div>

              {/* Informações */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(banner.start_at)} - {formatDate(banner.end_at)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Target className="w-4 h-4" />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {JSON.parse(banner.locations).join(', ')}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className={getPriorityColor(banner.priority)}>
                    Prioridade: {banner.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={getStatusColor(banner.active)}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-gray-500">
                    {banner.impressions} impressões, {banner.clicks} cliques
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum banner encontrado</p>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingBanner ? 'Editar Banner' : 'Novo Banner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título do banner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL da Imagem *
            </label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de Destino
            </label>
            <input
              type="url"
              value={formData.target_url}
              onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://exemplo.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                required
                value={formData.start_at}
                onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim *
              </label>
              <input
                type="date"
                required
                value={formData.end_at}
                onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localizações *
            </label>
            <div className="space-y-2">
              {locationOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.locations.includes(option.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          locations: [...formData.locations, option.value]
                        })
                      } else {
                        setFormData({
                          ...formData,
                          locations: formData.locations.filter(loc => loc !== option.value)
                        })
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingBanner ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default BannerManagement
