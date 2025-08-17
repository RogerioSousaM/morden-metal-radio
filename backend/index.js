const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const Database = require('../database/database')

// Swagger UI para documentação da API
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load(path.join(__dirname, 'openapi.yaml'))

// Importar rotas de upload
const fileUploadRoutes = require('./routes/fileUpload')
const carouselRoutes = require('./routes/carousel')

const socialLinksRoutes = require('./routes/socialLinks')
const filmesRoutes = require('./routes/filmes')
const destaquesRoutes = require('./routes/destaques')
const bannersRoutes = require('./routes/banners')
const bandasRoutes = require('./routes/bandas')
const topMonthRoutes = require('./routes/topMonth')
const scheduleRoutes = require('./routes/schedule')
const newsRoutes = require('./routes/news')
const highlightsRoutes = require('./routes/highlights')
const programsRoutes = require('./routes/programs')
const usersRoutes = require('./routes/users')

// Importar middleware de autenticação
const { authenticateToken } = require('./middleware/auth')

// Importar middleware de auditoria
const AuditMiddleware = require('./middleware/audit')

const app = express()
const PORT = process.env.PORT || 3001
const db = new Database()

// Inicializar middleware de auditoria
const auditMiddleware = new AuditMiddleware()

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
      mediaSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
    },
  },
}))

// Rate limiting - Configuração robusta
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: { error: 'Muitas requisições deste IP, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})

// Rate limiting mais restritivo para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // limite de 5 tentativas de login por IP
  message: { error: 'Muitas tentativas de login, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false
})

// Rate limiting para uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // limite de 10 uploads por IP
  message: { error: 'Limite de uploads excedido, tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Aplicar rate limiting
app.use('/api/', generalLimiter)
app.use('/api/auth/', authLimiter)
app.use('/api/upload/', uploadLimiter)

// CORS configurado para origens confiáveis
const allowedOrigins = [
  'http://localhost:5173', // Frontend Admin
  'http://localhost:5174', // Frontend User
  'http://localhost:3000', // Backend (se necessário)
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
]

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sem origin (como mobile apps)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Origin não permitida pelo CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Servir arquivos estáticos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Configuração do Swagger UI
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Morden Metal Radio API - Documentação',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
    tryItOutEnabled: true,
    requestInterceptor: (request) => {
      // Adicionar token JWT se disponível
      const token = localStorage.getItem('token')
      if (token) {
        request.headers.Authorization = `Bearer ${token}`
      }
      return request
    }
  }
}

// Rota para documentação da API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

// Validação de entrada
const { body, validationResult } = require('express-validator')

// Inicializar banco de dados e middleware de auditoria
let dbReady = false
Promise.all([
  db.init(),
  auditMiddleware.init()
])
.then(() => {
  dbReady = true
  console.log('✅ Banco de dados inicializado com sucesso')
  console.log('✅ Middleware de auditoria inicializado com sucesso')
})
.catch((error) => {
  console.error('❌ Erro ao inicializar serviços:', error)
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

// Aplicar middleware de auditoria em todas as rotas
app.use(auditMiddleware.logAction.bind(auditMiddleware))

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



// Rotas de programação movidas para arquivo separado

// Rota de teste pública para debug
app.get('/api/test-public', (req, res) => {
  res.json({ message: 'Rota pública funcionando!', timestamp: new Date().toISOString() })
})

// Rotas de upload de arquivos
app.use('/api/files', fileUploadRoutes)

// Rotas do carrossel
app.use('/api/carousel', carouselRoutes)




// Rotas de Links Sociais
app.use('/api/social-links', socialLinksRoutes)

// Middleware para injetar instância do banco nas rotas
app.use('/api/filmes', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, filmesRoutes)

app.use('/api/destaques', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, destaquesRoutes)

app.use('/api/banners', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, bannersRoutes)

app.use('/api/bandas', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, bandasRoutes)

// Rotas do Top do Mês
app.use('/api/top-month', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, topMonthRoutes)

// Rotas de Agenda/Schedule
app.use('/api/schedule', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, scheduleRoutes)

// Rotas de Notícias
app.use('/api/news', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, newsRoutes)

// Alias para compatibilidade com frontend (bandas)
app.use('/api/bands', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, bandasRoutes)

// Rotas de Destaques
app.use('/api/highlights', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, highlightsRoutes)

// Rotas de Programas
app.use('/api/programs', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, programsRoutes)

// Rotas de Usuários
app.use('/api/users', checkDbReady, (req, res, next) => {
  req.db = db
  next()
}, usersRoutes)

// Rota para informações do stream (pública)
app.get('/api/stream/info', (req, res) => {
  res.json({
    status: 'online',
    currentSong: 'Sleep Token - Take Me Back to Eden',
    listeners: 127,
    bitrate: '320kbps',
    server: 'Morden Metal Radio',
    genre: 'Metal/Alternative'
  })
})

// Rota para estatísticas públicas
app.get('/api/stats', (req, res) => {
  res.json({
    listeners: 127,
    nextProgram: 'Metal Hour - 20:00',
    systemAlerts: 0,
    totalPrograms: 15
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