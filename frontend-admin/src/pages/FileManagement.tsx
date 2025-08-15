import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image, Video, File, Trash2, Eye, Download, AlertCircle } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import { apiService } from '../services/api'
import PageLayout from '../components/PageLayout'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import SearchFilters from '../components/ui/SearchFilters'


interface FileItem {
  id: number
  filename: string
  original_name: string
  mime_type: string
  size: number
  path: string
  alt_text: string
  created_at: string
}

interface FileStats {
  total_files: number
  total_size: number
  total_images: number

  featured_files: number
}

const FileManagement: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([])
  const [stats, setStats] = useState<FileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMediaType, setSelectedMediaType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [showUpload, setShowUpload] = useState(false)

  // Carregar arquivos
  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await apiService.getFiles(selectedMediaType, currentPage, 20)
      setFiles(response.files)

      setError(null)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const response = await apiService.getFileStats()
      setStats(response.stats)
    } catch (error: any) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadFiles()
    loadStats()
  }, [selectedMediaType, currentPage])

  // Deletar arquivo
  const handleDeleteFile = async (fileId: number) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) {
      return
    }

    try {
      await apiService.deleteFile(fileId)
      setFiles(prev => prev.filter(f => f.id !== fileId))
      loadStats() // Recarregar estatísticas
    } catch (error: any) {
      alert(`Erro ao deletar arquivo: ${error.message}`)
    }
  }

  // Upload bem-sucedido
  const handleUploadSuccess = (_uploadedFiles: any[]) => {
    setShowUpload(false)
    loadFiles() // Recarregar lista
    loadStats() // Recarregar estatísticas
  }

  // Upload com erro
  const handleUploadError = (error: string) => {
    alert(`Erro no upload: ${error}`)
  }

  // Filtrar arquivos por busca
  const filteredFiles = files.filter(file =>
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('video/')) return Video
    return File
  }

  const getViewUrl = (fileId: number) => {
    return `${import.meta.env.VITE_API_URL}/files/${fileId}/view`
  }

  const getDownloadUrl = (fileId: number) => {
    return `${import.meta.env.VITE_API_URL}/files/${fileId}/download`
  }

  const handleAddNew = () => {
    setShowUpload(true)
  }

  const filterOptions = [
    { value: 'all', label: 'Todos os Tipos' },
    { value: 'news', label: 'Notícias' },
    { value: 'gallery', label: 'Galeria' },
    
    { value: 'thumbnails', label: 'Thumbnails' }
  ]

  return (
    <PageLayout
      title="Gestão de Arquivos"
      subtitle="Faça upload e gerencie imagens e vídeos do sistema"
      showAddButton={true}
      onAddClick={handleAddNew}
      addButtonLabel="Novo Upload"
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

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card delay={0.1} className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-metal-orange/20 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-metal-orange" />
              </div>
              <div>
                <p className="text-2xl font-bold text-metal-text">
                  {stats.total_files}
                </p>
                <p className="text-sm text-metal-text-secondary">Total de Arquivos</p>
              </div>
            </div>
          </Card>

          <Card delay={0.2} className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-metal-accent/20 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-metal-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-metal-text">
                  {formatFileSize(stats.total_size)}
                </p>
                <p className="text-sm text-metal-text-secondary">Tamanho Total</p>
              </div>
            </div>
          </Card>

          <Card delay={0.3} className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Image className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-metal-text">
                  {stats.total_images}
                </p>
                <p className="text-sm text-metal-text-secondary">Imagens</p>
              </div>
            </div>
          </Card>



          <Card delay={0.5} className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-metal-text">
                  {stats.featured_files}
                </p>
                <p className="text-sm text-metal-text-secondary">Em Destaque</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filtros e Busca */}
      <SearchFilters
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar arquivos..."
        filterOptions={filterOptions}
        filterValue={selectedMediaType}
        onFilterChange={(value) => {
          setSelectedMediaType(value)
          setCurrentPage(1)
        }}
        filterPlaceholder="Filtrar por tipo"
      />

      {/* Lista de Arquivos */}
      <div className="bg-metal-card rounded-lg border border-metal-light-gray/20 overflow-hidden">
        <div className="p-6 border-b border-metal-light-gray/20">
          <h3 className="text-lg font-semibold text-metal-text">Arquivos</h3>
        </div>
        
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <File className="w-16 h-16 text-metal-text-secondary mx-auto mb-4" />
            <p className="text-metal-text-secondary">Nenhum arquivo encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-metal-light-gray/20">
            {filteredFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.mime_type)
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-metal-gray/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-metal-gray rounded-lg flex items-center justify-center">
                        <FileIcon className="w-6 h-6 text-metal-orange" />
                      </div>
                      <div>
                        <h4 className="font-medium text-metal-text">{file.original_name}</h4>
                        <p className="text-sm text-metal-text-secondary">
                          {formatFileSize(file.size)} • {file.mime_type}
                        </p>
                        <p className="text-xs text-metal-text-secondary">
                          {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={getViewUrl(file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-metal-text-secondary hover:text-metal-orange transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <a
                        href={getDownloadUrl(file.id)}
                        className="p-2 text-metal-text-secondary hover:text-metal-accent transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteFile(file.id)}
                        className="p-2 text-metal-text-secondary hover:text-metal-red transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload de Arquivos"
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-metal-text mb-2">Imagens para Notícias</h3>
            <FileUpload
              mediaType="news"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              maxFiles={5}
            />
          </div>
          <div>
            <h3 className="text-md font-medium text-metal-text mb-2">Galeria de Imagens</h3>
            <FileUpload
              mediaType="gallery"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              maxFiles={10}
            />
          </div>
          <div>
            <h3 className="text-md font-medium text-metal-text mb-2">Vídeos</h3>
            <FileUpload
              mediaType="gallery"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              maxFiles={3}
            />
          </div>
          <div>
            <h3 className="text-md font-medium text-metal-text mb-2">Thumbnails</h3>
            <FileUpload
              mediaType="thumbnails"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              maxFiles={5}
            />
          </div>
        </div>
      </Modal>
    </PageLayout>
  )
}

export default FileManagement 