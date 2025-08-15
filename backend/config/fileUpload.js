const path = require('path')
const fs = require('fs')

// Configurações de upload
const UPLOAD_CONFIG = {
  // Diretórios base
  baseDir: path.join(__dirname, '../uploads'),
  
  // Tipos de mídia e suas pastas
  mediaTypes: {
    news: {
      folder: 'news',
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 85
    },
    gallery: {
      folder: 'gallery',
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      maxSize: 10 * 1024 * 1024, // 10MB
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 90
    },

    thumbnails: {
      folder: 'thumbnails',
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      maxSize: 2 * 1024 * 1024, // 2MB
      maxWidth: 400,
      maxHeight: 300,
      quality: 80
    }
  },

  // Configurações gerais
  general: {
    maxFiles: 10, // Máximo de arquivos por upload
    preserveOriginal: false, // Não preservar arquivo original após processamento
    generateThumbnails: true, // Gerar thumbnails automaticamente
    backupOriginal: true // Fazer backup do original
  },

  // Configurações de segurança
  security: {
    scanForViruses: false, // Implementar scanner de vírus no futuro
    validateFileContent: true, // Validar conteúdo do arquivo
    blockExecutables: true, // Bloquear arquivos executáveis
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp4', '.webm', '.ogg', '.avi']
  }
}

// Função para criar estrutura de pastas
function createUploadDirectories() {
  const dirs = [
    UPLOAD_CONFIG.baseDir,
    path.join(UPLOAD_CONFIG.baseDir, 'news'),
    path.join(UPLOAD_CONFIG.baseDir, 'gallery'),

    path.join(UPLOAD_CONFIG.baseDir, 'thumbnails'),
    path.join(UPLOAD_CONFIG.baseDir, 'temp'),
    path.join(UPLOAD_CONFIG.baseDir, 'backup')
  ]

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
      console.log(`📁 Diretório criado: ${dir}`)
    }
  })
}

// Função para validar tipo de arquivo
function validateFileType(file, mediaType) {
  const config = UPLOAD_CONFIG.mediaTypes[mediaType]
  if (!config) {
    throw new Error(`Tipo de mídia inválido: ${mediaType}`)
  }

  const isValidType = config.allowedTypes.includes(file.mimetype)
  const isValidExtension = UPLOAD_CONFIG.security.allowedExtensions.some(ext => 
    file.originalname.toLowerCase().endsWith(ext)
  )

  if (!isValidType || !isValidExtension) {
    throw new Error(`Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(', ')}`)
  }

  return true
}

// Função para validar tamanho do arquivo
function validateFileSize(file, mediaType) {
  const config = UPLOAD_CONFIG.mediaTypes[mediaType]
  if (!config) {
    throw new Error(`Tipo de mídia inválido: ${mediaType}`)
  }

  if (file.size > config.maxSize) {
    const maxSizeMB = config.maxSize / (1024 * 1024)
    throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`)
  }

  return true
}

// Função para gerar nome único de arquivo
function generateUniqueFilename(originalname, mediaType) {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const extension = path.extname(originalname)
  const filename = `${timestamp}_${randomId}${extension}`
  
  return {
    filename,
    originalname,
    path: path.join(UPLOAD_CONFIG.mediaTypes[mediaType].folder, filename)
  }
}

// Função para obter configuração de mídia
function getMediaConfig(mediaType) {
  return UPLOAD_CONFIG.mediaTypes[mediaType]
}

// Função para obter caminho completo
function getFullPath(relativePath) {
  return path.join(UPLOAD_CONFIG.baseDir, relativePath)
}

// Função para verificar se arquivo existe
function fileExists(filePath) {
  const fullPath = getFullPath(filePath)
  return fs.existsSync(fullPath)
}

// Função para deletar arquivo
function deleteFile(filePath) {
  const fullPath = getFullPath(filePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
    return true
  }
  return false
}

// Função para obter informações do arquivo
function getFileInfo(filePath) {
  const fullPath = getFullPath(filePath)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const stats = fs.statSync(fullPath)
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    path: filePath,
    fullPath
  }
}

module.exports = {
  UPLOAD_CONFIG,
  createUploadDirectories,
  validateFileType,
  validateFileSize,
  generateUniqueFilename,
  getMediaConfig,
  getFullPath,
  fileExists,
  deleteFile,
  getFileInfo
} 