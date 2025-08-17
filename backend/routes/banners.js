const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

// Função para obter a instância do banco de dados
const getDatabase = () => {
  const Database = require('../../database/database')
  return new Database()
}

// Função para validar URL de imagem
const validateImageUrl = async (imageUrl) => {
  // 1. Verificar se é HTTPS
  if (!imageUrl.startsWith('https://')) {
    throw new Error('URL da imagem deve usar HTTPS')
  }

  // 2. Verificar se não é data URI (segurança)
  if (imageUrl.startsWith('data:')) {
    throw new Error('Data URIs não são permitidos por segurança')
  }

  // 3. Verificar domínios permitidos (opcional)
  const allowedDomains = ['images.unsplash.com', 'm.media-amazon.com', 'blogger.googleusercontent.com', 'trilhadomedo.com', 'mubicdn.net']
  const url = new URL(imageUrl)
  if (!allowedDomains.includes(url.hostname)) {
    console.warn(`Domínio não verificado: ${url.hostname}`)
  }

  // 4. Verificar se a imagem existe (HEAD request)
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    if (!response.ok) {
      throw new Error('Imagem não encontrada ou inacessível')
    }

    // 5. Verificar Content-Type
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error('URL não aponta para uma imagem válida')
    }

    // 6. Verificar tamanho (opcional)
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      throw new Error('Imagem muito grande (máximo 5MB)')
    }

    return true
  } catch (error) {
    if (error.message.includes('fetch')) {
      throw new Error('Erro ao validar URL da imagem')
    }
    throw error
  }
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

// GET /api/banners - Listar banners por localização (público) ou todos (admin)
router.get('/', async (req, res) => {
  const db = getDatabase()
  try {
    const { location, limit, active } = req.query
    
    await db.init()
    
    // Se location for especificado, buscar banners por localização (público)
    if (location) {
      let query = `
        SELECT * FROM banners
        WHERE active = 1
          AND (start_at IS NULL OR datetime('now') >= start_at)
          AND (end_at IS NULL OR datetime('now') <= end_at)
          AND (locations IS NULL OR locations LIKE ?)
        ORDER BY priority DESC, created_at DESC
      `
      
      const params = [`%${location}%`]
      
      if (limit) {
        query += ` LIMIT ?`
        params.push(parseInt(limit))
      }
      
      const banners = await db.all(query, params)
      
      // Incrementar impressões para todos os banners retornados
      for (const banner of banners) {
        await db.run(
          'UPDATE banners SET impressions = impressions + 1 WHERE id = ?',
          [banner.id]
        )
      }
      
      res.json({ 
        data: banners,
        total: banners.length,
        location: location,
        timestamp: new Date().toISOString()
      })
      return
    }
    
    // Se não houver location, verificar se é admin (requer autenticação)
    if (!req.headers.authorization) {
      return res.status(401).json({ error: 'Acesso negado' })
    }
    
    // Verificar token (simplificado - em produção usar middleware)
    try {
      const token = req.headers.authorization.replace('Bearer ', '')
      // Aqui você pode verificar o token se necessário
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    
    // Listar todos os banners (admin)
    const banners = await db.all(`
      SELECT * FROM banners 
      ORDER BY priority DESC, created_at DESC
    `)
    
    res.json({ 
      data: banners,
      total: banners.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro ao buscar banners:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    await db.close()
  }
})

// GET /api/banners/:location - Buscar banner ativo por localização (público)
router.get('/:location', async (req, res) => {
  const db = getDatabase()
  try {
    const { location } = req.params
    
    await db.init()
    const banner = await db.get(`
      SELECT * FROM banners
      WHERE active = 1
        AND datetime('now') >= start_at
        AND datetime('now') <= end_at
        AND locations LIKE ?
      ORDER BY priority DESC, created_at DESC
      LIMIT 1
    `, [`%${location}%`])
    
    if (banner) {
      // Incrementar impressões
      await db.run(
        'UPDATE banners SET impressions = impressions + 1 WHERE id = ?',
        [banner.id]
      )
      res.json(banner)
    } else {
      res.json(null)
    }
  } catch (error) {
    console.error('Erro ao buscar banner:', error)
    res.status(500).json({ error: 'Erro ao buscar banner' })
  } finally {
    await db.close()
  }
})

// POST /api/banners - Criar novo banner (admin)
router.post('/', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Título é obrigatório e deve ter no máximo 255 caracteres'),
  body('image_url')
    .isURL()
    .withMessage('URL da imagem deve ser válida'),
  body('target_url')
    .optional()
    .isURL()
    .withMessage('URL de destino deve ser válida'),
  body('start_at')
    .isISO8601()
    .withMessage('Data de início deve ser válida'),
  body('end_at')
    .isISO8601()
    .withMessage('Data de fim deve ser válida'),
  body('priority')
    .isInt({ min: 1, max: 10 })
    .withMessage('Prioridade deve estar entre 1 e 10'),
  body('locations')
    .isArray()
    .notEmpty()
    .withMessage('Locais devem ser um array não vazio'),
  body('active')
    .isBoolean()
    .withMessage('Status ativo deve ser booleano')
], validate, async (req, res) => {
  const db = getDatabase()
  try {
    const { title, image_url, target_url, start_at, end_at, priority, locations, active } = req.body
    
    // Validar URL da imagem
    await validateImageUrl(image_url)
    
    // Validar datas
    if (new Date(start_at) >= new Date(end_at)) {
      return res.status(400).json({ error: 'Data de início deve ser anterior à data de fim' })
    }
    
    await db.init()
    
    const result = await db.run(`
      INSERT INTO banners (title, image_url, target_url, start_at, end_at, priority, locations, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, image_url, target_url, start_at, end_at, priority, JSON.stringify(locations), active])
    
    const newBanner = await db.get('SELECT * FROM banners WHERE id = ?', [result.id])
    
    res.status(201).json({ 
      message: 'Banner criado com sucesso',
      banner: newBanner
    })
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    res.status(400).json({ error: error.message })
  } finally {
    await db.close()
  }
})

// PUT /api/banners/:id - Atualizar banner (admin)
router.put('/:id', authenticateToken, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Título é obrigatório e deve ter no máximo 255 caracteres'),
  body('image_url')
    .isURL()
    .withMessage('URL da imagem deve ser válida'),
  body('target_url')
    .optional()
    .isURL()
    .withMessage('URL de destino deve ser válida'),
  body('start_at')
    .isISO8601()
    .withMessage('Data de início deve ser válida'),
  body('end_at')
    .isISO8601()
    .withMessage('Data de fim deve ser válida'),
  body('priority')
    .isInt({ min: 1, max: 10 })
    .withMessage('Prioridade deve estar entre 1 e 10'),
  body('locations')
    .isArray()
    .notEmpty()
    .withMessage('Locais devem ser um array não vazio'),
  body('active')
    .isBoolean()
    .withMessage('Status ativo deve ser booleano')
], validate, async (req, res) => {
  const db = getDatabase()
  try {
    const { id } = req.params
    const { title, image_url, target_url, start_at, end_at, priority, locations, active } = req.body
    
    // Validar URL da imagem
    await validateImageUrl(image_url)
    
    // Validar datas
    if (new Date(start_at) >= new Date(end_at)) {
      return res.status(400).json({ error: 'Data de início deve ser anterior à data de fim' })
    }
    
    await db.init()
    
    // Verificar se banner existe
    const existingBanner = await db.get('SELECT * FROM banners WHERE id = ?', [id])
    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner não encontrado' })
    }
    
    await db.run(`
      UPDATE banners 
      SET title = ?, image_url = ?, target_url = ?, start_at = ?, end_at = ?, 
          priority = ?, locations = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, image_url, target_url, start_at, end_at, priority, JSON.stringify(locations), active, id])
    
    const updatedBanner = await db.get('SELECT * FROM banners WHERE id = ?', [id])
    
    res.json({ 
      message: 'Banner atualizado com sucesso',
      banner: updatedBanner
    })
  } catch (error) {
    console.error('Erro ao atualizar banner:', error)
    res.status(400).json({ error: error.message })
  } finally {
    await db.close()
  }
})

// DELETE /api/banners/:id - Deletar banner (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  const db = getDatabase()
  try {
    const { id } = req.params
    
    await db.init()
    
    // Verificar se banner existe
    const existingBanner = await db.get('SELECT * FROM banners WHERE id = ?', [id])
    if (!existingBanner) {
      return res.status(404).json({ error: 'Banner não encontrado' })
    }
    
    await db.run('DELETE FROM banners WHERE id = ?', [id])
    
    res.json({ message: 'Banner deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar banner:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    await db.close()
  }
})

// POST /api/banners/:id/click - Registrar clique no banner
router.post('/:id/click', async (req, res) => {
  const db = getDatabase()
  try {
    const { id } = req.params
    
    await db.init()
    
    await db.run(
      'UPDATE banners SET clicks = clicks + 1 WHERE id = ?',
      [id]
    )
    
    res.json({ message: 'Clique registrado com sucesso' })
  } catch (error) {
    console.error('Erro ao registrar clique:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  } finally {
    await db.close()
  }
})

// POST /api/admin/validate-image - Validar URL de imagem (admin)
router.post('/admin/validate-image', authenticateToken, async (req, res) => {
  try {
    const { image_url } = req.body
    
    if (!image_url) {
      return res.status(400).json({ error: 'URL da imagem é obrigatória' })
    }
    
    await validateImageUrl(image_url)
    
    res.json({ 
      valid: true, 
      message: 'Imagem válida', 
      url: image_url 
    })
  } catch (error) {
    res.status(400).json({ 
      valid: false, 
      error: error.message 
    })
  }
})

module.exports = router
