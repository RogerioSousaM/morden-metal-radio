// Mock the auth middleware FIRST
jest.mock('../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    if (req.headers.authorization === 'Bearer valid-token') {
      req.user = { id: 1, username: 'admin', role: 'admin' }
      next()
    } else {
      res.status(401).json({ error: 'Token inválido' })
      return // Prevent further execution
    }
  })
}))

// Mock the database
jest.mock('../../database/database', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(true),
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined)
  }))
})

const request = require('supertest')
const express = require('express')
const jwt = require('jsonwebtoken')

// Create Express app for testing
const app = express()
app.use(express.json())

// Mock database instance
const mockDb = {
  get: jest.fn(),
  all: jest.fn(),
  run: jest.fn(),
  close: jest.fn().mockResolvedValue(undefined)
}

// Mock req.db for all routes
app.use((req, res, next) => {
  req.db = mockDb
  next()
})

// Import and use the bandas routes
const bandasRoutes = require('../routes/bandas')
app.use('/api/bandas', bandasRoutes)

describe('Bandas API Endpoints', () => {
  let validToken

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Create a valid JWT token for testing
    validToken = jwt.sign(
      { id: 1, username: 'admin', role: 'admin' },
      'test-secret-key',
      { expiresIn: '1h' }
    )
  })

  afterEach(() => {
    mockDb.get.mockReset()
    mockDb.all.mockReset()
    mockDb.run.mockReset()
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('GET /api/bandas', () => {
    it('should return list of bandas with pagination', async () => {
      // Mock database responses
      const mockBandas = [
        {
          id: 1,
          name: 'Sleep Token',
          slug: 'sleep-token',
          description: 'Metal alternativo',
          featured: 1,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          name: 'Lorna Shore',
          slug: 'lorna-shore',
          description: 'Deathcore',
          featured: 0,
          created_at: '2024-01-02T00:00:00.000Z'
        }
      ]

      mockDb.get.mockResolvedValue({ total: 2 })
      mockDb.all.mockResolvedValue(mockBandas)

      const response = await request(app)
        .get('/api/bandas')
        .query({ page: 1, limit: 10 })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('pagination')
      expect(response.body.data).toHaveLength(2)
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        pages: 1
      })
      expect(response.body.data[0].name).toBe('Sleep Token')
    })

    it('should filter bandas by featured status', async () => {
      const mockFeaturedBandas = [
        {
          id: 1,
          name: 'Sleep Token',
          slug: 'sleep-token',
          featured: 1,
          created_at: '2024-01-01T00:00:00.000Z'
        }
      ]

      mockDb.get.mockResolvedValue({ total: 1 })
      mockDb.all.mockResolvedValue(mockFeaturedBandas)

      const response = await request(app)
        .get('/api/bandas')
        .query({ featured: '1' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].featured).toBe(1)
    })

    it('should handle database errors gracefully', async () => {
      mockDb.get.mockRejectedValue(new Error('Database connection failed'))

      const response = await request(app)
        .get('/api/bandas')

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })

    it('should use default pagination values', async () => {
      mockDb.get.mockResolvedValue({ total: 0 })
      mockDb.all.mockResolvedValue([])

      const response = await request(app)
        .get('/api/bandas')

      expect(response.status).toBe(200)
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      })
    })
  })

  describe('GET /api/bandas/:id', () => {
    it('should return a specific banda by ID', async () => {
      const mockBanda = {
        id: 1,
        name: 'Sleep Token',
        slug: 'sleep-token',
        description: 'Metal alternativo',
        featured: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }

      mockDb.get.mockResolvedValue(mockBanda)

      const response = await request(app)
        .get('/api/bandas/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockBanda)
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['1'] // Express converts route params to strings
      )
    })

    it('should return 404 for non-existent banda', async () => {
      mockDb.get.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/bandas/999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Banda não encontrada')
    })
  })

  describe('POST /api/bandas', () => {
    const validBandaData = {
      nome: 'Test Band',
      slug: 'test-band',
      descricao: 'A test band for testing',
      official_url: 'https://example.com',
      image_url: 'https://images.unsplash.com/photo-123',
      genero_tags: '["metal", "rock"]',
      destaque: true
    }

    it('should create a new banda with valid data and authentication', async () => {
      // Mock database responses
      mockDb.get.mockResolvedValue(null) // No existing slug
      mockDb.run.mockResolvedValue({ lastID: 3 })
      
      const createdBanda = {
        id: 3,
        name: 'Test Band',
        slug: 'test-band',
        description: 'A test band for testing',
        official_url: 'https://example.com',
        image_url: 'https://images.unsplash.com/photo-123',
        genre_tags: '["metal", "rock"]',
        featured: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }
      
      mockDb.get.mockResolvedValueOnce(null) // First call for slug check
      mockDb.get.mockResolvedValueOnce(createdBanda) // Second call for created banda

      const response = await request(app)
        .post('/api/bandas')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validBandaData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('data')
      expect(response.body.message).toBe('Banda criada com sucesso')
      expect(response.body.data.name).toBe('Test Band')
    })

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/bandas')
        .send(validBandaData)

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('should return 409 for duplicate slug', async () => {
      mockDb.get.mockResolvedValue({ id: 1 }) // Existing slug

      const response = await request(app)
        .post('/api/bandas')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validBandaData)

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Slug já existe')
    })

    it('should validate required fields', async () => {
      const invalidData = {
        nome: '', // Empty name
        slug: 'test' // Valid slug
      }

      const response = await request(app)
        .post('/api/bandas')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should validate slug format', async () => {
      const invalidData = {
        nome: 'Test Band',
        slug: 'Test Band', // Invalid slug with spaces
        descricao: 'A test band'
      }

      const response = await request(app)
        .post('/api/bandas')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should handle database errors during creation', async () => {
      mockDb.get.mockResolvedValue(null) // No existing slug
      mockDb.run.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/api/bandas')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validBandaData)

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })
  })

  describe('GET /api/bandas/slug/:slug', () => {
    it('should return a banda by slug', async () => {
      const mockBanda = {
        id: 1,
        name: 'Sleep Token',
        slug: 'sleep-token',
        description: 'Metal alternativo',
        featured: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }

      mockDb.get.mockResolvedValue(mockBanda)

      const response = await request(app)
        .get('/api/bandas/slug/sleep-token')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockBanda)
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['sleep-token']
      )
    })

    it('should return 404 for non-existent slug', async () => {
      mockDb.get.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/bandas/slug/non-existent')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Banda não encontrada')
    })
  })
})
