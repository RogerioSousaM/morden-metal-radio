import { motion, AnimatePresence } from 'framer-motion'
import { 
  Edit, Trash2, Star, Save, Plus, Calendar, 
  AlertCircle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { apiService, type Filme } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'

const FilmaçoManagement = () => {
  const [filmes, setFilmes] = useState<Filme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Estados para modais
  const [showModal, setShowModal] = useState(false)
  const [editingFilme, setEditingFilme] = useState<Filme | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewFilme, setPreviewFilme] = useState<Filme | null>(null)

  // Estados para formulário
  const [filmeForm, setFilmeForm] = useState({
    titulo: '',
    descricao: '',
    ano: '',
    nota: '',
    imagem: '',
    indicacao_do_mes: false
  })

  useEffect(() => {
    loadFilmes()
  }, [])

  const loadFilmes = async () => {
    try {
      setLoading(true)
      const data = await apiService.getFilmes()
      const filmesCorrigidos = (data || []).map((filme: any) => ({
        ...filme,
        indicacao_do_mes: Boolean(filme.indicacao_do_mes)
      }))
      setFilmes(filmesCorrigidos)
    } catch (error) {
      setError('Erro ao carregar filmes')
      console.error('Erro ao carregar filmes:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): string[] => {
    console.log('Validando formulário:', filmeForm)
    const errors: string[] = []
    
    if (!filmeForm.titulo.trim()) {
      errors.push('Título é obrigatório')
    }
    if (!filmeForm.descricao.trim()) {
      errors.push('Descrição é obrigatória')
    }
    if (!filmeForm.ano || parseInt(filmeForm.ano) < 1900 || parseInt(filmeForm.ano) > 2099) {
      errors.push('Ano deve estar entre 1900 e 2099')
    }
    if (!filmeForm.nota || parseFloat(filmeForm.nota) < 0 || parseFloat(filmeForm.nota) > 5) {
      errors.push('Nota deve estar entre 0 e 5')
    }
    
    console.log('Formulário válido:', errors.length === 0)
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      console.log('Validando formulário...')
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        setLoading(false)
        return
      }

      if (editingFilme) {
        console.log('Tentando atualizar filme:', editingFilme.id)
        const dadosParaEnviar = {
          titulo: filmeForm.titulo.trim(),
          descricao: filmeForm.descricao.trim(),
          ano: parseInt(filmeForm.ano),
          nota: parseFloat(filmeForm.nota),
          imagem: filmeForm.imagem.trim() || null,
          indicacao_do_mes: Boolean(filmeForm.indicacao_do_mes)
        }
        
        console.log('Dados do formulário:', dadosParaEnviar)
        console.log('Tipo de indicacao_do_mes:', typeof dadosParaEnviar.indicacao_do_mes)
        console.log('Valor de indicacao_do_mes:', dadosParaEnviar.indicacao_do_mes)
        
        const updatedFilme = await apiService.updateFilme(editingFilme.id, dadosParaEnviar)
        
        console.log('Filme atualizado com sucesso:', updatedFilme)
        setSuccess('Filme atualizado com sucesso!')
        setEditingFilme(null)
        setShowModal(false)
        resetForm()
        loadFilmes() // Recarregar a lista
      } else {
        console.log('Tentando criar novo filme')
        const dadosParaEnviar = {
          titulo: filmeForm.titulo.trim(),
          descricao: filmeForm.descricao.trim(),
          ano: parseInt(filmeForm.ano),
          nota: parseFloat(filmeForm.nota),
          imagem: filmeForm.imagem.trim() || null,
          indicacao_do_mes: Boolean(filmeForm.indicacao_do_mes)
        }
        
        console.log('Dados do formulário:', dadosParaEnviar)
        console.log('Tipo de indicacao_do_mes:', typeof dadosParaEnviar.indicacao_do_mes)
        console.log('Valor de indicacao_do_mes:', dadosParaEnviar.indicacao_do_mes)
        
        const newFilme = await apiService.createFilme(dadosParaEnviar)
        
        console.log('Filme criado com sucesso:', newFilme)
        setSuccess('Filme criado com sucesso!')
        setShowModal(false)
        resetForm()
        loadFilmes() // Recarregar a lista
      }
    } catch (error: any) {
      console.error('Erro ao salvar filme:', error)
      
      // Tratamento específico para erros de autenticação
      if (error.message && error.message.includes('403')) {
        setError('Sessão expirada. Faça login novamente para continuar.')
        // Não redirecionar automaticamente - deixar o usuário decidir
      } else if (error.message && error.message.includes('Token inválido')) {
        setError('Token inválido. Faça login novamente para continuar.')
        // Não redirecionar automaticamente - deixar o usuário decidir
      } else {
        setError(`Erro ao salvar filme: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (filme: Filme) => {
    setEditingFilme(filme)
    setFilmeForm({
      titulo: filme.titulo,
      descricao: filme.descricao,
      ano: filme.ano.toString(),
      nota: filme.nota.toString(),
      imagem: filme.imagem || '',
      indicacao_do_mes: filme.indicacao_do_mes
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este filme?')) return
    
    try {
      await apiService.deleteFilme(id)
      await loadFilmes()
    } catch (error) {
      console.error('Erro ao excluir filme:', error)
      setError('Erro ao excluir filme')
    }
  }

  const handleAddNew = () => {
    setEditingFilme(null)
    setFilmeForm({
      titulo: '',
      descricao: '',
      ano: '',
      nota: '',
      imagem: '',
      indicacao_do_mes: false
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFilmeForm({
      titulo: '',
      descricao: '',
      ano: '',
      nota: '',
      imagem: '',
      indicacao_do_mes: false
    })
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingFilme(null)
    setError('')
    setSuccess('')
    resetForm()
  }

  const handlePreview = (filme: Filme) => {
    setPreviewFilme(filme)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setPreviewFilme(null)
  }

  const handleLogout = () => {
    apiService.logout()
    window.location.href = '/login'
  }

  return (
    <PageLayout title="Gestão do Filmaço">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            🎬 Gestão do Filmaço
          </motion.h1>
          
          <motion.button
            onClick={handleAddNew}
            className="btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Plus className="w-5 h-5" />
            Novo Filme
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
            {error.includes('Sessão expirada') || error.includes('Token inválido') ? (
              <button
                onClick={handleLogout}
                className="ml-3 text-red-400 hover:underline"
              >
                Fazer logout
              </button>
            ) : null}
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-400">{success}</span>
          </motion.div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          /* Grid de Filmes */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmes.map((filme, index) => (
              <motion.div
                key={filme.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  {/* Imagem do filme */}
                  <div className="relative mb-4">
                    <img
                      src={filme.imagem || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='}
                      alt={filme.titulo}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='
                      }}
                    />
                    
                    {/* Badge de destaque */}
                    {filme.indicacao_do_mes ? (
                      <div className="absolute top-2 left-2">
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Destaque
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Informações do filme */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white line-clamp-2">
                      {filme.titulo}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{filme.ano}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{filme.nota}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-3">
                      {filme.descricao}
                    </p>

                    {/* Ações */}
                    <div className="flex items-center gap-2 pt-3">
                      <motion.button
                        onClick={() => handleEdit(filme)}
                        className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleDelete(filme.id)}
                        className="btn-danger flex items-center justify-center gap-2 text-sm px-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                      
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => handlePreview(filme)}
                      >
                        Visualizar como usuário
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal de Formulário */}
        <AnimatePresence>
          {showModal && (
            <Modal isOpen={showModal} onClose={handleCloseModal}>
              <div className="bg-metal-card rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingFilme ? 'Editar Filme' : 'Novo Filme'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={filmeForm.titulo}
                      onChange={(e) => setFilmeForm({...filmeForm, titulo: e.target.value})}
                      className="w-full px-3 py-2 bg-metal-dark border border-metal-light-gray rounded-lg text-white focus:border-metal-orange focus:outline-none"
                      maxLength={100}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={filmeForm.descricao}
                      onChange={(e) => setFilmeForm({...filmeForm, descricao: e.target.value})}
                      className="w-full px-3 py-2 bg-metal-dark border border-metal-light-gray rounded-lg text-white focus:border-metal-orange focus:outline-none resize-none"
                      rows={4}
                      maxLength={300}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Ano e Nota */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ano *
                      </label>
                      <input
                        type="number"
                        value={filmeForm.ano}
                        onChange={(e) => setFilmeForm({...filmeForm, ano: e.target.value})}
                        className="w-full px-3 py-2 bg-metal-dark border border-metal-light-gray rounded-lg text-white focus:border-metal-orange focus:outline-none"
                        min="1900"
                        max="2099"
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nota (0-5) *
                      </label>
                      <input
                        type="number"
                        value={filmeForm.nota}
                        onChange={(e) => setFilmeForm({...filmeForm, nota: e.target.value})}
                        className="w-full px-3 py-2 bg-metal-dark border border-metal-light-gray rounded-lg text-white focus:border-metal-orange focus:outline-none"
                        min="0"
                        max="5"
                        step="0.1"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* URL da Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={filmeForm.imagem}
                      onChange={(e) => setFilmeForm({...filmeForm, imagem: e.target.value})}
                      className="w-full px-3 py-2 bg-metal-dark border border-metal-light-gray rounded-lg text-white focus:border-metal-orange focus:outline-none"
                      placeholder="https://exemplo.com/imagem.jpg"
                      disabled={loading}
                    />
                  </div>

                  {/* Checkbox Destaque */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="destaque"
                      checked={filmeForm.indicacao_do_mes}
                      onChange={(e) => setFilmeForm({...filmeForm, indicacao_do_mes: e.target.checked})}
                      className="w-4 h-4 text-metal-orange bg-metal-dark border-metal-light-gray rounded focus:ring-metal-orange"
                      disabled={loading}
                    />
                    <label htmlFor="destaque" className="text-sm font-medium text-gray-300">
                      Indicar como destaque do mês
                    </label>
                  </div>

                  {/* Botões */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      className="btn-primary flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {editingFilme ? 'Atualizando...' : 'Criando...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingFilme ? 'Atualizar' : 'Criar'}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}
        </AnimatePresence>

        {/* Modal de Preview */}
        <AnimatePresence>
          {isPreviewOpen && previewFilme && (
            <Modal isOpen={isPreviewOpen} onClose={closePreview}>
              <div className="bg-metal-card rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Preview do Filme</h2>
                
                <div className="space-y-4">
                  {/* Imagem */}
                  <img
                    src={previewFilme.imagem || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='}
                    alt={previewFilme.titulo}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjM2E0YTVhIi8+CjxwYXRoIGQ9Ik0xNjAgOTZDMjEwLjUgOTYgMjUyIDEzNy41IDI1MiAxODhIMTYwQzEwOS41IDE4OCA2OCAxNDYuNSA2OCA5NkM2OCA0NS41IDEwOS41IDQgMTYwIDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTQ0QzE3Ni41NjkgMTQ0IDE5MCAxMzAuNTY5IDE5MCAxMTRDMTkwIDk3LjQzMTUgMTc2LjU2OSA4NCAxNjAgODRDMTQzLjQzMSA4NCAxMzAgOTcuNDMxNSAxMzAgMTE0QzEzMCAxMzAuNTY5IDE0My40MzEgMTQ0IDE2MCAxNDRaIiBmaWxsPSIjNjc3M2E0Ii8+CjxwYXRoIGQ9Ik0xNjAgMTY4QzE3Ni41NjkgMTY4IDE5MCAxNTQuNTY5IDE5MCAxMzhDMTkwIDEyMS40MzEgMTc2LjU2OSAxMDggMTYwIDEwOEMxNDMuNDMxIDEwOCAxMzAgMTIxLjQzMSAxMzAgMTM4QzEzMCAxNTQuNTY5IDE0My40MzEgMTY4IDE2MCAxNjhaIiBmaWxsPSIjNjc3M2E0Ii8+Cjwvc3ZnPgo='
                    }}
                  />
                  
                  {/* Informações */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{previewFilme.titulo}</h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{previewFilme.ano}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{previewFilme.nota}</span>
                      </div>
                    </div>

                    <p className="text-gray-300">{previewFilme.descricao}</p>
                    
                    {previewFilme.indicacao_do_mes ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                          Indicação do Mês
                        </span>
                      </div>
                    ) : null}
                  </div>
                  
                  <button
                    onClick={closePreview}
                    className="btn-secondary w-full"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  )
}

export default FilmaçoManagement