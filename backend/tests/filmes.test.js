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

// Import and use the filmes routes
const filmesRoutes = require('../routes/filmes')
app.use('/api/filmes', filmesRoutes)

describe('Filmes API Endpoints', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
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

  describe('GET /api/filmes', () => {
    it('should return list of filmes with pagination', async () => {
      const mockFilmes = [
        {
          id: 1,
          titulo: 'Mad Max: Fury Road',
          descricao: 'Um filme de ação pós-apocalíptico',
          ano: 2015,
          nota: 4.5,
          imagem: 'https://example.com/madmax.jpg',
          indicacao_do_mes: 1,
          created_at: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          titulo: 'Blade Runner 2049',
          descricao: 'Um filme de ficção científica',
          ano: 2017,
          nota: 4.8,
          imagem: 'https://example.com/bladerunner.jpg',
          indicacao_do_mes: 0,
          created_at: '2024-01-02T00:00:00.000Z'
        }
      ]

      mockDb.get.mockResolvedValue({ total: 2 })
      mockDb.all.mockResolvedValue(mockFilmes)

      const response = await request(app)
        .get('/api/filmes')
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
      expect(response.body.data[0].titulo).toBe('Mad Max: Fury Road')
    })

    it('should filter filmes by featured status', async () => {
      const mockFeaturedFilmes = [
        {
          id: 1,
          titulo: 'Mad Max: Fury Road',
          descricao: 'Um filme de ação pós-apocalíptico',
          ano: 2015,
          nota: 4.5,
          indicacao_do_mes: 1,
          created_at: '2024-01-01T00:00:00.000Z'
        }
      ]

      mockDb.get.mockResolvedValue({ total: 1 })
      mockDb.all.mockResolvedValue(mockFeaturedFilmes)

      const response = await request(app)
        .get('/api/filmes')
        .query({ featured: '1' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].indicacao_do_mes).toBe(1)
    })

    it('should handle database errors gracefully', async () => {
      mockDb.get.mockRejectedValue(new Error('Database connection failed'))

      const response = await request(app)
        .get('/api/filmes')

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })

    it('should use default pagination values', async () => {
      mockDb.get.mockResolvedValue({ total: 0 })
      mockDb.all.mockResolvedValue([])

      const response = await request(app)
        .get('/api/filmes')

      expect(response.status).toBe(200)
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      })
    })

    it('should respect custom pagination parameters', async () => {
      mockDb.get.mockResolvedValue({ total: 25 })
      mockDb.all.mockResolvedValue([])

      const response = await request(app)
        .get('/api/filmes')
        .query({ page: 2, limit: 5 })

      expect(response.status).toBe(200)
      expect(response.body.pagination).toEqual({
        page: 2,
        limit: 5,
        total: 25,
        pages: 5
      })
    })
  })

  describe('GET /api/filmes/:id', () => {
    it('should return a specific filme by ID', async () => {
      const mockFilme = {
        id: 1,
        titulo: 'Mad Max: Fury Road',
        descricao: 'Um filme de ação pós-apocalíptico',
        ano: 2015,
        nota: 4.5,
        imagem: 'https://example.com/madmax.jpg',
        indicacao_do_mes: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }

      mockDb.get.mockResolvedValue(mockFilme)

      const response = await request(app)
        .get('/api/filmes/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockFilme)
      expect(mockDb.get).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        ['1'] // Express converts route params to strings
      )
    })

    it('should return 404 for non-existent filme', async () => {
      mockDb.get.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/filmes/999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Filme não encontrado')
    })
  })

  describe('POST /api/filmes', () => {
    const validFilmeData = {
      titulo: 'Test Movie',
      descricao: 'A test movie for testing',
      ano: 2024,
      nota: 4.0,
      imagem: 'https://example.com/test.jpg',
      indicacao_do_mes: false
    }

    it('should create a new filme with valid data and authentication', async () => {
      mockDb.run.mockResolvedValue({ lastID: 3 })
      
      const createdFilme = {
        id: 3,
        titulo: 'Test Movie',
        descricao: 'A test movie for testing',
        ano: 2024,
        nota: 4.0,
        imagem: 'https://example.com/test.jpg',
        indicacao_do_mes: 0,
        created_at: '2024-01-01T00:00:00.000Z'
      }
      
      mockDb.get.mockResolvedValue(createdFilme)

      const response = await request(app)
        .post('/api/filmes')
        .set('Authorization', 'Bearer valid-token')
        .send(validFilmeData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data.titulo).toBe('Test Movie')
    })

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/filmes')
        .send(validFilmeData)

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('should validate required fields', async () => {
      const invalidData = {
        titulo: '', // Empty title
        ano: 2024 // Valid year
      }

      const response = await request(app)
        .post('/api/filmes')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should validate year range', async () => {
      const invalidData = {
        ...validFilmeData,
        ano: 1800 // Too old
      }

      const response = await request(app)
        .post('/api/filmes')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should validate rating range', async () => {
      const invalidData = {
        ...validFilmeData,
        nota: 6.0 // Rating > 5
      }

      const response = await request(app)
        .post('/api/filmes')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should handle database errors during creation', async () => {
      mockDb.run.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/api/filmes')
        .set('Authorization', 'Bearer valid-token')
        .send(validFilmeData)

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })
  })

  describe('PUT /api/filmes/:id', () => {
    const updateData = {
      titulo: 'Updated Movie Title',
      nota: 4.8
    }

    it('should update an existing filme with valid data and authentication', async () => {
      const updatedFilme = {
        id: 1,
        titulo: 'Updated Movie Title',
        descricao: 'A test movie for testing',
        ano: 2024,
        nota: 4.8,
        imagem: 'https://example.com/test.jpg',
        indicacao_do_mes: 0,
        updated_at: '2024-01-01T00:00:00.000Z'
      }

      mockDb.run.mockResolvedValue({ changes: 1 })
      mockDb.get.mockResolvedValue(updatedFilme)

      const response = await request(app)
        .put('/api/filmes/1')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedFilme)
    })

    it('should return 404 for non-existent filme during update', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 })

      const response = await request(app)
        .put('/api/filmes/999')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData)

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Filme não encontrado')
    })
  })

  describe('DELETE /api/filmes/:id', () => {
    it('should delete an existing filme with authentication', async () => {
      mockDb.run.mockResolvedValue({ changes: 1 })

      const response = await request(app)
        .delete('/api/filmes/1')
        .set('Authorization', 'Bearer valid-token')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('Filme excluído com sucesso')
    })

    it('should return 404 for non-existent filme during deletion', async () => {
      mockDb.run.mockResolvedValue({ changes: 0 })

      const response = await request(app)
        .delete('/api/filmes/999')
        .set('Authorization', 'Bearer valid-token')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Filme não encontrado')
    })
  })
})
