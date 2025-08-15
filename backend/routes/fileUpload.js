const express = require('express')
const path = require('path')
const fs = require('fs')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../middleware/auth')
const { upload, processImage, processVideo, handleUploadError } = require('../middleware/fileUpload')
const { 
  getFullPath, 
  fileExists, 
  deleteFile, 
  getFileInfo,
  getMediaConfig 
} = require('../config/fileUpload')
const Database = require('../../database/database')

const router = express.Router()
const db = new Database()

// Middleware para inicializar banco
router.use(async (req, res, next) => {
  try {
    await db.init()
    next()
  } catch (error) {
    console.error('Erro ao inicializar banco:', error)
    res.status(500).json({ success: false, message: 'Erro interno do servidor' })
  }
})

// Upload de arquivos por tipo de mídia
router.post('/upload/:mediaType', 
  authenticateToken,
  [
    body('alt_text').optional().isString().trim().isLength({ max: 255 }),
    body('description').optional().isString().trim().isLength({ max: 1000 }),
    body('tags').optional().isArray(),
    body('is_featured').optional().isBoolean()
  ],
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados inválidos',
        errors: errors.array() 
      })
    }
    next()
  },
  upload.array('files', 10),
  (req, res, next) => {
    const mediaType = req.params.mediaType
    const config = getMediaConfig(mediaType)
    
    if (!config) {
      return res.status(400).json({
        success: false,
        message: `Tipo de mídia inválido: ${mediaType}`
      })
    }

    // Processar baseado no tipo de mídia
    if (config.allowedTypes.some(type => type.startsWith('image/'))) {
      return processImage(req, res, next)
    } else if (config.allowedTypes.some(type => type.startsWith('video/'))) {
      return processVideo(req, res, next)
    }
    
    next()
  },
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo enviado'
        })
      }

      const mediaType = req.params.mediaType
      const uploadedFiles = []

      for (const file of req.files) {
        const fileData = {
          filename: file.filename,
          original_name: file.originalname,
          mime_type: file.mimetype,
          size: file.size,
          path: path.join(mediaType, file.filename),
          alt_text: req.body.alt_text || '',
          created_at: new Date().toISOString()
        }

        // Inserir no banco de dados
        const result = await db.run(
          `INSERT INTO images (filename, original_name, mime_type, size, path, alt_text, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            fileData.filename,
            fileData.original_name,
            fileData.mime_type,
            fileData.size,
            fileData.path,
            fileData.alt_text,
            fileData.created_at
          ]
        )

        fileData.id = result.lastID
        uploadedFiles.push(fileData)
      }

      res.status(201).json({
        success: true,
        message: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso`,
        files: uploadedFiles
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  },
  handleUploadError
)

// Listar arquivos por tipo
router.get('/files/:mediaType', 
  authenticateToken,
  async (req, res) => {
    try {
      const mediaType = req.params.mediaType
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20
      const offset = (page - 1) * limit

      let query = ''
      let params = []

      if (mediaType === 'all') {
        query = `SELECT * FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?`
        params = [limit, offset]
      } else {
        query = `SELECT * FROM images WHERE path LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
        params = [`${mediaType}%`, limit, offset]
      }

      const files = await db.all(query, params)
      const totalQuery = mediaType === 'all' 
        ? 'SELECT COUNT(*) as count FROM images'
        : 'SELECT COUNT(*) as count FROM images WHERE path LIKE ?'
      const totalParams = mediaType === 'all' ? [] : [`${mediaType}%`]
      const totalResult = await db.get(totalQuery, totalParams)

      res.json({
        success: true,
        files: files,
        pagination: {
          page,
          limit,
          total: totalResult.count,
          pages: Math.ceil(totalResult.count / limit)
        }
      })

    } catch (error) {
      console.error('Erro ao listar arquivos:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

// Download de arquivo
router.get('/download/:id', 
  async (req, res) => {
    try {
      const fileId = req.params.id
      
      const file = await db.get('SELECT * FROM images WHERE id = ?', [fileId])
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado'
        })
      }

      const filePath = getFullPath(file.path)
      
      if (!fileExists(file.path)) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado no sistema'
        })
      }

      res.download(filePath, file.original_name)

    } catch (error) {
      console.error('Erro no download:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

// Visualizar arquivo (servir como imagem/vídeo)
router.get('/view/:id', 
  async (req, res) => {
    try {
      const fileId = req.params.id
      
      const file = await db.get('SELECT * FROM images WHERE id = ?', [fileId])
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado'
        })
      }

      const filePath = getFullPath(file.path)
      
      if (!fileExists(file.path)) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado no sistema'
        })
      }

      res.setHeader('Content-Type', file.mime_type)
      res.setHeader('Content-Disposition', 'inline')
      
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(res)

    } catch (error) {
      console.error('Erro ao visualizar arquivo:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

// Atualizar informações do arquivo
router.put('/files/:id', 
  authenticateToken,
  [
    body('alt_text').optional().isString().trim().isLength({ max: 255 }),
    body('description').optional().isString().trim().isLength({ max: 1000 }),
    body('is_featured').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          message: 'Dados inválidos',
          errors: errors.array() 
        })
      }

      const fileId = req.params.id
      const { alt_text, description, is_featured } = req.body

      const file = await db.get('SELECT * FROM images WHERE id = ?', [fileId])
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado'
        })
      }

      const updateFields = []
      const updateValues = []

      if (alt_text !== undefined) {
        updateFields.push('alt_text = ?')
        updateValues.push(alt_text)
      }

      if (description !== undefined) {
        updateFields.push('description = ?')
        updateValues.push(description)
      }

      if (is_featured !== undefined) {
        updateFields.push('is_featured = ?')
        updateValues.push(is_featured ? 1 : 0)
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum campo para atualizar'
        })
      }

      updateFields.push('updated_at = CURRENT_TIMESTAMP')
      updateValues.push(fileId)

      const query = `UPDATE images SET ${updateFields.join(', ')} WHERE id = ?`
      await db.run(query, updateValues)

      const updatedFile = await db.get('SELECT * FROM images WHERE id = ?', [fileId])

      res.json({
        success: true,
        message: 'Arquivo atualizado com sucesso',
        file: updatedFile
      })

    } catch (error) {
      console.error('Erro ao atualizar arquivo:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

// Excluir arquivo
router.delete('/files/:id', 
  authenticateToken,
  async (req, res) => {
    try {
      const fileId = req.params.id
      
      const file = await db.get('SELECT * FROM images WHERE id = ?', [fileId])
      
      if (!file) {
        return res.status(404).json({
          success: false,
          message: 'Arquivo não encontrado'
        })
      }

      // Deletar arquivo físico
      const deleted = deleteFile(file.path)
      
      if (!deleted) {
        console.warn(`Arquivo físico não encontrado: ${file.path}`)
      }

      // Deletar do banco
      await db.run('DELETE FROM images WHERE id = ?', [fileId])

      res.json({
        success: true,
        message: 'Arquivo excluído com sucesso'
      })

    } catch (error) {
      console.error('Erro ao excluir arquivo:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

// Estatísticas de arquivos
router.get('/stats', 
  authenticateToken,
  async (req, res) => {
    try {
      const stats = await db.get(`
        SELECT 
          COUNT(*) as total_files,
          SUM(size) as total_size,
          COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as total_images,
  
          COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_files
        FROM images
      `)

      const recentFiles = await db.all(`
        SELECT filename, original_name, mime_type, size, created_at 
        FROM images 
        ORDER BY created_at DESC 
        LIMIT 5
      `)

      res.json({
        success: true,
        stats: {
          total_files: stats.total_files || 0,
          total_size: stats.total_size || 0,
          total_images: stats.total_images || 0,
  
          featured_files: stats.featured_files || 0
        },
        recent_files: recentFiles
      })

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      res.status(500).json({
        success: false,
        message: 'Erro interno no servidor'
      })
    }
  }
)

module.exports = router 