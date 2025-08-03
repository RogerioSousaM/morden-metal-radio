import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  User, 
  FileText,
  Save,
  X,
  AlertCircle
} from 'lucide-react'
import { apiService } from '@/services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import SearchFilters from '../components/ui/SearchFilters'
import ActionButton from '../components/ui/ActionButton'

interface News {
  id: number
  title: string
  content: string
  image: string
  author: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

const NewsManagement = () => {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPublished, setFilterPublished] = useState<'all' | 'published' | 'draft'>('all')
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    author: 'Admin',
    isPublished: true
  })

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      const data = await apiService.getNews()
      setNews(data)
    } catch (error) {
      setError('Erro ao carregar notícias')
      console.error('Erro ao carregar notícias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      if (editingNews) {
        await apiService.updateNews(editingNews.id, formData)
      } else {
        await apiService.createNews(formData)
      }
      setShowForm(false)
      setEditingNews(null)
      resetForm()
      loadNews()
    } catch (error) {
      setError('Erro ao salvar notícia')
      console.error('Erro ao salvar notícia:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      image: newsItem.image,
      author: newsItem.author,
      isPublished: newsItem.isPublished
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await apiService.deleteNews(id)
        loadNews()
      } catch (error) {
        setError('Erro ao excluir notícia')
        console.error('Erro ao excluir notícia:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
      author: 'Admin',
      isPublished: true
    })
  }

  const handleAddNew = () => {
    setEditingNews(null)
    resetForm()
    setShowForm(true)
  }

  const handleCloseModal = () => {
    setShowForm(false)
    setEditingNews(null)
    resetForm()
  }

  const filterOptions = [
    { value: 'all', label: 'Todas as Notícias' },
    { value: 'published', label: 'Publicadas' },
    { value: 'draft', label: 'Rascunhos' }
  ]

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterPublished === 'all' || 
                         (filterPublished === 'published' && item.isPublished) ||
                         (filterPublished === 'draft' && !item.isPublished)
    
    return matchesSearch && matchesFilter
  })

  const stats = [
    {
      title: 'Total de Notícias',
      value: news.length.toString(),
      icon: FileText,
      color: 'from-metal-orange to-orange-600'
    },
    {
      title: 'Publicadas',
      value: news.filter(n => n.isPublished).length.toString(),
      icon: Eye,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Rascunhos',
      value: news.filter(n => !n.isPublished).length.toString(),
      icon: EyeOff,
      color: 'from-metal-accent to-blue-600'
    },
    {
      title: 'Este Mês',
      value: news.filter(n => {
        const createdAt = new Date(n.createdAt)
        const now = new Date()
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
      }).length.toString(),
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <PageLayout
      title="Gestão de Notícias"
      subtitle="Gerencie as notícias e artigos do site"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Nova Notícia"
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
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              delay={index * 0.1}
              className="p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-metal-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-metal-text-secondary">{stat.title}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Filtros e Busca */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar notícias..."
        filterOptions={filterOptions}
        filterValue={filterPublished}
        onFilterChange={(value) => setFilterPublished(value as any)}
        filterPlaceholder="Filtrar por status"
      />

      {/* Lista de Notícias */}
      <div className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden">
        <div className="p-6 border-b border-metal-light-gray/20">
          <h3 className="text-lg font-semibold text-metal-text">Notícias</h3>
        </div>
        
        {filteredNews.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhuma notícia encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-metal-light-gray/20">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-metal-gray/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {item.image && (
                      <div className="w-16 h-16 bg-metal-gray rounded-lg flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-metal-text truncate">{item.title}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isPublished 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {item.isPublished ? 'Publicada' : 'Rascunho'}
                        </div>
                      </div>
                      <p className="text-sm text-metal-text-secondary line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-metal-text-secondary">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{item.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-metal-text-secondary hover:text-metal-red transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Formulário Modal */}
      <Modal
        isOpen={showForm}
        onClose={handleCloseModal}
        title={editingNews ? 'Editar Notícia' : 'Nova Notícia'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="form-label">Título</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="Digite o título da notícia"
              required
            />
          </div>

          <div>
            <label className="form-label">Conteúdo</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="form-textarea"
              rows={6}
              placeholder="Digite o conteúdo da notícia..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Autor</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="form-input"
                placeholder="Nome do autor"
                required
              />
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="isPublished" className="text-sm text-metal-text-secondary">
                Publicar imediatamente
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
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Salvando...' : (editingNews ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default NewsManagement 