const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

// Mock database (substituir por banco real)
let highlights = [
  {
    id: 1,
    title: 'Sleep Token - Nova Turnê Mundial',
    content: 'A banda britânica Sleep Token anunciou uma nova turnê mundial que passará por mais de 30 países, incluindo o Brasil.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    author: 'Redação Morden Metal',
    isPublished: true,
    bandName: 'Sleep Token',
    mediaUrls: 'https://youtube.com/watch?v=example1,https://spotify.com/track/example1',
    newsSummary: 'Sleep Token anuncia turnê mundial com passagem pelo Brasil',
    sourceLink: 'https://sleep-token.com/news/tour-announcement',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Spiritbox - Novo Álbum em 2024',
    content: 'A banda canadense Spiritbox confirmou o lançamento de um novo álbum para 2024, com sonoridade ainda mais experimental.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop&crop=center',
    author: 'Redação Morden Metal',
    isPublished: true,
    bandName: 'Spiritbox',
    mediaUrls: 'https://youtube.com/watch?v=example2',
    newsSummary: 'Spiritbox confirma novo álbum para 2024',
    sourceLink: 'https://spiritbox.com/news/new-album',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  }
]

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Rota de teste pública para debug
router.get('/test', (req, res) => {
  res.json({ message: 'Teste de rota pública em highlights', timestamp: new Date().toISOString() })
})

// Rota pública para buscar destaques publicados (frontend-user)
router.get('/public', async (req, res) => {
  try {
    const publicHighlights = highlights
      .filter(h => h.isPublished)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
    
    res.json(publicHighlights)
  } catch (error) {
    console.error('Erro ao buscar destaques públicos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Rotas de destaques (protegidas)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const allHighlights = highlights
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.json(allHighlights)
  } catch (error) {
    console.error('Erro ao buscar destaques:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

router.post('/', [
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

    const newHighlight = {
      id: Date.now(),
      title,
      content,
      image: image || '',
      author,
      isPublished: isPublished !== undefined ? isPublished : false,
      bandName: bandName || '',
      mediaUrls: mediaUrls || '',
      newsSummary: newsSummary || '',
      sourceLink: sourceLink || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    highlights.push(newHighlight)
    res.status(201).json(newHighlight)
  } catch (error) {
    console.error('Erro ao criar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

router.put('/:id', [
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

    const highlightIndex = highlights.findIndex(h => h.id === parseInt(id))
    if (highlightIndex === -1) {
      return res.status(404).json({ error: 'Destaque não encontrado' })
    }

    highlights[highlightIndex] = {
      ...highlights[highlightIndex],
      title,
      content,
      image: image !== undefined ? image : highlights[highlightIndex].image,
      author,
      isPublished: isPublished !== undefined ? isPublished : highlights[highlightIndex].isPublished,
      bandName: bandName !== undefined ? bandName : highlights[highlightIndex].bandName,
      mediaUrls: mediaUrls !== undefined ? mediaUrls : highlights[highlightIndex].mediaUrls,
      newsSummary: newsSummary !== undefined ? newsSummary : highlights[highlightIndex].newsSummary,
      sourceLink: sourceLink !== undefined ? sourceLink : highlights[highlightIndex].sourceLink,
      updatedAt: new Date().toISOString()
    }

    res.json(highlights[highlightIndex])
  } catch (error) {
    console.error('Erro ao atualizar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const highlightIndex = highlights.findIndex(h => h.id === parseInt(id))
    if (highlightIndex === -1) {
      return res.status(404).json({ error: 'Destaque não encontrado' })
    }

    highlights.splice(highlightIndex, 1)
    res.json({ message: 'Destaque removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar destaque:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router
