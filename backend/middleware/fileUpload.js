const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const {
  UPLOAD_CONFIG,
  createUploadDirectories,
  validateFileType,
  validateFileSize,
  generateUniqueFilename,
  getMediaConfig,
  getFullPath
} = require('../config/fileUpload')

// Criar diretórios de upload na inicialização
createUploadDirectories()

// Configuração do storage do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const mediaType = req.params.mediaType || 'gallery'
    const config = getMediaConfig(mediaType)
    
    if (!config) {
      return cb(new Error(`Tipo de mídia inválido: ${mediaType}`))
    }

    const uploadPath = path.join(UPLOAD_CONFIG.baseDir, config.folder)
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const mediaType = req.params.mediaType || 'gallery'
    const { filename } = generateUniqueFilename(file.originalname, mediaType)
    cb(null, filename)
  }
})

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  try {
    const mediaType = req.params.mediaType || 'gallery'
    
    // Validar tipo de arquivo
    validateFileType(file, mediaType)
    
    // Validar tamanho do arquivo
    validateFileSize(file, mediaType)
    
    // Verificar se é arquivo executável (segurança)
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js']
    const fileExtension = path.extname(file.originalname).toLowerCase()
    
    if (dangerousExtensions.includes(fileExtension)) {
      return cb(new Error('Arquivos executáveis não são permitidos'), false)
    }
    
    cb(null, true)
  } catch (error) {
    cb(error, false)
  }
}

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB máximo geral
    files: UPLOAD_CONFIG.general.maxFiles
  }
})

// Middleware para processar imagens após upload
const processImage = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next()
  }

  const mediaType = req.params.mediaType || 'gallery'
  const config = getMediaConfig(mediaType)
  
  if (!config || !config.allowedTypes.some(type => type.startsWith('image/'))) {
    return next()
  }

  try {
    const processedFiles = []

    for (const file of req.files) {
      const fileInfo = {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      }

      // Processar imagem com Sharp
      const imageBuffer = fs.readFileSync(file.path)
      const image = sharp(imageBuffer)
      const metadata = await image.metadata()

      // Redimensionar se necessário
      let processedImage = image
      if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
        processedImage = image.resize(config.maxWidth, config.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
      }

      // Otimizar qualidade
      const outputFormat = path.extname(file.filename).toLowerCase()
      let processedBuffer

      switch (outputFormat) {
        case '.jpg':
        case '.jpeg':
          processedBuffer = await processedImage
            .jpeg({ quality: config.quality, progressive: true })
            .toBuffer()
          break
        case '.png':
          processedBuffer = await processedImage
            .png({ quality: config.quality, progressive: true })
            .toBuffer()
          break
        case '.webp':
          processedBuffer = await processedImage
            .webp({ quality: config.quality })
            .toBuffer()
          break
        default:
          processedBuffer = await processedImage.toBuffer()
      }

      // Salvar arquivo processado
      fs.writeFileSync(file.path, processedBuffer)
      
      // Atualizar informações do arquivo
      fileInfo.size = processedBuffer.length
      fileInfo.processed = true
      fileInfo.originalWidth = metadata.width
      fileInfo.originalHeight = metadata.height

      // Gerar thumbnail se configurado
      if (UPLOAD_CONFIG.general.generateThumbnails && mediaType !== 'thumbnails') {
        const thumbnailConfig = getMediaConfig('thumbnails')
        const thumbnailFilename = `thumb_${file.filename}`
        const thumbnailPath = path.join(UPLOAD_CONFIG.baseDir, 'thumbnails', thumbnailFilename)
        
        const thumbnailBuffer = await sharp(imageBuffer)
          .resize(thumbnailConfig.maxWidth, thumbnailConfig.maxHeight, {
            fit: 'cover',
            position: 'center'
          })
          .jpeg({ quality: thumbnailConfig.quality })
          .toBuffer()

        fs.writeFileSync(thumbnailPath, thumbnailBuffer)
        
        fileInfo.thumbnail = {
          filename: thumbnailFilename,
          path: path.join('thumbnails', thumbnailFilename),
          size: thumbnailBuffer.length
        }
      }

      processedFiles.push(fileInfo)
    }

    req.processedFiles = processedFiles
    next()
  } catch (error) {
    next(error)
  }
}

// Middleware para processar vídeos
const processVideo = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next()
  }

  const mediaType = req.params.mediaType || 'videos'
  const config = getMediaConfig(mediaType)
  
  if (!config || !config.allowedTypes.some(type => type.startsWith('video/'))) {
    return next()
  }

  try {
    const processedFiles = []

    for (const file of req.files) {
      const fileInfo = {
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        type: 'video'
      }

      // Gerar thumbnail para vídeo
      if (UPLOAD_CONFIG.general.generateThumbnails) {
        const thumbnailConfig = getMediaConfig('thumbnails')
        const thumbnailFilename = `thumb_${path.parse(file.filename).name}.jpg`
        const thumbnailPath = path.join(UPLOAD_CONFIG.baseDir, 'thumbnails', thumbnailFilename)
        
        // TODO: Implementar extração de thumbnail de vídeo
        // Por enquanto, criar um placeholder
        const placeholderBuffer = await sharp({
          create: {
            width: thumbnailConfig.maxWidth,
            height: thumbnailConfig.maxHeight,
            channels: 3,
            background: { r: 100, g: 100, b: 100 }
          }
        })
        .jpeg({ quality: thumbnailConfig.quality })
        .toBuffer()

        fs.writeFileSync(thumbnailPath, placeholderBuffer)
        
        fileInfo.thumbnail = {
          filename: thumbnailFilename,
          path: path.join('thumbnails', thumbnailFilename),
          size: placeholderBuffer.length
        }
      }

      processedFiles.push(fileInfo)
    }

    req.processedFiles = processedFiles
    next()
  } catch (error) {
    next(error)
  }
}

// Middleware de erro para upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande',
        error: error.message
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Muitos arquivos enviados',
        error: error.message
      })
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de arquivo inesperado',
        error: error.message
      })
    }
  }

  if (error.message.includes('Tipo de arquivo não permitido')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }

  if (error.message.includes('Arquivo muito grande')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }

  if (error.message.includes('Arquivos executáveis não são permitidos')) {
    return res.status(400).json({
      success: false,
      message: error.message
    })
  }

  console.error('Erro no upload:', error)
  res.status(500).json({
    success: false,
    message: 'Erro interno no servidor durante upload'
  })
}

module.exports = {
  upload,
  processImage,
  processVideo,
  handleUploadError
} 