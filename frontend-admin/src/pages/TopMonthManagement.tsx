import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Star, Music, Save, X, TrendingUp, 
  Play, Link, Image as ImageIcon, Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type TopMonthConfig, type TopMonthBand } from '../services/api'

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
      setBandForm({
        name: '',
        genre: '',
        description: '',
        image: ''
      })
    } catch (error) {
      console.error('Erro ao salvar banda:', error)
      setError('Erro ao salvar banda')
    }
  }

  const handleEditBand = (band: TopMonthBand) => {
    setEditingBand(band)
    setBandForm(band)
    setShowBandModal(true)
  }

  const handleDeleteBand = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta banda?')) {
      try {
        await apiService.deleteTopMonthBand(id)
        await loadData() // Recarregar dados
      } catch (error) {
        console.error('Erro ao deletar banda:', error)
        setError('Erro ao deletar banda')
      }
    }
  }

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-metal-dark text-metal-text flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-metal-orange" />
          <span>Carregando...</span>
        </div>
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
                Gestão do Top do Mês
              </h1>
              <p className="text-metal-text-secondary">
                Configure a banda em destaque e suas estatísticas
              </p>
            </div>
            <motion.button
              onClick={() => setShowConfigModal(true)}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="w-5 h-5" />
              Configurar Top do Mês
            </motion.button>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {/* Configuração Atual */}
        {config && (
          <motion.div 
            className="mb-8 bg-metal-card border border-metal-orange/30 rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.div>
        )}

        {/* Lista de Bandas */}
        <motion.div 
          className="bg-metal-card border border-metal-border rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Bandas Disponíveis</h2>
            <motion.button
              onClick={() => setShowBandModal(true)}
              className="bg-metal-accent hover:bg-metal-accent/90 text-metal-dark px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              Nova Banda
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bands.map((band) => (
              <motion.div
                key={band.id}
                className="bg-metal-dark border border-metal-border rounded-lg p-4 hover:border-metal-orange/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-metal-orange/20 to-metal-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-metal-orange font-bold text-sm">
                        {band.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold">{band.name}</h3>
                      <p className="text-metal-text-secondary text-sm">{band.genre}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditBand(band)}
                      className="p-1 text-metal-text-secondary hover:text-metal-orange transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBand(band.id)}
                      className="p-1 text-metal-text-secondary hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-metal-text-secondary text-sm mb-3 line-clamp-2">
                  {band.description}
                </p>

                {config?.bandId === band.id && (
                  <div className="flex items-center gap-2 text-metal-orange text-sm">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">Top do Mês Atual</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal de Configuração */}
      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-metal-card border border-metal-border rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Configurar Top do Mês</h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Banda</label>
                  <select
                    value={configForm.bandId}
                    onChange={(e) => setConfigForm({ ...configForm, bandId: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    required
                  >
                    <option value="">Selecione uma banda</option>
                    {bands.map((band) => (
                      <option key={band.id} value={band.id}>
                        {band.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Álbum</label>
                  <input
                    type="text"
                    value={configForm.albumName}
                    onChange={(e) => setConfigForm({ ...configForm, albumName: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="Nome do álbum"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imagem do Álbum (URL)</label>
                  <input
                    type="url"
                    value={configForm.albumImage}
                    onChange={(e) => setConfigForm({ ...configForm, albumImage: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Número de Reproduções</label>
                  <input
                    type="number"
                    value={configForm.playCount}
                    onChange={(e) => setConfigForm({ ...configForm, playCount: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="45000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link da Matéria</label>
                  <input
                    type="text"
                    value={configForm.newsLink}
                    onChange={(e) => setConfigForm({ ...configForm, newsLink: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="/news/banda-top-month"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={configForm.isActive}
                    onChange={(e) => setConfigForm({ ...configForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-metal-orange bg-metal-dark border-metal-border rounded focus:ring-metal-orange"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Ativo
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="flex-1 bg-metal-dark border border-metal-border text-metal-text px-4 py-2 rounded-lg hover:bg-metal-border transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-metal-orange hover:bg-metal-orange/90 text-metal-dark px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Banda */}
      <AnimatePresence>
        {showBandModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-metal-card border border-metal-border rounded-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">
                  {editingBand ? 'Editar Banda' : 'Nova Banda'}
                </h3>
                <button
                  onClick={() => {
                    setShowBandModal(false)
                    setEditingBand(null)
                    setBandForm({
                      name: '',
                      genre: '',
                      description: '',
                      image: ''
                    })
                  }}
                  className="text-metal-text-secondary hover:text-metal-orange transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleBandSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Banda</label>
                  <input
                    type="text"
                    value={bandForm.name}
                    onChange={(e) => setBandForm({ ...bandForm, name: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="Nome da banda"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gênero</label>
                  <input
                    type="text"
                    value={bandForm.genre}
                    onChange={(e) => setBandForm({ ...bandForm, genre: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="Metalcore, Alternative Metal, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    value={bandForm.description}
                    onChange={(e) => setBandForm({ ...bandForm, description: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none resize-none"
                    rows={3}
                    placeholder="Breve descrição da banda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imagem (URL)</label>
                  <input
                    type="url"
                    value={bandForm.image}
                    onChange={(e) => setBandForm({ ...bandForm, image: e.target.value })}
                    className="w-full bg-metal-dark border border-metal-border rounded-lg px-3 py-2 text-metal-text focus:border-metal-orange focus:outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBandModal(false)
                      setEditingBand(null)
                      setBandForm({
                        name: '',
                        genre: '',
                        description: '',
                        image: ''
                      })
                    }}
                    className="flex-1 bg-metal-dark border border-metal-border text-metal-text px-4 py-2 rounded-lg hover:bg-metal-border transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-metal-orange hover:bg-metal-orange/90 text-metal-dark px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingBand ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TopMonthManagement 