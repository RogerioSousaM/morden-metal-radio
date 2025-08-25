import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Music, 
  Star, 
  ExternalLink, 
  Eye,
  Search,
  Filter
} from 'lucide-react'

interface Banda {
  id: string
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
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFeatured, setFilterFeatured] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBanda, setEditingBanda] = useState<Banda | null>(null)

  // Mock data - replace with API call
  useEffect(() => {
    const loadBandas = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setBandas([
        {
          id: '1',
          name: 'Sepultura',
          slug: 'sepultura',
          description: 'Uma das bandas mais importantes do metal brasileiro',
          official_url: 'https://sepultura.com.br',
          image_url: 'https://example.com/sepultura.jpg',
          genre_tags: 'Thrash Metal, Groove Metal',
          featured: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Angra',
          slug: 'angra',
          description: 'Power metal progressivo brasileiro de excelência',
          official_url: 'https://angra.net',
          image_url: 'https://example.com/angra.jpg',
          genre_tags: 'Power Metal, Progressive Metal',
          featured: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        },
        {
          id: '3',
          name: 'Krisiun',
          slug: 'krisiun',
          description: 'Death metal brutal do Rio Grande do Sul',
          official_url: 'https://krisiun.com.br',
          image_url: 'https://example.com/krisiun.jpg',
          genre_tags: 'Death Metal, Brutal Death Metal',
          featured: false,
          created_at: '2024-01-01',
          updated_at: '2024-01-01'
        }
      ])
      setIsLoading(false)
    }

    loadBandas()
  }, [])

  const filteredBandas = bandas.filter(banda => {
    const matchesSearch = banda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banda.genre_tags.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFeatured = filterFeatured === 'all' || 
                           (filterFeatured === 'featured' && banda.featured) ||
                           (filterFeatured === 'not-featured' && !banda.featured)
    
    return matchesSearch && matchesFeatured
  })

  const handleAddBanda = () => {
    setShowAddModal(true)
    setEditingBanda(null)
  }

  const handleEditBanda = (banda: Banda) => {
    setEditingBanda(banda)
    setShowAddModal(true)
  }

  const handleDeleteBanda = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta banda?')) {
      setBandas(bandas.filter(b => b.id !== id))
    }
  }

  const handleSaveBanda = (bandaData: Omit<Banda, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingBanda) {
      // Update existing banda
      setBandas(bandas.map(b => 
        b.id === editingBanda.id 
          ? { 
              ...bandaData, 
              id: editingBanda.id,
              created_at: editingBanda.created_at,
              updated_at: new Date().toISOString().split('T')[0]
            }
          : b
      ))
    } else {
      // Add new banda
      const newBanda = {
        ...bandaData,
        id: Date.now().toString(),
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      setBandas([...bandas, newBanda])
    }
    
    setShowAddModal(false)
    setEditingBanda(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Gerenciar Bandas da Cena</h1>
          <p className="text-muted">Cadastre e gerencie as bandas em destaque da rádio</p>
        </div>
        <button
          onClick={handleAddBanda}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Adicionar Banda
        </button>
      </div>

      {/* Extra spacing after header */}
      <div className="h-8"></div>

      {/* Search and Filters */}
      <div className="search-filter-container">
        <div className="search-input">
          <input
            type="text"
            placeholder="Buscar bandas por nome ou gênero..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="filter-select">
          <select
            value={filterFeatured}
            onChange={(e) => setFilterFeatured(e.target.value)}
            className="form-select"
          >
            <option value="all">Todas as Bandas</option>
            <option value="featured">Em Destaque</option>
            <option value="not-featured">Sem Destaque</option>
          </select>
        </div>
      </div>

      {/* Spacing between search and table */}
      <div className="h-4"></div>

      {/* Bandas Grid */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Bandas Cadastradas</h2>
          <span className="text-sm text-muted">
            {filteredBandas.length} banda(s) encontrada(s)
          </span>
        </div>
        
        {filteredBandas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBandas.map((banda) => (
              <div key={banda.id} className="border border-surface-lighter rounded-xl p-6 hover:border-primary/30 transition-all duration-200">
                {/* Banda Image */}
                <div className="w-full h-48 bg-surface-light rounded-lg mb-4 flex items-center justify-center">
                  {banda.image_url ? (
                    <img 
                      src={banda.image_url} 
                      alt={banda.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className={`text-muted text-center ${banda.image_url ? 'hidden' : ''}`}>
                    <Music className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Sem imagem</p>
                  </div>
                </div>

                {/* Banda Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg text-primary">{banda.name}</h3>
                    {banda.featured && (
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted line-clamp-2">
                    {banda.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {banda.genre_tags.split(',').map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-surface-light text-xs rounded-full text-muted"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-surface-lighter">
                  <button
                    onClick={() => handleEditBanda(banda)}
                    className="btn btn-secondary btn-sm flex-1"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDeleteBanda(banda.id)}
                    className="btn btn-danger btn-sm"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {banda.official_url && (
                    <a
                      href={banda.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      title="Visitar site"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted mb-2">Nenhuma banda encontrada</h3>
            <p className="text-muted">
              {searchTerm || filterFeatured !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Comece adicionando sua primeira banda'
              }
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Banda Modal */}
      {showAddModal && (
        <BandaModal
          banda={editingBanda}
          onSave={handleSaveBanda}
          onClose={() => {
            setShowAddModal(false)
            setEditingBanda(null)
          }}
        />
      )}
    </div>
  )
}

// Banda Modal Component
interface BandaModalProps {
  banda: Banda | null
  onSave: (data: Omit<Banda, 'id' | 'created_at' | 'updated_at'>) => void
  onClose: () => void
}

const BandaModal: React.FC<BandaModalProps> = ({ banda, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: banda?.name || '',
    slug: banda?.slug || '',
    description: banda?.description || '',
    official_url: banda?.official_url || '',
    image_url: banda?.image_url || '',
    genre_tags: banda?.genre_tags || '',
    featured: banda?.featured || false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

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

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {banda ? 'Editar Banda' : 'Adicionar Banda'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <span className="sr-only">Fechar</span>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome da Banda</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="form-input"
                placeholder="Ex: Sepultura"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="form-input"
                placeholder="Ex: sepultura"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              placeholder="Descreva a banda..."
              rows={3}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">URL Oficial</label>
              <input
                type="url"
                value={formData.official_url}
                onChange={(e) => setFormData({ ...formData, official_url: e.target.value })}
                className="form-input"
                placeholder="https://exemplo.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">URL da Imagem</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="form-input"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gêneros Musicais</label>
              <input
                type="text"
                value={formData.genre_tags}
                onChange={(e) => setFormData({ ...formData, genre_tags: e.target.value })}
                className="form-input"
                placeholder="Ex: Thrash Metal, Groove Metal"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Status</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-primary border-surface-lighter rounded focus:ring-primary"
                  />
                  <span className="text-sm">Em Destaque</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {banda ? 'Atualizar' : 'Adicionar'} Banda
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BandasManagement
