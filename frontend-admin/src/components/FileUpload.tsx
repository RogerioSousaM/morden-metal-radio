import React, { useState, useCallback } from 'react'
import { Upload, X, Image, Video, File, CheckCircle, AlertCircle } from 'lucide-react'
import { apiService } from '../services/api'

interface FileUploadProps {
  mediaType: 'news' | 'gallery' | 'thumbnails'
  onUploadSuccess?: (files: any[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  className?: string
}

interface FileInfo {
  id: string
  file: File
  preview?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

const FileUpload: React.FC<FileUploadProps> = ({
  mediaType,
  onUploadSuccess,
  onUploadError,
  maxFiles = 10,
  className = ''
}) => {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Configurações por tipo de mídia
  const getMediaConfig = () => {
    const configs = {
      news: {
        title: 'Imagens para Notícias',
        description: 'JPG, PNG, WebP até 5MB',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 5 * 1024 * 1024
      },
      gallery: {
        title: 'Galeria de Imagens',
        description: 'JPG, PNG, WebP, GIF até 10MB',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
        maxSize: 10 * 1024 * 1024
      },

      thumbnails: {
        title: 'Thumbnails',
        description: 'JPG, PNG, WebP até 2MB',
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxSize: 2 * 1024 * 1024
      }
    }
    return configs[mediaType]
  }

  const config = getMediaConfig()

  // Validar arquivo
  const validateFile = (file: File): string | null => {
    if (!config.allowedTypes.includes(file.type)) {
      return `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(', ')}`
    }

    if (file.size > config.maxSize) {
      const maxSizeMB = config.maxSize / (1024 * 1024)
      return `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`
    }

    return null
  }

  // Adicionar arquivos
  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles)
    const validFiles: FileInfo[] = []

    fileArray.forEach(file => {
      const error = validateFile(file)
      const fileInfo: FileInfo = {
        id: `${Date.now()}_${Math.random()}`,
        file,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined
      }

      // Gerar preview para imagens
      if (file.type.startsWith('image/') && !error) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === fileInfo.id ? { ...f, preview: e.target?.result as string } : f
          ))
        }
        reader.readAsDataURL(file)
      }

      validFiles.push(fileInfo)
    })

    setFiles(prev => {
      const combined = [...prev, ...validFiles]
      return combined.slice(0, maxFiles)
    })
  }, [maxFiles, config])

  // Remover arquivo
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  // Upload de arquivos
  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    if (pendingFiles.length === 0) {
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      pendingFiles.forEach(fileInfo => {
        formData.append('files', fileInfo.file)
      })

      // Adicionar metadados se necessário
      formData.append('alt_text', 'Upload via interface')
      formData.append('is_featured', 'false')

      // Atualizar status para uploading
      setFiles(prev => prev.map(f => 
        pendingFiles.some(pf => pf.id === f.id) 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ))

      const response = await apiService.uploadFiles(mediaType, formData, (progress) => {
        // Atualizar progresso
        setFiles(prev => prev.map(f => 
          pendingFiles.some(pf => pf.id === f.id)
            ? { ...f, progress }
            : f
        ))
      })

      // Atualizar status para success
      setFiles(prev => prev.map(f => 
        pendingFiles.some(pf => pf.id === f.id)
          ? { ...f, status: 'success', progress: 100 }
          : f
      ))

      onUploadSuccess?.(response as any)

    } catch (error: any) {
      console.error('Erro no upload:', error)
      
      // Atualizar status para error
      setFiles(prev => prev.map(f => 
        pendingFiles.some(pf => pf.id === f.id)
          ? { ...f, status: 'error', error: error.message || 'Erro no upload' }
          : f
      ))

      onUploadError?.(error.message || 'Erro no upload')
    } finally {
      setUploading(false)
    }
  }

  // Handlers de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles)
    }
  }, [addFiles])

  // Handler de input file
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      addFiles(selectedFiles)
    }
    e.target.value = '' // Reset input
  }

  const pendingFiles = files.filter(f => f.status === 'pending')
  const hasErrors = files.some(f => f.status === 'error')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de upload */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${files.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {config.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {config.description}
        </p>
        
        <input
          type="file"
          multiple
          accept={config.allowedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          id={`file-input-${mediaType}`}
          disabled={files.length >= maxFiles}
        />
        
        <label
          htmlFor={`file-input-${mediaType}`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          Selecionar Arquivos
        </label>
        
        <p className="text-xs text-gray-400 mt-2">
          Ou arraste e solte arquivos aqui
        </p>
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Arquivos ({files.length}/{maxFiles})
            </h4>
            {pendingFiles.length > 0 && (
              <button
                onClick={uploadFiles}
                disabled={uploading || hasErrors}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Enviando...' : 'Enviar Arquivos'}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {files.map((fileInfo) => (
              <div
                key={fileInfo.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                {/* Ícone do arquivo */}
                <div className="flex-shrink-0 mr-3">
                  {fileInfo.file.type.startsWith('image/') ? (
                    <Image className="h-8 w-8 text-blue-500" />
                  ) : fileInfo.file.type.startsWith('video/') ? (
                    <Video className="h-8 w-8 text-purple-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileInfo.file.name}
                    </p>
                    <button
                      onClick={() => removeFile(fileInfo.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {/* Status */}
                    <div className="flex items-center">
                      {fileInfo.status === 'pending' && (
                        <span className="text-xs text-gray-500">Pendente</span>
                      )}
                      {fileInfo.status === 'uploading' && (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${fileInfo.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-600">{fileInfo.progress}%</span>
                        </div>
                      )}
                      {fileInfo.status === 'success' && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Enviado</span>
                        </div>
                      )}
                      {fileInfo.status === 'error' && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Erro</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview para imagens */}
                  {fileInfo.preview && (
                    <div className="mt-2">
                      <img
                        src={fileInfo.preview}
                        alt={fileInfo.file.name}
                        className="h-16 w-16 object-cover rounded border"
                      />
                    </div>
                  )}

                  {/* Mensagem de erro */}
                  {fileInfo.error && (
                    <p className="text-xs text-red-600 mt-1">{fileInfo.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload 