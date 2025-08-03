import { motion } from 'framer-motion'
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
  Search,
  // Filter,
  Save,
  X
} from 'lucide-react'
import { apiService } from '@/services/api'

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

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterPublished === 'all' || 
                         (filterPublished === 'published' && item.isPublished) ||
                         (filterPublished === 'draft' && !item.isPublished)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-metal-orange/30 border-t-metal-orange rounded-full animate-spin"></div>
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
              Gestão de Notícias
            </h1>
            <p className="text-metal-text-secondary">
              Gerencie as notícias do site
            </p>
          </div>
          <motion.button
            className="btn-primary flex items-center gap-2"
            onClick={() => {
              setShowForm(true)
              setEditingNews(null)
              resetForm()
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Nova Notícia
          </motion.button>
        </div>
      </motion.div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-metal-text-secondary" />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-metal-card border border-metal-light-gray/20 rounded-lg text-metal-text placeholder-metal-text-secondary focus:outline-none focus:ring-2 focus:ring-metal-orange"
          />
        </div>
        <select
          value={filterPublished}
          onChange={(e) => setFilterPublished(e.target.value as any)}
          className="px-4 py-2 bg-metal-card border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
        >
          <option value="all">Todas</option>
          <option value="published">Publicadas</option>
          <option value="draft">Rascunhos</option>
        </select>
      </div>

      {/* Formulário */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-metal-card border border-metal-light-gray/20 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-metal-text">
              {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
            </h3>
            <button
              onClick={() => {
                setShowForm(false)
                setEditingNews(null)
                resetForm()
              }}
              className="text-metal-text-secondary hover:text-metal-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Conteúdo
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-metal-text-secondary mb-2">
                Autor
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 bg-metal-dark border border-metal-light-gray/20 rounded-lg text-metal-text focus:outline-none focus:ring-2 focus:ring-metal-orange"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-metal-orange bg-metal-dark border-metal-light-gray/20 rounded focus:ring-metal-orange"
              />
              <label htmlFor="isPublished" className="text-sm text-metal-text-secondary">
                Publicar imediatamente
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-metal-orange hover:bg-metal-orange/90 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingNews ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingNews(null)
                  resetForm()
                }}
                className="px-4 py-2 bg-metal-light-gray/20 hover:bg-metal-light-gray/30 text-metal-text rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de Notícias */}
      <div className="bg-metal-card border border-metal-light-gray/20 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-metal-dark/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-metal-text-secondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-metal-light-gray/20">
              {filteredNews.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-metal-dark/30">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-metal-text">{newsItem.title}</div>
                      <div className="text-sm text-metal-text-secondary truncate max-w-xs">
                        {newsItem.content.substring(0, 100)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-metal-text-secondary">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {newsItem.author}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      newsItem.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {newsItem.isPublished ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Publicada
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Rascunho
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-metal-text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(newsItem.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="text-metal-orange hover:text-metal-orange/80 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhuma notícia encontrada</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}

export default NewsManagement 