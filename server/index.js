const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

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
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Validação de entrada
const { body, validationResult } = require('express-validator')

// Simulação de banco de dados
let users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin'
  }
]

let bands = [
  {
    id: 1,
    name: 'Sleep Token',
    genre: 'Alternative Metal',
    description: 'Misturando metal progressivo com elementos eletrônicos e vocais únicos',
    listeners: '15.2k',
    rating: 4.8,
    isFeatured: true,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
  }
]

let programs = [
  {
    id: 1,
    title: 'Metal Noturno',
    startTime: '00:00',
    endTime: '06:00',
    host: 'DJ Shadow',
    genre: 'Classic Metal',
    description: 'Os melhores clássicos do metal para acompanhar a madrugada',
    isLive: false,
    listeners: '234'
  }
]

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' })
    }
    req.user = user
    next()
  })
}

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
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
    
    const user = users.find(u => u.username === sanitizedUsername)
    
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

// Rotas de bandas (protegidas)
app.get('/api/bands', authenticateToken, (req, res) => {
  res.json(bands)
})

app.post('/api/bands', [
  authenticateToken,
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('genre').trim().isLength({ min: 1, max: 50 }).escape(),
  body('description').trim().isLength({ min: 1, max: 300 }).escape(),
  validate
], (req, res) => {
  try {
    const { name, genre, description, listeners, rating, isFeatured, image } = req.body

    // Validação adicional
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Avaliação deve estar entre 0 e 5' })
    }

    const newBand = {
      id: Date.now(),
      name,
      genre,
      description,
      listeners: listeners || '0',
      rating: parseFloat(rating) || 0,
      isFeatured: Boolean(isFeatured),
      image: image || ''
    }

    bands.push(newBand)
    res.status(201).json(newBand)
  } catch (error) {
    console.error('Erro ao criar banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.put('/api/bands/:id', [
  authenticateToken,
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('genre').trim().isLength({ min: 1, max: 50 }).escape(),
  body('description').trim().isLength({ min: 1, max: 300 }).escape(),
  validate
], (req, res) => {
  try {
    const { id } = req.params
    const { name, genre, description, listeners, rating, isFeatured, image } = req.body

    const bandIndex = bands.findIndex(b => b.id === parseInt(id))
    
    if (bandIndex === -1) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    bands[bandIndex] = {
      ...bands[bandIndex],
      name,
      genre,
      description,
      listeners: listeners || bands[bandIndex].listeners,
      rating: parseFloat(rating) || bands[bandIndex].rating,
      isFeatured: Boolean(isFeatured),
      image: image || bands[bandIndex].image
    }

    res.json(bands[bandIndex])
  } catch (error) {
    console.error('Erro ao atualizar banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

app.delete('/api/bands/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const bandIndex = bands.findIndex(b => b.id === parseInt(id))
    
    if (bandIndex === -1) {
      return res.status(404).json({ error: 'Banda não encontrada' })
    }

    bands.splice(bandIndex, 1)
    res.json({ message: 'Banda removida com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar banda:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de programação (protegidas)
app.get('/api/programs', authenticateToken, (req, res) => {
  res.json(programs)
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
app.get('/api/stats', authenticateToken, (req, res) => {
  res.json({
    listeners: 1234,
    topBand: 'Sleep Token',
    nextProgram: 'Wake Up Metal',
    systemAlerts: 0,
    totalBands: bands.length,
    totalPrograms: programs.length
  })
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