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

// Mock fetch for image URL validation
global.fetch = jest.fn()

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

// Import and use the banners routes
const bannersRoutes = require('../routes/banners')
app.use('/api/banners', bannersRoutes)

describe('Banners API Endpoints', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Mock successful fetch response for image validation
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: jest.fn((header) => {
          if (header === 'content-type') return 'image/jpeg'
          if (header === 'content-length') return '1024'
          return null
        })
      }
    })
  })

  afterEach(() => {
    mockDb.get.mockReset()
    mockDb.all.mockReset()
    mockDb.run.mockReset()
    global.fetch.mockReset()
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  describe('GET /api/banners', () => {
    it('should return banners by location with default limit', async () => {
      const mockBanners = [
        {
          id: 1,
          title: 'New Album',
          description: 'Check out the new album',
          image_url: 'https://images.unsplash.com/photo-123',
          target_url: 'https://example.com/album',
          location: 'hero',
          priority: 1,
          active: 1,
          created_at: '2024-01-01T00:00:00.000Z'
        }
      ]

      mockDb.all.mockResolvedValue(mockBanners)

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'hero' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('data')
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('location')
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toBe('New Album')
      expect(response.body.location).toBe('hero')
    })

    it('should return banners with custom limit', async () => {
      const mockBanners = [
        {
          id: 1,
          title: 'Banner 1',
          location: 'sidebar',
          priority: 1,
          active: 1
        },
        {
          id: 2,
          title: 'Banner 2',
          location: 'sidebar',
          priority: 2,
          active: 1
        }
      ]

      mockDb.all.mockResolvedValue(mockBanners)

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'sidebar', limit: 2 })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.total).toBe(2)
    })

    it('should filter banners by active status', async () => {
      const mockActiveBanners = [
        {
          id: 1,
          title: 'Active Banner',
          location: 'hero',
          active: 1
        }
      ]

      mockDb.all.mockResolvedValue(mockActiveBanners)

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'hero', active: '1' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].active).toBe(1)
    })

    it('should handle empty results gracefully', async () => {
      mockDb.all.mockResolvedValue([])

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'nonexistent' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(0)
      expect(response.body.total).toBe(0)
    })

    it('should return 401 when no location is specified (admin only)', async () => {
      const response = await request(app)
        .get('/api/banners')

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('should handle database errors gracefully', async () => {
      mockDb.all.mockRejectedValue(new Error('Database connection failed'))

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'hero' })

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })

    it('should respect priority ordering', async () => {
      const mockBanners = [
        {
          id: 2,
          title: 'High Priority',
          location: 'hero',
          priority: 1,
          active: 1
        },
        {
          id: 1,
          title: 'Low Priority',
          location: 'hero',
          priority: 2,
          active: 1
        }
      ]

      mockDb.all.mockResolvedValue(mockBanners)

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'hero' })

      expect(response.status).toBe(200)
      expect(response.body.data[0].priority).toBe(1) // Higher priority first
      expect(response.body.data[1].priority).toBe(2) // Lower priority second
    })

    it('should handle date filtering for start_at and end_at', async () => {
      const mockBanners = [
        {
          id: 1,
          title: 'Current Banner',
          location: 'hero',
          start_at: '2024-01-01T00:00:00.000Z',
          end_at: '2024-12-31T23:59:59.000Z',
          active: 1
        }
      ]

      mockDb.all.mockResolvedValue(mockBanners)

      const response = await request(app)
        .get('/api/banners')
        .query({ location: 'hero' })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].title).toBe('Current Banner')
    })
  })

  describe('POST /api/banners', () => {
    const validBannerData = {
      title: 'Test Banner',
      description: 'A test banner',
      image_url: 'https://images.unsplash.com/photo-123',
      target_url: 'https://example.com',
      location: 'hero',
      priority: 1,
      active: true
    }

    it('should create a new banner with valid data and authentication', async () => {
      mockDb.run.mockResolvedValue({ lastID: 3 })
      
      const createdBanner = {
        id: 3,
        title: 'Test Banner',
        description: 'A test banner',
        image_url: 'https://images.unsplash.com/photo-123',
        target_url: 'https://example.com',
        location: 'hero',
        priority: 1,
        active: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }
      
      mockDb.get.mockResolvedValue(createdBanner)

      const response = await request(app)
        .post('/api/banners')
        .set('Authorization', 'Bearer valid-token')
        .send(validBannerData)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('data')
      expect(response.body.data.title).toBe('Test Banner')
    })

    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/api/banners')
        .send(validBannerData)

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty('error')
    })

    it('should validate required fields', async () => {
      const invalidData = {
        title: '', // Empty title
        location: 'hero' // Valid location
      }

      const response = await request(app)
        .post('/api/banners')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should validate image URL format', async () => {
      const invalidData = {
        ...validBannerData,
        image_url: 'http://example.com/image.jpg' // HTTP instead of HTTPS
      }

      const response = await request(app)
        .post('/api/banners')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Dados inválidos')
    })

    it('should handle database errors during creation', async () => {
      mockDb.run.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/api/banners')
        .set('Authorization', 'Bearer valid-token')
        .send(validBannerData)

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Erro interno do servidor')
    })
  })

  describe('GET /api/banners/:id', () => {
    it('should return a specific banner by ID', async () => {
      const mockBanner = {
        id: 1,
        title: 'Test Banner',
        description: 'A test banner',
        image_url: 'https://images.unsplash.com/photo-123',
        location: 'hero',
        priority: 1,
        active: 1,
        created_at: '2024-01-01T00:00:00.000Z'
      }

      mockDb.get.mockResolvedValue(mockBanner)

      const response = await request(app)
        .get('/api/banners/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockBanner)
    })

    it('should return 404 for non-existent banner', async () => {
      mockDb.get.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/banners/999')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toBe('Banner não encontrado')
    })
  })
})
