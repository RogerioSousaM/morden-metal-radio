import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Star, Music, Save, X, TrendingUp, 
  Play, Link, Image as ImageIcon, Loader2, AlertCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type TopMonthConfig, type TopMonthBand } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const TopMonthManagement = () => {
  const [config, setConfig] = useState<TopMonthConfig | null>(null)
  const [bands, setBands] = useState<TopMonthBand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estados para modais
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showBandModal, setShowBandModal] = useState(false)
  const [editingBand, setEditingBand] = useState<TopMonthBand | null>(null)

  // Estados para formulários
  const [configForm, setConfigForm] = useState({
    bandId: '',
    albumName: '',
    albumImage: '',
    playCount: '',
    newsLink: '',
    isActive: true
  })

  const [bandForm, setBandForm] = useState({
    name: '',
    genre: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [configData, bandsData] = await Promise.all([
        apiService.getTopMonthConfig(),
        apiService.getTopMonthBands()
      ])
      setConfig(configData)
      setBands(bandsData)
      
      // Preencher formulário de configuração
      setConfigForm({
        bandId: configData.bandId.toString(),
        albumName: configData.albumName,
        albumImage: configData.albumImage,
        playCount: configData.playCount.toString(),
        newsLink: configData.newsLink,
        isActive: configData.isActive
      })
    } catch (error) {
      setError('Erro ao carregar dados')
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const updatedConfig = await apiService.updateTopMonthConfig({
        bandId: parseInt(configForm.bandId),
        albumName: configForm.albumName,
        albumImage: configForm.albumImage,
        playCount: parseInt(configForm.playCount),
        newsLink: configForm.newsLink,
        isActive: configForm.isActive
      })
      
      setConfig(updatedConfig)
      setShowConfigModal(false)
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
      setError('Erro ao atualizar configuração')
    }
  }

  const handleBandSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingBand) {
        await apiService.updateTopMonthBand(editingBand.id, bandForm)
      } else {
        await apiService.createTopMonthBand(bandForm)
      }
      
      await loadData() // Recarregar dados
      setShowBandModal(false)
      setEditingBand(null)
      setBandForm({ name: '', genre: '', description: '', image: '' })
    } catch (error) {
      console.error('Erro ao salvar banda:', error)
      setError('Erro ao salvar banda')
    }
  }

  const handleEditBand = (band: TopMonthBand) => {
    setEditingBand(band)
    setBandForm({
      name: band.name,
      genre: band.genre,
      description: band.description,
      image: band.image
    })
    setShowBandModal(true)
  }

  const handleDeleteBand = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta banda?')) {
      try {
        await apiService.deleteTopMonthBand(id)
        await loadData()
      } catch (error) {
        console.error('Erro ao excluir banda:', error)
        setError('Erro ao excluir banda')
      }
    }
  }

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const handleAddNew = () => {
    setShowConfigModal(true)
  }

  const handleAddBand = () => {
    setEditingBand(null)
    setBandForm({ name: '', genre: '', description: '', image: '' })
    setShowBandModal(true)
  }

  const stats = [
    {
      title: 'Total de Bandas',
      value: bands.length.toString(),
      icon: Music,
      color: 'from-metal-orange to-orange-600'
    },
    {
      title: 'Configuração Ativa',
      value: config?.isActive ? 'Sim' : 'Não',
      icon: Star,
      color: config?.isActive ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
    },
    {
      title: 'Reproduções',
      value: config ? formatPlayCount(config.playCount) : '0',
      icon: Play,
      color: 'from-metal-accent to-blue-600'
    },
    {
      title: 'Banda Atual',
      value: config?.bandName || 'Nenhuma',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <PageLayout
      title="Gestão do Top do Mês"
      subtitle="Configure a banda em destaque e suas estatísticas"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Configurar Top do Mês"
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

      {/* Configuração Atual */}
      {config && (
        <Card delay={0.2} className="mb-8 p-6 border border-metal-orange/30">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-metal-orange" />
            <h2 className="text-xl font-bold">Configuração Atual</h2>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              config.isActive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {config.isActive ? 'Ativo' : 'Inativo'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-metal-orange/20 to-metal-accent/20 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-metal-orange" />
              </div>
              <div>
                <p className="text-metal-text-secondary text-sm">Banda</p>
                <p className="font-bold">{config.bandName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-metal-accent/20 to-metal-orange/20 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-metal-accent" />
              </div>
              <div>
                <p className="text-metal-text-secondary text-sm">Álbum</p>
                <p className="font-bold">{config.albumName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-metal-text-secondary text-sm">Reproduções</p>
                <p className="font-bold">{formatPlayCount(config.playCount)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                <Link className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-metal-text-secondary text-sm">Matéria</p>
                <p className="font-bold text-sm truncate">{config.newsLink}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Bandas */}
      <div className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden">
        <div className="p-6 border-b border-metal-light-gray/20 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-metal-text">Bandas Disponíveis</h3>
          <button
            onClick={handleAddBand}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Banda
          </button>
        </div>
        
        {bands.length === 0 ? (
          <div className="p-12 text-center">
            <Music className="w-16 h-16 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhuma banda cadastrada</p>
          </div>
        ) : (
          <div className="divide-y divide-metal-light-gray/20">
            {bands.map((band, index) => (
              <motion.div
                key={band.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-metal-gray/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-metal-gray rounded-lg flex items-center justify-center">
                      {band.image ? (
                        <img
                          src={band.image}
                          alt={band.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Music className="w-6 h-6 text-metal-orange" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-metal-text">{band.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-2 py-1 rounded-full text-xs font-medium bg-metal-accent/20 text-metal-accent border border-metal-accent/30">
                          {band.genre}
                        </div>
                        {config?.bandId === band.id && (
                          <div className="px-2 py-1 rounded-full text-xs font-medium bg-metal-orange/20 text-metal-orange border border-metal-orange/30">
                            Em Destaque
                          </div>
                        )}
                      </div>
                      {band.description && (
                        <p className="text-sm text-metal-text-secondary mt-1 line-clamp-2">
                          {band.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditBand(band)}
                      className="p-2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBand(band.id)}
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

      {/* Modal de Configuração */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Configurar Top do Mês"
        size="lg"
      >
        <form onSubmit={handleConfigSubmit} className="space-y-6">
          <div>
            <label className="form-label">Banda</label>
            <select
              value={configForm.bandId}
              onChange={(e) => setConfigForm({ ...configForm, bandId: e.target.value })}
              className="form-select"
              required
            >
              <option value="">Selecione uma banda</option>
              {bands.map(band => (
                <option key={band.id} value={band.id}>
                  {band.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Nome do Álbum</label>
            <input
              type="text"
              value={configForm.albumName}
              onChange={(e) => setConfigForm({ ...configForm, albumName: e.target.value })}
              className="form-input"
              placeholder="Nome do álbum em destaque"
              required
            />
          </div>

          <div>
            <label className="form-label">URL da Imagem do Álbum</label>
            <input
              type="url"
              value={configForm.albumImage}
              onChange={(e) => setConfigForm({ ...configForm, albumImage: e.target.value })}
              className="form-input"
              placeholder="https://exemplo.com/album.jpg"
            />
          </div>

          <div>
            <label className="form-label">Número de Reproduções</label>
            <input
              type="number"
              value={configForm.playCount}
              onChange={(e) => setConfigForm({ ...configForm, playCount: e.target.value })}
              className="form-input"
              placeholder="1000000"
              required
            />
          </div>

          <div>
            <label className="form-label">Link da Matéria</label>
            <input
              type="url"
              value={configForm.newsLink}
              onChange={(e) => setConfigForm({ ...configForm, newsLink: e.target.value })}
              className="form-input"
              placeholder="https://exemplo.com/materia"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={configForm.isActive}
              onChange={(e) => setConfigForm({ ...configForm, isActive: e.target.checked })}
              className="form-checkbox"
            />
            <label htmlFor="isActive" className="text-sm text-metal-text-secondary">
              Ativar Top do Mês
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-metal-border">
            <button
              type="button"
              onClick={() => setShowConfigModal(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Configuração
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Banda */}
      <Modal
        isOpen={showBandModal}
        onClose={() => {
          setShowBandModal(false)
          setEditingBand(null)
          setBandForm({ name: '', genre: '', description: '', image: '' })
        }}
        title={editingBand ? 'Editar Banda' : 'Nova Banda'}
        size="md"
      >
        <form onSubmit={handleBandSubmit} className="space-y-6">
          <div>
            <label className="form-label">Nome da Banda</label>
            <input
              type="text"
              value={bandForm.name}
              onChange={(e) => setBandForm({ ...bandForm, name: e.target.value })}
              className="form-input"
              placeholder="Nome da banda"
              required
            />
          </div>

          <div>
            <label className="form-label">Gênero</label>
            <input
              type="text"
              value={bandForm.genre}
              onChange={(e) => setBandForm({ ...bandForm, genre: e.target.value })}
              className="form-input"
              placeholder="Heavy Metal, Thrash Metal, etc."
              required
            />
          </div>

          <div>
            <label className="form-label">Descrição</label>
            <textarea
              value={bandForm.description}
              onChange={(e) => setBandForm({ ...bandForm, description: e.target.value })}
              className="form-textarea"
              rows={3}
              placeholder="Breve descrição da banda..."
            />
          </div>

          <div>
            <label className="form-label">URL da Imagem</label>
            <input
              type="url"
              value={bandForm.image}
              onChange={(e) => setBandForm({ ...bandForm, image: e.target.value })}
              className="form-input"
              placeholder="https://exemplo.com/banda.jpg"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-metal-border">
            <button
              type="button"
              onClick={() => {
                setShowBandModal(false)
                setEditingBand(null)
                setBandForm({ name: '', genre: '', description: '', image: '' })
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingBand ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  )
}

export default TopMonthManagement 