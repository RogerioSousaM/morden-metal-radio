const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const { body, validationResult } = require('express-validator')

// Rate Limiting por endpoint
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Muitas requisições') => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit excedido',
        message: 'Muitas requisições deste IP, tente novamente mais tarde',
        retryAfter: Math.ceil(windowMs / 1000)
      })
    }
  })
}

// Rate limiters específicos
const authRateLimit = createRateLimiter(15 * 60 * 1000, 5, 'Muitas tentativas de login')
const publicApiRateLimit = createRateLimiter(15 * 60 * 1000, 200, 'Muitas requisições à API pública')
const adminApiRateLimit = createRateLimiter(15 * 60 * 1000, 1000, 'Muitas requisições à API admin')
const imageValidationRateLimit = createRateLimiter(15 * 60 * 1000, 50, 'Muitas validações de imagem')

// Middleware de validação de entrada
const validateInput = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array(),
      message: 'Por favor, verifique os dados enviados'
    })
  }
  next()
}

// Sanitização de dados
const sanitizeInput = (req, res, next) => {
  // Sanitizar body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim()
      }
    })
  }
  
  // Sanitizar query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim()
      }
    })
  }
  
  next()
}

// Middleware de validação de roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Token de autenticação necessário' })
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado',
        message: 'Você não tem permissão para acessar este recurso',
        requiredRoles: roles,
        userRole: req.user.role
      })
    }
    
    next()
  }
}

// Middleware de auditoria
const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send
    
    res.send = function(data) {
      // Log da ação
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action,
        userId: req.user?.id || 'anonymous',
        userRole: req.user?.role || 'anonymous',
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        requestBody: req.body,
        responseData: data
      }
      
      console.log('🔍 AUDIT LOG:', JSON.stringify(auditEntry, null, 2))
      
      // Aqui você pode salvar no banco de dados
      // await saveAuditLog(auditEntry)
      
      originalSend.call(this, data)
    }
    
    next()
  }
}

// Middleware de validação de CSRF para operações de escrita
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.headers['x-csrf-token']
    const sessionToken = req.session?.csrfToken
    
    if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
      return res.status(403).json({
        error: 'CSRF token inválido',
        message: 'Token de segurança inválido ou expirado'
      })
    }
  }
  
  next()
}

// Middleware de validação de tamanho de payload
const validatePayloadSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0')
    const maxSizeBytes = parseSize(maxSize)
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        error: 'Payload muito grande',
        message: `O tamanho máximo permitido é ${maxSize}`,
        received: formatBytes(contentLength),
        maxAllowed: maxSize
      })
    }
    
    next()
  }
}

// Função auxiliar para converter tamanho em bytes
const parseSize = (size) => {
  const units = { 'b': 1, 'kb': 1024, 'mb': 1024 * 1024, 'gb': 1024 * 1024 * 1024 }
  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/)
  
  if (!match) return 10 * 1024 * 1024 // Default 10MB
  
  const [, value, unit] = match
  return parseFloat(value) * units[unit]
}

// Função auxiliar para formatar bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Configuração do Helmet com CSP personalizado
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
      mediaSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
})

// Configuração do CORS
const corsConfig = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://mordenmetal.com',
      'https://www.mordenmetal.com'
    ]
    
    // Permitir requests sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origin não permitida pelo CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
})

// Middleware de logging de requests
const requestLogger = (req, res, next) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO'
    
    console.log(`${logLevel} ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - ${req.ip}`)
  })
  
  next()
}

// Middleware de validação de API key (para endpoints externos)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key']
  const validApiKeys = process.env.API_KEYS?.split(',') || []
  
  if (!apiKey || !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'API key inválida',
      message: 'API key necessária para acessar este endpoint'
    })
  }
  
  next()
}

module.exports = {
  // Rate limiters
  authRateLimit,
  publicApiRateLimit,
  adminApiRateLimit,
  imageValidationRateLimit,
  
  // Middlewares de segurança
  helmetConfig,
  corsConfig,
  validateInput,
  sanitizeInput,
  requireRole,
  auditLog,
  csrfProtection,
  validatePayloadSize,
  requestLogger,
  validateApiKey,
  
  // Funções auxiliares
  parseSize,
  formatBytes
}
