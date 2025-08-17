const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')
// Usar https nativo do Node.js em vez de node-fetch
const https = require('https')
const http = require('http')

// Função para validar URL de imagem usando módulos nativos do Node.js
const validateImageUrl = (imageUrl) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || imageUrl.trim() === '') {
      resolve(true)
      return
    }
    
    try {
      // Verificar se é HTTPS
      if (!imageUrl.startsWith('https://')) {
        reject(new Error('URL da imagem deve usar HTTPS'))
        return
      }
      
      // Verificar se não é data URI (segurança)
      if (imageUrl.startsWith('data:')) {
        reject(new Error('Data URIs não são permitidos por segurança'))
        return
      }
      
      // Verificar se a imagem existe (HEAD request)
      const url = new URL(imageUrl)
      const options = {
        method: 'HEAD',
        timeout: 5000
      }
      
      const request = https.request(url, options, (response) => {
        // Verificar Content-Type
        const contentType = response.headers['content-type']
        if (!contentType || !contentType.startsWith('image/')) {
          reject(new Error('URL não aponta para uma imagem válida'))
          return
        }
        
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(true)
        } else {
          reject(new Error('Imagem não encontrada ou inacessível'))
        }
      })
      
      request.on('error', (error) => {
        reject(new Error('Erro ao validar URL da imagem'))
      })
      
      request.on('timeout', () => {
        request.destroy()
        reject(new Error('Timeout ao validar URL da imagem'))
      })
      
      request.end()
    } catch (error) {
      reject(error)
    }
  })
}

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors.array() 
    })
  }
  next()
}

// GET /api/bandas - Lista pública (paginada)
router.get('/', async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const featured = req.query.featured === '1'
    const offset = (page - 1) * limit

    let whereClause = ''
    let params = []

    if (featured) {
      whereClause = 'WHERE featured = 1'
    }

    // Query para contar total
    const countQuery = `SELECT COUNT(*) as total FROM bandas_cena ${whereClause}`
    const countResult = await db.get(countQuery, params)
    const total = countResult.total

    // Query para buscar dados
    const dataQuery = `
      SELECT id, name, slug, description, official_url, image_url, genre_tags, featured, created_at
      FROM bandas_cena 
      ${whereClause}
      ORDER BY featured DESC, name ASC
      LIMIT ? OFFSET ?
    `
    
    const bandas = await db.all(dataQuery, [...params, limit, offset])

    res.json({
      data: bandas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar bandas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/bandas/:id - Detalhe por ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { id } = req.params
    
    const banda = await db.get(`
      SELECT id, name, slug, description, official_url, image_url, genre_tags, featured, created_at
      FROM bandas_cena 
      WHERE id = ?
    `, [id])

    if (!banda) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    res.json(banda)
  } catch (error) {
    console.error('Erro ao buscar banda por ID:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/bandas/slug/:slug - Detalhe por slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { slug } = req.params
    
    const banda = await db.get(`
      SELECT id, name, slug, description, official_url, image_url, genre_tags, featured, created_at
      FROM bandas_cena 
      WHERE slug = ?
    `, [slug])

    if (!banda) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    res.json(banda)
  } catch (error) {
    console.error('Erro ao buscar banda por slug:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/bandas - Criar nova banda (ADMIN)
router.post('/', [
  authenticateToken,
  body('nome')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .escape(),
  body('slug')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug deve conter apenas letras minúsculas, números e hífens')
    .escape(),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres')
    .escape(),
  body('official_url')
    .optional()
    .isURL()
    .withMessage('URL oficial deve ser uma URL válida')
    .escape(),
  body('image_url')
    .optional()
    .custom(async (value) => {
      if (value && value.trim() !== '') {
        return await validateImageUrl(value)
      }
      return true
    }),
  body('genero_tags')
    .optional()
    .isJSON()
    .withMessage('Tags de gênero devem ser um JSON válido'),
  body('destaque')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser um valor booleano'),
  validate
], async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { nome, slug, descricao, official_url, image_url, genero_tags, destaque } = req.body

    // Verificar se slug já existe
    const existingBanda = await db.get('SELECT id FROM bandas_cena WHERE slug = ?', [slug])
    if (existingBanda) {
      return res.status(409).json({ error: 'Slug já existe' })
    }

    // Inserir nova banda
    const result = await db.run(`
      INSERT INTO bandas_cena (name, slug, description, official_url, image_url, genre_tags, featured, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now','localtime'))
    `, [nome, slug, descricao || null, official_url || null, image_url || null, genero_tags || null, destaque ? 1 : 0])

    // Buscar banda criada
    const novaBanda = await db.get('SELECT * FROM bandas_cena WHERE id = ?', [result.lastID])

    res.status(201).json({
      message: 'Banda criada com sucesso',
      data: novaBanda
    })
  } catch (error) {
    console.error('Erro ao criar banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// PUT /api/bandas/:id - Atualizar banda (ADMIN)
router.put('/:id', [
  authenticateToken,
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .escape(),
  body('slug')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug deve conter apenas letras minúsculas, números e hífens')
    .escape(),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres')
    .escape(),
  body('official_url')
    .optional()
    .isURL()
    .withMessage('URL oficial deve ser uma URL válida')
    .escape(),
  body('image_url')
    .optional()
    .custom(async (value) => {
      if (value && value.trim() !== '') {
        return await validateImageUrl(value)
      }
      return true
    }),
  body('genero_tags')
    .optional()
    .isJSON()
    .withMessage('Tags de gênero devem ser um JSON válido'),
  body('destaque')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser um valor booleano'),
  validate
], async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { id } = req.params
    const { nome, slug, descricao, official_url, image_url, genero_tags, destaque } = req.body

    // Verificar se banda existe
    const existingBanda = await db.get('SELECT id FROM bandas_cena WHERE id = ?', [id])
    if (!existingBanda) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    // Se slug foi alterado, verificar se já existe
    if (slug) {
      const slugExists = await db.get('SELECT id FROM bandas_cena WHERE slug = ? AND id != ?', [slug, id])
      if (slugExists) {
        return res.status(409).json({ error: 'Slug já existe' })
      }
    }

    // Construir query de atualização dinamicamente
    const updates = []
    const params = []
    
    if (nome !== undefined) { updates.push('name = ?'); params.push(nome) }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug) }
    if (descricao !== undefined) { updates.push('description = ?'); params.push(descricao) }
    if (official_url !== undefined) { updates.push('official_url = ?'); params.push(official_url) }
    if (image_url !== undefined) { updates.push('image_url = ?'); params.push(image_url) }
    if (genero_tags !== undefined) { updates.push('genre_tags = ?'); params.push(genero_tags) }
    if (destaque !== undefined) { updates.push('featured = ?'); params.push(destaque ? 1 : 0) }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' })
    }

    params.push(id)
    const updateQuery = `UPDATE bandas_cena SET ${updates.join(', ')} WHERE id = ?`
    
    await db.run(updateQuery, params)

    // Buscar banda atualizada
    const bandaAtualizada = await db.get('SELECT * FROM bandas_cena WHERE id = ?', [id])

    res.json({
      message: 'Banda atualizada com sucesso',
      data: bandaAtualizada
    })
  } catch (error) {
    console.error('Erro ao atualizar banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// DELETE /api/bandas/:id - Excluir banda (ADMIN)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { id } = req.params

    // Verificar se banda existe
    const existingBanda = await db.get('SELECT id, name FROM bandas_cena WHERE id = ?', [id])
    if (!existingBanda) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    // Excluir banda
    await db.run('DELETE FROM bandas_cena WHERE id = ?', [id])

    res.json({
      message: 'Banda excluída com sucesso',
      data: { id, nome: existingBanda.name }
    })
  } catch (error) {
    console.error('Erro ao excluir banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router
