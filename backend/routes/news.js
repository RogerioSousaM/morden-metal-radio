const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')

// Mock database (substituir por banco real)
let news = [
  {
    id: 1,
    title: 'Sleep Token Anuncia Nova Turnê Mundial',
    content: 'A banda britânica Sleep Token anunciou hoje uma nova turnê mundial que passará por mais de 30 países, incluindo o Brasil. A turnê "Take Me Back to Eden World Tour" começará em março de 2024 e incluirá datas em São Paulo, Rio de Janeiro e Porto Alegre.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    author: 'Redação Morden Metal',
    isPublished: true,
    bandName: 'Sleep Token',
    mediaUrls: 'https://youtube.com/watch?v=example1,https://spotify.com/track/example1',
    newsSummary: 'Sleep Token anuncia turnê mundial com passagem pelo Brasil em 2024',
    sourceLink: 'https://sleep-token.com/news/tour-announcement',
    tags: ['sleep-token', 'turnê', 'brasil', '2024'],
    featured: true,
    views: 1250,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Spiritbox Lança Novo Single "The Summoning"',
    content: 'A banda canadense Spiritbox surpreendeu os fãs com o lançamento de "The Summoning", um novo single que combina elementos de metalcore com atmosferas eletrônicas. A faixa já está disponível em todas as plataformas digitais e recebeu críticas positivas da comunidade metal.',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=400&fit=crop&crop=center',
    author: 'Redação Morden Metal',
    isPublished: true,
    bandName: 'Spiritbox',
    mediaUrls: 'https://youtube.com/watch?v=example2,https://spotify.com/track/example2',
    newsSummary: 'Spiritbox lança novo single "The Summoning" com elementos eletrônicos',
    sourceLink: 'https://spiritbox.com/news/new-single',
    tags: ['spiritbox', 'single', 'metalcore', 'eletrônico'],
    featured: false,
    views: 890,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: 3,
    title: 'Bad Omens Confirma Participação no Rock in Rio 2024',
    content: 'A banda americana Bad Omens confirmou oficialmente sua participação no Rock in Rio 2024. A apresentação está marcada para o dia 20 de setembro, no Palco Mundo, e será uma das principais atrações do festival. Os ingressos já estão à venda.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop&crop=center',
    author: 'Redação Morden Metal',
    isPublished: true,
    bandName: 'Bad Omens',
    mediaUrls: 'https://youtube.com/watch?v=example3',
    newsSummary: 'Bad Omens confirma presença no Rock in Rio 2024',
    sourceLink: 'https://rockinrio.com/lineup/bad-omens',
    tags: ['bad-omens', 'rock-in-rio', 'festival', '2024'],
    featured: true,
    views: 2100,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  }
]

// GET /api/news - Listar todas as notícias (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      isPublished, 
      bandName, 
      featured, 
      limit = 20, 
      page = 1,
      search 
    } = req.query
    
    let filteredNews = [...news]
    
    // Filtrar por status de publicação
    if (isPublished !== undefined) {
      filteredNews = filteredNews.filter(n => n.isPublished === (isPublished === 'true'))
    }
    
    // Filtrar por banda
    if (bandName) {
      filteredNews = filteredNews.filter(n => 
        n.bandName && n.bandName.toLowerCase().includes(bandName.toLowerCase())
      )
    }
    
    // Filtrar por destaque
    if (featured !== undefined) {
      filteredNews = filteredNews.filter(n => n.featured === (featured === 'true'))
    }
    
    // Busca por texto
    if (search) {
      const searchLower = search.toLowerCase()
      filteredNews = filteredNews.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.content.toLowerCase().includes(searchLower) ||
        (n.bandName && n.bandName.toLowerCase().includes(searchLower))
      )
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    filteredNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedNews = filteredNews.slice(startIndex, endIndex)
    
    res.json({
      news: paginatedNews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredNews.length / parseInt(limit)),
        totalItems: filteredNews.length,
        itemsPerPage: parseInt(limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/news/public - Listar notícias públicas (frontend-user)
router.get('/public', async (req, res) => {
  try {
    const { limit = 10, bandName, featured } = req.query
    
    let filteredNews = news.filter(n => n.isPublished)
    
    // Filtrar por banda
    if (bandName) {
      filteredNews = filteredNews.filter(n => 
        n.bandName && n.bandName.toLowerCase().includes(bandName.toLowerCase())
      )
    }
    
    // Filtrar por destaque
    if (featured === 'true') {
      filteredNews = filteredNews.filter(n => n.featured)
    }
    
    // Ordenar por data de criação (mais recentes primeiro)
    filteredNews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    // Limitar resultados
    const limitedNews = filteredNews.slice(0, parseInt(limit))
    
    res.json({
      news: limitedNews,
      total: limitedNews.length
    })
  } catch (error) {
    console.error('Erro ao buscar notícias públicas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/news/:id - Buscar notícia específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const newsItem = news.find(n => n.id === parseInt(id))
    
    if (!newsItem) {
      return res.status(404).json({ message: 'Notícia não encontrada' })
    }
    
    // Incrementar visualizações
    newsItem.views = (newsItem.views || 0) + 1
    
    res.json(newsItem)
  } catch (error) {
    console.error('Erro ao buscar notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// POST /api/news - Criar nova notícia (admin)
router.post('/', authenticateToken, async (req, res) => {
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
      sourceLink,
      tags,
      featured
    } = req.body
    
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Campos obrigatórios: title, content, author' })
    }
    
    const newNews = {
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
      tags: tags || [],
      featured: featured || false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    news.push(newNews)
    res.status(201).json(newNews)
  } catch (error) {
    console.error('Erro ao criar notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/news/:id - Atualizar notícia (admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const newsIndex = news.findIndex(n => n.id === parseInt(id))
    
    if (newsIndex === -1) {
      return res.status(404).json({ message: 'Notícia não encontrada' })
    }
    
    const {
      title,
      content,
      image,
      author,
      isPublished,
      bandName,
      mediaUrls,
      newsSummary,
      sourceLink,
      tags,
      featured
    } = req.body
    
    news[newsIndex] = {
      ...news[newsIndex],
      title: title || news[newsIndex].title,
      content: content || news[newsIndex].content,
      image: image !== undefined ? image : news[newsIndex].image,
      author: author || news[newsIndex].author,
      isPublished: isPublished !== undefined ? isPublished : news[newsIndex].isPublished,
      bandName: bandName !== undefined ? bandName : news[newsIndex].bandName,
      mediaUrls: mediaUrls !== undefined ? mediaUrls : news[newsIndex].mediaUrls,
      newsSummary: newsSummary !== undefined ? newsSummary : news[newsIndex].newsSummary,
      sourceLink: sourceLink !== undefined ? sourceLink : news[newsIndex].sourceLink,
      tags: tags || news[newsIndex].tags,
      featured: featured !== undefined ? featured : news[newsIndex].featured,
      updatedAt: new Date().toISOString()
    }
    
    res.json(news[newsIndex])
  } catch (error) {
    console.error('Erro ao atualizar notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// DELETE /api/news/:id - Excluir notícia (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const newsIndex = news.findIndex(n => n.id === parseInt(id))
    
    if (newsIndex === -1) {
      return res.status(404).json({ message: 'Notícia não encontrada' })
    }
    
    news.splice(newsIndex, 1)
    res.json({ message: 'Notícia excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/news/:id/toggle - Alternar status de publicação (admin)
router.put('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const newsIndex = news.findIndex(n => n.id === parseInt(id))
    
    if (newsIndex === -1) {
      return res.status(404).json({ message: 'Notícia não encontrada' })
    }
    
    news[newsIndex].isPublished = !news[newsIndex].isPublished
    news[newsIndex].updatedAt = new Date().toISOString()
    
    res.json(news[newsIndex])
  } catch (error) {
    console.error('Erro ao alternar status da notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/news/:id/feature - Alternar destaque (admin)
router.put('/:id/feature', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const newsIndex = news.findIndex(n => n.id === parseInt(id))
    
    if (newsIndex === -1) {
      return res.status(404).json({ message: 'Notícia não encontrada' })
    }
    
    news[newsIndex].featured = !news[newsIndex].featured
    news[newsIndex].updatedAt = new Date().toISOString()
    
    res.json(news[newsIndex])
  } catch (error) {
    console.error('Erro ao alternar destaque da notícia:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/news/stats - Estatísticas das notícias (admin)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      totalNews: news.length,
      publishedNews: news.filter(n => n.isPublished).length,
      draftNews: news.filter(n => !n.isPublished).length,
      featuredNews: news.filter(n => n.featured).length,
      totalViews: news.reduce((sum, n) => sum + (n.views || 0), 0),
      averageViews: news.length > 0 ? 
        news.reduce((sum, n) => sum + (n.views || 0), 0) / news.length : 0,
      newsByBand: news.reduce((acc, n) => {
        if (n.bandName) {
          acc[n.bandName] = (acc[n.bandName] || 0) + 1
        }
        return acc
      }, {}),
      topViewedNews: news
        .filter(n => n.isPublished)
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(n => ({ id: n.id, title: n.title, views: n.views || 0 }))
    }
    
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

module.exports = router
