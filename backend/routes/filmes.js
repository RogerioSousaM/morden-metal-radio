const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../middleware/auth')

const router = express.Router()

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Erros de validação:', errors.array())
    return res.status(400).json({ 
      error: 'Dados inválidos',
      details: errors.array() 
    })
  }
  next()
}

// GET /api/filmes - Listar todos os filmes (público)
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
      whereClause = 'WHERE indicacao_do_mes = 1'
    }

    // Query para contar total
    const countQuery = `SELECT COUNT(*) as total FROM filmes ${whereClause}`
    const countResult = await db.get(countQuery, params)
    const total = countResult.total

    // Query para buscar dados
    const dataQuery = `
      SELECT id, titulo, descricao, ano, nota, imagem, indicacao_do_mes, created_at
      FROM filmes 
      ${whereClause}
      ORDER BY indicacao_do_mes DESC, created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const filmes = await db.all(dataQuery, [...params, limit, offset])

    res.json({
      filmes: filmes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/filmes/test - Endpoint de teste para debug
router.get('/test', authenticateToken, async (req, res) => {
  res.json({ 
    message: 'API de filmes funcionando',
    user: req.user,
    timestamp: new Date().toISOString()
  })
})

// GET /api/filmes/destaque - Retornar indicação do mês (público)
router.get('/destaque', async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const filme = await db.get(
      "SELECT id, titulo, descricao, ano, nota, imagem, indicacao_do_mes, created_at FROM filmes WHERE indicacao_do_mes = 1 ORDER BY created_at DESC LIMIT 1"
    )
    
    if (!filme) {
      return res.status(404).json({ error: 'Nenhuma indicação do mês encontrada' })
    }
    
    res.json({ filme })
  } catch (error) {
    console.error('Erro ao buscar filme em destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/filmes - Criar novo filme (admin)
router.post('/', authenticateToken, [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título é obrigatório e deve ter no máximo 100 caracteres')
    .escape(),
  body('descricao')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Descrição é obrigatória e deve ter no máximo 300 caracteres')
    .escape(),
  body('ano')
    .isInt({ min: 1900, max: 2099 })
    .withMessage('Ano deve estar entre 1900 e 2099'),
  body('nota')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Nota deve estar entre 0 e 5'),
  body('imagem')
    .optional()
    .custom((value) => {
      if (value && value.trim() !== '') {
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      }
      return true
    })
    .withMessage('URL da imagem deve ser válida'),
  body('indicacao_do_mes')
    .optional()
    .custom((value) => {
      return value === true || value === false || value === 0 || value === 1
    })
    .withMessage('Indicação do mês deve ser um valor booleano'),
  validate
], async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { titulo, descricao, ano, nota, imagem, indicacao_do_mes } = req.body

    // Se este filme será indicação do mês, remover indicação dos outros
    if (indicacao_do_mes) {
      await db.run('UPDATE filmes SET indicacao_do_mes = 0')
    }

    // Converter tipos adequadamente
    const anoInt = parseInt(ano)
    const notaFloat = parseFloat(nota)
    const indicacaoBool = Boolean(indicacao_do_mes)
    const imagemUrl = imagem && imagem.trim() !== '' ? imagem : null
    
    const result = await db.run(`
      INSERT INTO filmes (titulo, descricao, ano, nota, imagem, indicacao_do_mes)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [titulo, descricao, anoInt, notaFloat, imagemUrl, indicacaoBool])

    const novoFilme = await db.get('SELECT * FROM filmes WHERE id = ?', [result.lastID])
    
    res.status(201).json({ 
      message: 'Filme criado com sucesso',
      filme: novoFilme 
    })
  } catch (error) {
    console.error('Erro ao criar filme:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// PUT /api/filmes/:id - Atualizar filme (admin)
router.put('/:id', authenticateToken, [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título é obrigatório e deve ter no máximo 100 caracteres')
    .escape(),
  body('descricao')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Descrição é obrigatória e deve ter no máximo 300 caracteres')
    .escape(),
  body('ano')
    .isInt({ min: 1900, max: 2099 })
    .withMessage('Ano deve estar entre 1900 e 2099'),
  body('nota')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Nota deve estar entre 0 e 5'),
  body('imagem')
    .optional()
    .custom((value) => {
      if (value && value.trim() !== '') {
        try {
          new URL(value)
          return true
        } catch {
          return false
        }
      }
      return true
    })
    .withMessage('URL da imagem deve ser válida'),
  body('indicacao_do_mes')
    .optional()
    .custom((value) => {
      return value === true || value === false || value === 0 || value === 1
    })
    .withMessage('Indicação do mês deve ser um valor booleano'),
  validate
], async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { id } = req.params
    const { titulo, descricao, ano, nota, imagem, indicacao_do_mes } = req.body

    // Verificar se o filme existe
    const filmeExistente = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    
    if (!filmeExistente) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    // Se este filme será indicação do mês, remover indicação dos outros
    if (indicacao_do_mes) {
      await db.run('UPDATE filmes SET indicacao_do_mes = 0 WHERE id != ?', [id])
    }
    
    // Converter tipos adequadamente
    const anoInt = parseInt(ano)
    const notaFloat = parseFloat(nota)
    const indicacaoBool = Boolean(indicacao_do_mes)
    const imagemUrl = imagem && imagem.trim() !== '' ? imagem : null
    
    await db.run(`
      UPDATE filmes 
      SET titulo = ?, descricao = ?, ano = ?, nota = ?, imagem = ?, 
          indicacao_do_mes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [titulo, descricao, anoInt, notaFloat, imagemUrl, indicacaoBool, id])

    const filmeAtualizado = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    
    res.json({ filme: filmeAtualizado })
  } catch (error) {
    console.error('Erro ao atualizar filme:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// DELETE /api/filmes/:id - Excluir filme (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.db
    if (!db) {
      return res.status(500).json({ error: 'Database não disponível' })
    }

    const { id } = req.params

    // Verificar se o filme existe
    const filme = await db.get('SELECT * FROM filmes WHERE id = ?', [id])
    if (!filme) {
      return res.status(404).json({ error: 'Filme não encontrado' })
    }

    await db.run('DELETE FROM filmes WHERE id = ?', [id])
    
    res.json({ message: 'Filme excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir filme:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router 