const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const Database = require('../database/database')

// Importar rotas de upload
const fileUploadRoutes = require('./routes/fileUpload')
const carouselRoutes = require('./routes/carousel')

const socialLinksRoutes = require('./routes/socialLinks')
const filmesRoutes = require('./routes/filmes')
const destaquesRoutes = require('./routes/destaques')

// Importar middleware de autenticação
const { authenticateToken } = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 3001
const db = new Database()

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      mediaSrc: ["'self'", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde.'
})
app.use('/api/', limiter)

// CORS configurado para origens confiáveis
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Servir arquivos estáticos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Validação de entrada
const { body, validationResult } = require('express-validator')

// Inicializar banco de dados
let dbReady = false
db.init()
  .then(() => {
    dbReady = true
    console.log('✅ Banco de dados inicializado com sucesso')
  })
  .catch((error) => {
    console.error('❌ Erro ao inicializar banco de dados:', error)
  })

// Middleware de autenticação já importado do arquivo separado

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Middleware para verificar se o banco está pronto
const checkDbReady = (req, res, next) => {
  if (!dbReady) {
    return res.status(503).json({ error: 'Serviço temporariamente indisponível' })
  }
  next()
}

// Rotas de autenticação
app.post('/api/auth/login', [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('password').isLength({ min: 6 }),
  validate
], async (req, res) => {
  try {
    const { username, password } = req.body

    // Sanitização adicional
    const sanitizedUsername = username.replace(/[<>]/g, '')
    
    const user = await db.get('SELECT * FROM users WHERE username = ?', [sanitizedUsername])
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})



// Rotas de programação (protegidas)
app.get('/api/programs', authenticateToken, async (req, res) => {
  try {
    const programs = await db.all('SELECT * FROM programs ORDER BY start_time ASC')
    res.json(programs)
  } catch (error) {
    console.error('Erro ao buscar programas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.post('/api/programs', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 100 }).escape(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('host').trim().isLength({ min: 1, max: 50 }).escape(),
  body('genre').trim().isLength({ min: 1, max: 50 }).escape(),
  body('description').trim().isLength({ min: 1, max: 300 }).escape(),
  validate
], (req, res) => {
  try {
    const { title, startTime, endTime, host, genre, description, isLive, listeners } = req.body

    // Verificar conflito de horário
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    
    if (start >= end) {
      return res.status(400).json({ error: 'Horário de início deve ser menor que o horário de fim' })
    }

    const hasConflict = programs.some(program => {
      const programStart = new Date(`2000-01-01 ${program.startTime}`)
      const programEnd = new Date(`2000-01-01 ${program.endTime}`)
      return (start < programEnd && end > programStart)
    })

    if (hasConflict) {
      return res.status(400).json({ error: 'Conflito de horário detectado' })
    }

    const newProgram = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      host,
      genre,
      description,
      isLive: Boolean(isLive),
      listeners: listeners || '0'
    }

    programs.push(newProgram)
    res.status(201).json(newProgram)
  } catch (error) {
    console.error('Erro ao criar programa:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de upload de arquivos
app.use('/api/files', fileUploadRoutes)

// Rotas do carrossel
app.use('/api/carousel', carouselRoutes)




// Rotas de Links Sociais
app.use('/api/social-links', socialLinksRoutes)
app.use('/api/filmes', checkDbReady, filmesRoutes)
app.use('/api/destaques', checkDbReady, destaquesRoutes)

// Rota pública para buscar destaques publicados (frontend-user)
app.get('/api/highlights/public', checkDbReady, async (req, res) => {
  try {
    const highlights = await db.all(`
      SELECT 
        id,
        title,
        content,
        image,
        author,
        is_published as isPublished,
        band_name as bandName,
        media_urls as mediaUrls,
        news_summary as newsSummary,
        source_link as sourceLink,
        created_at as createdAt,
        updated_at as updatedAt
      FROM highlights 
      WHERE is_published = 1 
      ORDER BY created_at DESC 
      LIMIT 6
    `)
    res.json(highlights)
  } catch (error) {
    console.error('Erro ao buscar destaques públicos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de destaques (protegidas)
app.get('/api/highlights', authenticateToken, async (req, res) => {
  try {
    const highlights = await db.all(`
      SELECT 
        id,
        title,
        content,
        image,
        author,
        is_published as isPublished,
        band_name as bandName,
        media_urls as mediaUrls,
        news_summary as newsSummary,
        source_link as sourceLink,
        created_at as createdAt,
        updated_at as updatedAt
      FROM highlights 
      ORDER BY created_at DESC
    `)
    res.json(highlights)
  } catch (error) {
    console.error('Erro ao buscar destaques:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.post('/api/highlights', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 200 }).escape(),
  body('content').trim().isLength({ min: 1, max: 5000 }).escape(),
  body('author').trim().isLength({ min: 1, max: 100 }).escape(),
  validate
], async (req, res) => {
  try {
    const { 
      title, 
      content, 
      image, 
      author, 
      isPublished,
      bandName,
      mediaUrls,
      newsSummary,
      sourceLink
    } = req.body

    const result = await db.run(
      `INSERT INTO highlights (
        title, content, image, author, is_published, 
        band_name, media_urls, news_summary, source_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        content, 
        image || '', 
        author, 
        Boolean(isPublished),
        bandName || '',
        mediaUrls || '',
        newsSummary || '',
        sourceLink || ''
      ]
    )

    const newHighlight = await db.get('SELECT * FROM highlights WHERE id = ?', [result.id])
    res.status(201).json(newHighlight)
  } catch (error) {
    console.error('Erro ao criar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.put('/api/highlights/:id', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 200 }).escape(),
  body('content').trim().isLength({ min: 1, max: 5000 }).escape(),
  body('author').trim().isLength({ min: 1, max: 100 }).escape(),
  validate
], async (req, res) => {
  try {
    const { id } = req.params
    const { 
      title, 
      content, 
      image, 
      author, 
      isPublished,
      bandName,
      mediaUrls,
      newsSummary,
      sourceLink
    } = req.body

    // Verificar se o destaque existe
    const existingHighlight = await db.get('SELECT * FROM highlights WHERE id = ?', [id])
    if (!existingHighlight) {
      return res.status(404).json({ error: 'Destaque não encontrado' })
    }

    await db.run(
      `UPDATE highlights SET 
        title = ?, 
        content = ?, 
        image = ?, 
        author = ?, 
        is_published = ?, 
        band_name = ?,
        media_urls = ?,
        news_summary = ?,
        source_link = ?,
        updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        title, 
        content, 
        image || existingHighlight.image, 
        author, 
        Boolean(isPublished),
        bandName || existingHighlight.band_name || '',
        mediaUrls || existingHighlight.media_urls || '',
        newsSummary || existingHighlight.news_summary || '',
        sourceLink || existingHighlight.source_link || '',
        id
      ]
    )

    const updatedHighlight = await db.get('SELECT * FROM highlights WHERE id = ?', [id])
    res.json(updatedHighlight)
  } catch (error) {
    console.error('Erro ao atualizar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.delete('/api/highlights/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    // Verificar se o destaque existe
    const existingHighlight = await db.get('SELECT * FROM highlights WHERE id = ?', [id])
    if (!existingHighlight) {
      return res.status(404).json({ error: 'Destaque não encontrado' })
    }

    await db.run('DELETE FROM highlights WHERE id = ?', [id])
    res.json({ message: 'Destaque removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de usuários (protegidas)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await db.all('SELECT id, username, role, created_at, updated_at FROM users ORDER BY created_at DESC')
    res.json(users)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.post('/api/users', [
  authenticateToken,
  body('username').trim().isLength({ min: 3, max: 50 }).escape(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['user', 'admin', 'moderator']),
  validate
], async (req, res) => {
  try {
    const { username, password, role } = req.body

    // Verificar se o usuário já existe
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username])
    if (existingUser) {
      return res.status(400).json({ error: 'Nome de usuário já existe' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await db.run(
      `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
      [username, hashedPassword, role]
    )

    const newUser = await db.get('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?', [result.id])
    res.status(201).json(newUser)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.put('/api/users/:id', [
  authenticateToken,
  body('username').trim().isLength({ min: 3, max: 50 }).escape(),
  body('role').isIn(['user', 'admin', 'moderator']),
  validate
], async (req, res) => {
  try {
    const { id } = req.params
    const { username, password, role } = req.body

    // Verificar se o usuário existe
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [id])
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Verificar se o nome de usuário já existe (exceto para o usuário atual)
    if (username !== existingUser.username) {
      const userWithSameName = await db.get('SELECT * FROM users WHERE username = ? AND id != ?', [username, id])
      if (userWithSameName) {
        return res.status(400).json({ error: 'Nome de usuário já existe' })
      }
    }

    let updateQuery = 'UPDATE users SET username = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    let params = [username, role, id]

    // Se uma nova senha foi fornecida, incluí-la na atualização
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateQuery = 'UPDATE users SET username = ?, password = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      params = [username, hashedPassword, role, id]
    }

    await db.run(updateQuery, params)

    const updatedUser = await db.get('SELECT id, username, role, created_at, updated_at FROM users WHERE id = ?', [id])
    res.json(updatedUser)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    // Verificar se o usuário existe
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [id])
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Não permitir deletar o próprio usuário admin
    if (existingUser.role === 'admin') {
      return res.status(400).json({ error: 'Não é possível deletar um administrador' })
    }

    await db.run('DELETE FROM users WHERE id = ?', [id])
    res.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rota de streaming (simulada)
app.get('/api/stream', (req, res) => {
  // Simulação de streaming
  res.setHeader('Content-Type', 'audio/mpeg')
  res.setHeader('Transfer-Encoding', 'chunked')
  
  // Em produção, aqui você conectaria com um servidor de streaming real
  // como Icecast, Shoutcast, ou similar
  
  res.json({
    status: 'streaming',
    currentSong: 'Sleep Token - The Summoning',
    listeners: 1234,
    bitrate: '128kbps'
  })
})

// Rota de estatísticas
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await db.get('SELECT * FROM stats ORDER BY created_at DESC LIMIT 1')
    const programsCount = await db.get('SELECT COUNT(*) as count FROM programs')
    
    res.json({
      listeners: stats?.listeners || 0,
      nextProgram: stats?.next_program || '',
      systemAlerts: stats?.system_alerts || 0,
      totalPrograms: programsCount.count
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Algo deu errado!' })
})

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`)
  console.log(`📡 API disponível em http://localhost:${PORT}/api`)
  console.log(`🎵 Streaming em http://localhost:${PORT}/api/stream`)
})

module.exports = app 