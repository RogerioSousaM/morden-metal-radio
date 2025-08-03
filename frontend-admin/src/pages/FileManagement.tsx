import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, Video, File, Trash2, Eye, Download, Search, Filter } from 'lucide-react'
import FileUpload from '../components/FileUpload'
import { apiService } from '../services/api'

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
  total_videos: number
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
  const [totalPages, setTotalPages] = useState(1)
  const [showUpload, setShowUpload] = useState(false)

  // Carregar arquivos
  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await apiService.getFiles(selectedMediaType, currentPage, 20)
      setFiles(response.files)
      setTotalPages(response.pagination.pages)
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

  // Formatar tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Obter ícone baseado no tipo de arquivo
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-500" />
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500" />
    } else {
      return <File className="h-6 w-6 text-gray-500" />
    }
  }

  // Obter URL de visualização
  const getViewUrl = (fileId: number) => {
    return `http://localhost:3001/api/files/view/${fileId}`
  }

  // Obter URL de download
  const getDownloadUrl = (fileId: number) => {
    return `http://localhost:3001/api/files/download/${fileId}`
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
              Gestão de Arquivos
            </h1>
            <p className="text-metal-text-secondary">
              Faça upload e gerencie imagens e vídeos
            </p>
          </div>
          <motion.button
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowUpload(!showUpload)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Upload className="w-5 h-5" />
            {showUpload ? 'Fechar Upload' : 'Novo Upload'}
          </motion.button>
        </div>
      </motion.div>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.total_files}</div>
            <div className="text-sm text-gray-600">Total de Arquivos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{formatFileSize(stats.total_size)}</div>
            <div className="text-sm text-gray-600">Tamanho Total</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-500">{stats.total_images}</div>
            <div className="text-sm text-gray-600">Imagens</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-500">{stats.total_videos}</div>
            <div className="text-sm text-gray-600">Vídeos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.featured_files}</div>
            <div className="text-sm text-gray-600">Em Destaque</div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload de Arquivos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Imagens para Notícias</h3>
              <FileUpload
                mediaType="news"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                maxFiles={5}
              />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Galeria de Imagens</h3>
              <FileUpload
                mediaType="gallery"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                maxFiles={10}
              />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Vídeos</h3>
              <FileUpload
                mediaType="videos"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                maxFiles={3}
              />
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">Thumbnails</h3>
              <FileUpload
                mediaType="thumbnails"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                maxFiles={5}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filtro por tipo */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedMediaType}
              onChange={(e) => {
                setSelectedMediaType(e.target.value)
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos os Tipos</option>
              <option value="news">Notícias</option>
              <option value="gallery">Galeria</option>
              <option value="videos">Vídeos</option>
              <option value="thumbnails">Thumbnails</option>
            </select>
          </div>

          {/* Busca */}
          <div className="flex items-center space-x-2 flex-1">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Lista de Arquivos */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando arquivos...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Erro: {error}</p>
            <button
              onClick={loadFiles}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar Novamente
            </button>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-8 text-center">
            <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum arquivo encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arquivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {file.mime_type.startsWith('image/') ? (
                              <img
                                src={getViewUrl(file.id)}
                                alt={file.alt_text || file.original_name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                                {getFileIcon(file.mime_type)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {file.original_name}
                            </div>
                            {file.alt_text && (
                              <div className="text-sm text-gray-500">
                                {file.alt_text}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(file.mime_type)}
                          <span className="ml-2 text-sm text-gray-900">
                            {file.mime_type.split('/')[1].toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(file.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a
                            href={getViewUrl(file.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                          <a
                            href={getDownloadUrl(file.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FileManagement 