const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Mock database (substituir por banco real)
let topMonthConfig = {
  id: 1,
  bandId: 1,
  bandName: 'Sleep Token',
  albumName: 'Take Me Back to Eden',
  albumImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
  playCount: 45000,
  newsLink: '/news/sleep-token-top-month',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Mock bands data (substituir por banco real)
let bands = [
  {
    id: 1,
    name: 'Sleep Token',
    genre: 'Alternative Metal',
    description: 'Banda britânica de metal alternativo',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Spiritbox',
    genre: 'Metalcore',
    description: 'Banda canadense de metalcore',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop&crop=center'
  },
  {
    id: 3,
    name: 'Bad Omens',
    genre: 'Metalcore',
    description: 'Banda americana de metalcore',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
  }
]

// GET /api/top-month - Obter configuração atual do Top do Mês
router.get('/', async (req, res) => {
  try {
    if (!topMonthConfig.isActive) {
      return res.status(404).json({ message: 'Top do Mês não está ativo' })
    }
    
    // Buscar dados da banda
    const band = bands.find(b => b.id === topMonthConfig.bandId)
    if (!band) {
      return res.status(404).json({ message: 'Banda não encontrada' })
    }
    
    const response = {
      ...topMonthConfig,
      band: band
    }
    
    res.json(response)
  } catch (error) {
    console.error('Erro ao buscar Top do Mês:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/top-month/config - Obter configuração completa (admin)
router.get('/config', authenticateToken, async (req, res) => {
  try {
    const band = bands.find(b => b.id === topMonthConfig.bandId)
    const response = {
      ...topMonthConfig,
      band: band
    }
    
    res.json(response)
  } catch (error) {
    console.error('Erro ao buscar configuração:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/top-month/bands - Listar bandas disponíveis
router.get('/bands', authenticateToken, async (req, res) => {
  try {
    res.json(bands)
  } catch (error) {
    console.error('Erro ao buscar bandas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/top-month/config - Atualizar configuração do Top do Mês
router.put('/config', authenticateToken, async (req, res) => {
  try {
    const { bandId, albumName, albumImage, playCount, newsLink, isActive } = req.body
    
    // Validar se a banda existe
    const band = bands.find(b => b.id === parseInt(bandId))
    if (!band) {
      return res.status(400).json({ message: 'Banda não encontrada' })
    }
    
    // Atualizar configuração
    topMonthConfig = {
      ...topMonthConfig,
      bandId: parseInt(bandId),
      bandName: band.name,
      albumName: albumName || topMonthConfig.albumName,
      albumImage: albumImage || topMonthConfig.albumImage,
      playCount: parseInt(playCount) || topMonthConfig.playCount,
      newsLink: newsLink || topMonthConfig.newsLink,
      isActive: isActive !== undefined ? isActive : topMonthConfig.isActive,
      updatedAt: new Date().toISOString()
    }
    
    const response = {
      ...topMonthConfig,
      band: band
    }
    
    res.json(response)
  } catch (error) {
    console.error('Erro ao atualizar Top do Mês:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// POST /api/top-month/bands - Criar nova banda
router.post('/bands', authenticateToken, async (req, res) => {
  try {
    const { name, genre, description, image } = req.body
    
    if (!name || !genre) {
      return res.status(400).json({ message: 'Nome e gênero são obrigatórios' })
    }
    
    const newBand = {
      id: Date.now(),
      name,
      genre,
      description: description || '',
      image: image || ''
    }
    
    bands.push(newBand)
    res.status(201).json(newBand)
  } catch (error) {
    console.error('Erro ao criar banda:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/top-month/bands/:id - Atualizar banda
router.put('/bands/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, genre, description, image } = req.body
    
    const bandIndex = bands.findIndex(b => b.id === parseInt(id))
    if (bandIndex === -1) {
      return res.status(404).json({ message: 'Banda não encontrada' })
    }
    
    bands[bandIndex] = {
      ...bands[bandIndex],
      name: name || bands[bandIndex].name,
      genre: genre || bands[bandIndex].genre,
      description: description || bands[bandIndex].description,
      image: image || bands[bandIndex].image
    }
    
    res.json(bands[bandIndex])
  } catch (error) {
    console.error('Erro ao atualizar banda:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// DELETE /api/top-month/bands/:id - Excluir banda
router.delete('/bands/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const bandIndex = bands.findIndex(b => b.id === parseInt(id))
    
    if (bandIndex === -1) {
      return res.status(404).json({ message: 'Banda não encontrada' })
    }
    
    // Verificar se a banda está sendo usada no Top do Mês
    if (topMonthConfig.bandId === parseInt(id)) {
      return res.status(400).json({ message: 'Não é possível excluir uma banda que está sendo usada no Top do Mês' })
    }
    
    bands.splice(bandIndex, 1)
    res.json({ message: 'Banda excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir banda:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/top-month/stats - Estatísticas do Top do Mês
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalBands: bands.length,
      isActive: topMonthConfig.isActive,
      currentBand: topMonthConfig.bandName,
      playCount: topMonthConfig.playCount,
      lastUpdated: topMonthConfig.updatedAt
    }
    
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

module.exports = router 