const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/carousel')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'carousel-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Apenas arquivos de imagem e vídeo são permitidos!'))
    }
  }
})

// Mock database (substituir por banco real)
let carouselSlides = [
  {
    id: 1,
    title: 'MORDEN METAL',
    description: 'A melhor rádio de metal moderno',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&crop=center',
    videoUrl: null,
    order: 1,
    isActive: true,
    type: 'image',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    title: '24/7 METAL',
    description: 'Metal 24 horas por dia',
    imageUrl: null,
    videoUrl: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761',
    order: 2,
    isActive: true,
    type: 'video',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    title: 'DARK SOUNDS',
    description: 'Os sons mais sombrios do metal',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&h=600&fit=crop&crop=center',
    videoUrl: null,
    order: 3,
    isActive: true,
    type: 'image',
    createdAt: '2024-01-01T00:00:00Z'
  }
]

// GET /api/carousel - Listar todos os slides
router.get('/', async (req, res) => {
  try {
    // Ordenar por ordem
    const sortedSlides = carouselSlides.sort((a, b) => a.order - b.order)
    res.json(sortedSlides)
  } catch (error) {
    console.error('Erro ao buscar slides:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/carousel/active - Listar apenas slides ativos (para frontend)
router.get('/active', async (req, res) => {
  try {
    const activeSlides = carouselSlides
      .filter(slide => slide.isActive)
      .sort((a, b) => a.order - b.order)
    res.json(activeSlides)
  } catch (error) {
    console.error('Erro ao buscar slides ativos:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// POST /api/carousel - Criar novo slide
router.post('/', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const { title, description, type, isActive } = req.body
    
    if (!title || !type) {
      return res.status(400).json({ message: 'Título e tipo são obrigatórios' })
    }

    // Processar upload de arquivo se fornecido
    let imageUrl = req.body.imageUrl || null
    let videoUrl = req.body.videoUrl || null

    if (req.file) {
      const fileUrl = `/uploads/carousel/${req.file.filename}`
      if (type === 'image') {
        imageUrl = fileUrl
      } else if (type === 'video') {
        videoUrl = fileUrl
      }
    }

    // Validar que pelo menos uma mídia foi fornecida
    if (!imageUrl && !videoUrl) {
      return res.status(400).json({ message: 'É necessário fornecer uma imagem ou vídeo' })
    }

    const newSlide = {
      id: Date.now(),
      title,
      description: description || '',
      imageUrl,
      videoUrl,
      order: carouselSlides.length + 1,
      isActive: isActive === 'true' || isActive === true,
      type,
      createdAt: new Date().toISOString()
    }

    carouselSlides.push(newSlide)
    
    res.status(201).json(newSlide)
  } catch (error) {
    console.error('Erro ao criar slide:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/carousel/:id - Atualizar slide
router.put('/:id', authenticateToken, upload.single('media'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, type, isActive } = req.body
    
    const slideIndex = carouselSlides.findIndex(slide => slide.id === parseInt(id))
    
    if (slideIndex === -1) {
      return res.status(404).json({ message: 'Slide não encontrado' })
    }

    // Processar upload de arquivo se fornecido
    let imageUrl = req.body.imageUrl || carouselSlides[slideIndex].imageUrl
    let videoUrl = req.body.videoUrl || carouselSlides[slideIndex].videoUrl

    if (req.file) {
      const fileUrl = `/uploads/carousel/${req.file.filename}`
      if (type === 'image') {
        imageUrl = fileUrl
      } else if (type === 'video') {
        videoUrl = fileUrl
      }
    }

    // Atualizar slide
    carouselSlides[slideIndex] = {
      ...carouselSlides[slideIndex],
      title: title || carouselSlides[slideIndex].title,
      description: description || carouselSlides[slideIndex].description,
      imageUrl,
      videoUrl,
      type: type || carouselSlides[slideIndex].type,
      isActive: isActive === 'true' || isActive === true
    }

    res.json(carouselSlides[slideIndex])
  } catch (error) {
    console.error('Erro ao atualizar slide:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// DELETE /api/carousel/:id - Excluir slide
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const slideIndex = carouselSlides.findIndex(slide => slide.id === parseInt(id))
    
    if (slideIndex === -1) {
      return res.status(404).json({ message: 'Slide não encontrado' })
    }

    // Remover arquivo se existir
    const slide = carouselSlides[slideIndex]
    if (slide.imageUrl && slide.imageUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', slide.imageUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }
    if (slide.videoUrl && slide.videoUrl.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', slide.videoUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    carouselSlides.splice(slideIndex, 1)
    
    // Reordenar slides restantes
    carouselSlides.forEach((slide, index) => {
      slide.order = index + 1
    })

    res.json({ message: 'Slide excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir slide:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/carousel/:id/toggle - Alternar status ativo/inativo
router.put('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const slideIndex = carouselSlides.findIndex(slide => slide.id === parseInt(id))
    
    if (slideIndex === -1) {
      return res.status(404).json({ message: 'Slide não encontrado' })
    }

    carouselSlides[slideIndex].isActive = !carouselSlides[slideIndex].isActive
    
    res.json(carouselSlides[slideIndex])
  } catch (error) {
    console.error('Erro ao alternar status:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// PUT /api/carousel/reorder - Reordenar slides
router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { slideIds } = req.body
    
    if (!Array.isArray(slideIds)) {
      return res.status(400).json({ message: 'slideIds deve ser um array' })
    }

    // Atualizar ordem dos slides
    slideIds.forEach((slideId, index) => {
      const slide = carouselSlides.find(s => s.id === slideId)
      if (slide) {
        slide.order = index + 1
      }
    })

    // Ordenar array
    carouselSlides.sort((a, b) => a.order - b.order)
    
    res.json(carouselSlides)
  } catch (error) {
    console.error('Erro ao reordenar slides:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

// GET /api/carousel/stats - Estatísticas do carrossel
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = {
      total: carouselSlides.length,
      active: carouselSlides.filter(slide => slide.isActive).length,
      images: carouselSlides.filter(slide => slide.type === 'image').length,
      videos: carouselSlides.filter(slide => slide.type === 'video').length
    }
    
    res.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ message: 'Erro interno do servidor' })
  }
})

module.exports = router 