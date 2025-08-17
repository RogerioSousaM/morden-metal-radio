const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Mock database (substituir por banco real)
let schedules = [
  {
    id: 1,
    title: 'Show ao Vivo - Sleep Token',
    description: 'Apresentação especial da banda Sleep Token',
    startDate: '2024-02-15T20:00:00Z',
    endDate: '2024-02-15T22:00:00Z',
    location: 'Teatro Municipal',
    type: 'show',
    isActive: true,
    maxAttendees: 500,
    currentAttendees: 0,
    price: 0,
    organizer: 'Morden Metal Radio',
    contactInfo: 'contato@mordenmetal.com',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    tags: ['metal', 'show', 'ao-vivo'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: 'Meet & Greet - Spiritbox',
    description: 'Encontro com a banda Spiritbox para autógrafos e fotos',
    startDate: '2024-02-20T18:00:00Z',
    endDate: '2024-02-20T20:00:00Z',
    location: 'Shopping Center',
    type: 'meet-greet',
    isActive: true,
    maxAttendees: 100,
    currentAttendees: 0,
    price: 0,
    organizer: 'Morden Metal Radio',
    contactInfo: 'contato@mordenmetal.com',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop&crop=center',
    tags: ['metal', 'meet-greet', 'autógrafos'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// GET /api/schedule - Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const { type, isActive, limit = 20, page = 1 } = req.query
    
    let filteredSchedules = [...schedules]
    
    // Filtrar por tipo
    if (type) {
      filteredSchedules = filteredSchedules.filter(s => s.type === type)
    }
    
    // Filtrar por status ativo
    if (isActive !== undefined) {
      filteredSchedules = filteredSchedules.filter(s => s.isActive === (isActive === 'true'))
    }
    
    // Paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex)
    
    res.json({
      schedules: paginatedSchedules,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredSchedules.length / parseInt(limit)),
        totalItems: filteredSchedules.length,
        itemsPerPage: parseInt(limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/schedule/public - Listar eventos públicos (frontend-user)
router.get('/public', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    
    const publicSchedules = schedules
      .filter(s => s.isActive)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, parseInt(limit))
    
    res.json({
      schedules: publicSchedules,
      total: publicSchedules.length
    })
  } catch (error) {
    console.error('Erro ao buscar eventos públicos:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/schedule/:id - Buscar evento específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const schedule = schedules.find(s => s.id === parseInt(id))
    
    if (!schedule) {
      return res.status(404).json({ message: 'Evento não encontrado' })
    }
    
    res.json(schedule)
  } catch (error) {
    console.error('Erro ao buscar evento:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// POST /api/schedule - Criar novo evento (admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      maxAttendees,
      price,
      organizer,
      contactInfo,
      imageUrl,
      tags
    } = req.body
    
    if (!title || !startDate || !endDate || !location || !type) {
      return res.status(400).json({ message: 'Campos obrigatórios: title, startDate, endDate, location, type' })
    }
    
    // Validar datas
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start >= end) {
      return res.status(400).json({ message: 'Data de início deve ser menor que a data de fim' })
    }
    
    const newSchedule = {
      id: Date.now(),
      title,
      description: description || '',
      startDate,
      endDate,
      location,
      type,
      isActive: true,
      maxAttendees: maxAttendees || 0,
      currentAttendees: 0,
      price: price || 0,
      organizer: organizer || 'Morden Metal Radio',
      contactInfo: contactInfo || '',
      imageUrl: imageUrl || '',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    schedules.push(newSchedule)
    res.status(201).json(newSchedule)
  } catch (error) {
    console.error('Erro ao criar evento:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/schedule/:id - Atualizar evento (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const scheduleIndex = schedules.findIndex(s => s.id === parseInt(id))
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Evento não encontrado' })
    }
    
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      isActive,
      maxAttendees,
      price,
      organizer,
      contactInfo,
      imageUrl,
      tags
    } = req.body
    
    // Validar datas se fornecidas
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start >= end) {
        return res.status(400).json({ message: 'Data de início deve ser menor que a data de fim' })
      }
    }
    
    schedules[scheduleIndex] = {
      ...schedules[scheduleIndex],
      title: title || schedules[scheduleIndex].title,
      description: description !== undefined ? description : schedules[scheduleIndex].description,
      startDate: startDate || schedules[scheduleIndex].startDate,
      endDate: endDate || schedules[scheduleIndex].endDate,
      location: location || schedules[scheduleIndex].location,
      type: type || schedules[scheduleIndex].type,
      isActive: isActive !== undefined ? isActive : schedules[scheduleIndex].isActive,
      maxAttendees: maxAttendees !== undefined ? maxAttendees : schedules[scheduleIndex].maxAttendees,
      price: price !== undefined ? price : schedules[scheduleIndex].price,
      organizer: organizer || schedules[scheduleIndex].organizer,
      contactInfo: contactInfo !== undefined ? contactInfo : schedules[scheduleIndex].contactInfo,
      imageUrl: imageUrl !== undefined ? imageUrl : schedules[scheduleIndex].imageUrl,
      tags: tags || schedules[scheduleIndex].tags,
      updatedAt: new Date().toISOString()
    }
    
    res.json(schedules[scheduleIndex])
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// DELETE /api/schedule/:id - Excluir evento (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const scheduleIndex = schedules.findIndex(s => s.id === parseInt(id))
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Evento não encontrado' })
    }
    
    schedules.splice(scheduleIndex, 1)
    res.json({ message: 'Evento excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir evento:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/schedule/:id/toggle - Alternar status do evento (admin)
router.put('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const scheduleIndex = schedules.findIndex(s => s.id === parseInt(id))
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ message: 'Evento não encontrado' })
    }
    
    schedules[scheduleIndex].isActive = !schedules[scheduleIndex].isActive
    schedules[scheduleIndex].updatedAt = new Date().toISOString()
    
    res.json(schedules[scheduleIndex])
  } catch (error) {
    console.error('Erro ao alternar status do evento:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/schedule/stats - Estatísticas dos eventos (admin)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalEvents: schedules.length,
      activeEvents: schedules.filter(s => s.isActive).length,
      upcomingEvents: schedules.filter(s => new Date(s.startDate) > new Date()).length,
      pastEvents: schedules.filter(s => new Date(s.endDate) < new Date()).length,
      eventsByType: schedules.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1
        return acc
      }, {}),
      totalAttendees: schedules.reduce((sum, s) => sum + s.currentAttendees, 0),
      averagePrice: schedules.length > 0 ? 
        schedules.reduce((sum, s) => sum + s.price, 0) / schedules.length : 0
    }
    
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

module.exports = router
