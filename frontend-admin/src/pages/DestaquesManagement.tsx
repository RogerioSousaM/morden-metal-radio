import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Image as ImageIcon,
  Link as LinkIcon,
  Save,
  X
} from 'lucide-react'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import ActionButton from '../components/ui/ActionButton'
import SearchBar from '../components/ui/SearchBar'
import FilterSelect from '../components/ui/FilterSelect'

interface DestaqueItem {
  id: number
  titulo: string
  descricao: string
  imagem: string | null
  link: string | null
  ordem: number
  ativo: boolean
  created_at: string
  updated_at: string
}

interface FormData {
  titulo: string
  descricao: string
  imagem: string
  link: string
  ordem: number
  ativo: boolean
}

const DestaquesManagement = () => {
  const [destaques, setDestaques] = useState<DestaqueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingDestaque, setEditingDestaque] = useState<DestaqueItem | null>(null)
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descricao: '',
    imagem: '',
    link: '',
    ordem: 0,
    ativo: true
  })

  // Carregar destaques
  useEffect(() => {
    loadDestaques()
  }, [])

  const loadDestaques = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/destaques/admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDestaques(data.destaques)
      } else {
        console.error('Erro ao carregar destaques')
      }
    } catch (error) {
      console.error('Erro ao carregar destaques:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar destaques
  const filteredDestaques = destaques.filter(destaque => {
    const matchesSearch = destaque.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destaque.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && destaque.ativo) ||
                         (statusFilter === 'inactive' && !destaque.ativo)
    
    return matchesSearch && matchesStatus
  })

  // Abrir modal para criar/editar
  const openModal = (destaque?: DestaqueItem) => {
    if (destaque) {
      setEditingDestaque(destaque)
      setFormData({
        titulo: destaque.titulo,
        descricao: destaque.descricao,
        imagem: destaque.imagem || '',
        link: destaque.link || '',
        ordem: destaque.ordem,
        ativo: destaque.ativo
      })
    } else {
      setEditingDestaque(null)
      setFormData({
        titulo: '',
        descricao: '',
        imagem: '',
        link: '',
        ordem: destaques.length + 1,
        ativo: true
      })
    }
    setShowModal(true)
  }

  // Fechar modal
  const closeModal = () => {
    setShowModal(false)
    setEditingDestaque(null)
    setFormData({
      titulo: '',
      descricao: '',
      imagem: '',
      link: '',
      ordem: 0,
      ativo: true
    })
  }

  // Salvar destaque
  const saveDestaque = async () => {
    try {
      const url = editingDestaque 
        ? `/api/destaques/${editingDestaque.id}`
        : '/api/destaques'
      
      const method = editingDestaque ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        await loadDestaques()
        closeModal()
      } else {
        const error = await response.json()
        alert(`Erro: ${error.error}`)
      }
    } catch (error) {
      console.error('Erro ao salvar destaque:', error)
      alert('Erro ao salvar destaque')
    }
  }

  // Excluir destaque
  const deleteDestaque = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este destaque?')) return
    
    try {
      const response = await fetch(`/api/destaques/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        await loadDestaques()
      } else {
        alert('Erro ao excluir destaque')
      }
    } catch (error) {
      console.error('Erro ao excluir destaque:', error)
      alert('Erro ao excluir destaque')
    }
  }

  // Alternar status ativo/inativo
  const toggleStatus = async (id: number) => {
    try {
      const response = await fetch(`/api/destaques/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        await loadDestaques()
      } else {
        alert('Erro ao alterar status')
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      alert('Erro ao alterar status')
    }
  }

  // Reordenar destaque
  const reorderDestaque = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = destaques.findIndex(d => d.id === id)
    if (currentIndex === -1) return
    
    const newOrder = [...destaques]
    if (direction === 'up' && currentIndex > 0) {
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]]
    } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]]
    }
    
    try {
      const reorderData = newOrder.map((d, index) => ({ id: d.id, ordem: index + 1 }))
      
      const response = await fetch('/api/destaques/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reorderData })
      })
      
      if (response.ok) {
        await loadDestaques()
      } else {
        alert('Erro ao reordenar')
      }
    } catch (error) {
      console.error('Erro ao reordenar:', error)
      alert('Erro ao reordenar')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-metal-orange/30 border-t-metal-orange rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-metal-text">Gestão de Destaques da Cena</h1>
          <p className="text-metal-text-secondary">
            Gerencie os destaques exibidos no MosaicGallery do frontend
          </p>
        </div>
        <ActionButton
          onClick={() => openModal()}
          className="bg-metal-orange hover:bg-metal-orange/80"
        >
          <Plus className="w-4 h-4" />
          Novo Destaque
        </ActionButton>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <SearchBar
          placeholder="Buscar por título ou descrição..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'active', label: 'Ativos' },
            { value: 'inactive', label: 'Inativos' }
          ]}
        />
      </div>

      {/* Grid de destaques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestaques.map((destaque) => (
          <Card key={destaque.id} className="relative group">
            {/* Status badge */}
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                destaque.ativo 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {destaque.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {/* Imagem */}
            <div className="relative h-48 bg-metal-gray rounded-t-lg overflow-hidden">
              {destaque.imagem ? (
                <img
                  src={destaque.imagem}
                  alt={destaque.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-metal-gray">
                  <ImageIcon className="w-12 h-12 text-metal-text-secondary" />
                </div>
              )}
              
              {/* Overlay de ações */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <ActionButton
                  onClick={() => openModal(destaque)}
                  size="sm"
                  className="bg-metal-orange hover:bg-metal-orange/80"
                >
                  <Edit className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  onClick={() => toggleStatus(destaque.id)}
                  size="sm"
                  className={destaque.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}
                >
                  {destaque.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </ActionButton>
                <ActionButton
                  onClick={() => deleteDestaque(destaque.id)}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-bold text-metal-text line-clamp-2">
                {destaque.titulo}
              </h3>
              
              <p className="text-sm text-metal-text-secondary line-clamp-3">
                {destaque.descricao}
              </p>
              
              {/* Meta informações */}
              <div className="flex items-center justify-between text-xs text-metal-text-secondary">
                <span>Ordem: {destaque.ordem}</span>
                <div className="flex items-center gap-1">
                  {destaque.link && <LinkIcon className="w-3 h-3" />}
                  <span>{destaque.link ? 'Com link' : 'Sem link'}</span>
                </div>
              </div>
              
              {/* Controles de ordem */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-metal-light-gray/20">
                <ActionButton
                  onClick={() => reorderDestaque(destaque.id, 'up')}
                  size="sm"
                  className="bg-metal-gray hover:bg-metal-light-gray"
                  disabled={destaque.ordem === 1}
                >
                  <ArrowUp className="w-4 h-4" />
                </ActionButton>
                <ActionButton
                  onClick={() => reorderDestaque(destaque.id, 'down')}
                  size="sm"
                  className="bg-metal-gray hover:bg-metal-light-gray"
                  disabled={destaque.ordem === destaques.length}
                >
                  <ArrowDown className="w-4 h-4" />
                </ActionButton>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal de criação/edição */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <div className="bg-metal-card p-6 rounded-lg max-w-2xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-metal-text">
              {editingDestaque ? 'Editar Destaque' : 'Novo Destaque'}
            </h2>
            <button
              onClick={closeModal}
              className="text-metal-text-secondary hover:text-metal-text"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveDestaque(); }}>
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-metal-text mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full px-3 py-2 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text focus:border-metal-orange focus:outline-none"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-metal-text mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text focus:border-metal-orange focus:outline-none"
                required
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-metal-text mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                value={formData.imagem}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full px-3 py-2 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text focus:border-metal-orange focus:outline-none"
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-metal-text mb-2">
                Link Externo
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://exemplo.com"
                className="w-full px-3 py-2 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text focus:border-metal-orange focus:outline-none"
              />
            </div>

            {/* Ordem */}
            <div>
              <label className="block text-sm font-medium text-metal-text mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 bg-metal-gray border border-metal-light-gray/20 rounded-lg text-metal-text focus:border-metal-orange focus:outline-none"
              />
            </div>

            {/* Status ativo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="w-4 h-4 text-metal-orange bg-metal-gray border-metal-light-gray/20 rounded focus:ring-metal-orange"
              />
              <label htmlFor="ativo" className="text-sm font-medium text-metal-text">
                Destaque ativo
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <ActionButton
                type="submit"
                className="bg-metal-orange hover:bg-metal-orange/80 flex-1"
              >
                <Save className="w-4 h-4" />
                {editingDestaque ? 'Atualizar' : 'Criar'}
              </ActionButton>
              <ActionButton
                type="button"
                onClick={closeModal}
                className="bg-metal-gray hover:bg-metal-light-gray flex-1"
              >
                Cancelar
              </ActionButton>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default DestaquesManagement
