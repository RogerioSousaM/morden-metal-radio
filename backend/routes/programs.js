const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')

// Mock database (substituir por banco real)
let programs = [
  {
    id: 1,
    title: 'Metal Madness',
    startTime: '20:00',
    endTime: '22:00',
    host: 'DJ Metalhead',
    genre: 'Heavy Metal',
    description: 'Show de heavy metal clássico com as melhores bandas dos anos 80 e 90',
    isLive: true,
    listeners: '1500'
  },
  {
    id: 2,
    title: 'Alternative Night',
    startTime: '22:00',
    endTime: '00:00',
    host: 'DJ Alternative',
    genre: 'Alternative Metal',
    description: 'Música alternativa e metal moderno',
    isLive: false,
    listeners: '800'
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

// GET /api/programs - Listar todos os programas
router.get('/', authenticateToken, async (req, res) => {
  try {
    res.json(programs)
  } catch (error) {
    console.error('Erro ao buscar programas:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/programs - Criar novo programa
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 100 }).escape(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('host').trim().isLength({ min: 1, max: 50 }).escape(),
  body('genre').trim().isLength({ min: 1, max: 50 }).escape(),
  body('description').trim().isLength({ min: 1, max: 300 }).escape(),
  validate
], (req, res) => {
  try {
    const { title, startTime, endTime, host, genre, description, isLive, listeners } = req.body

    // Verificar conflito de horário
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    
    if (start >= end) {
      return res.status(400).json({ error: 'Horário de início deve ser menor que o horário de fim' })
    }

    const hasConflict = programs.some(program => {
      const programStart = new Date(`2000-01-01 ${program.startTime}`)
      const programEnd = new Date(`2000-01-01 ${program.endTime}`)
      return (start < programEnd && end > programStart)
    })

    if (hasConflict) {
      return res.status(400).json({ error: 'Conflito de horário detectado' })
    }

    const newProgram = {
      id: Date.now(),
      title,
      startTime,
      endTime,
      host,
      genre,
      description,
      isLive: Boolean(isLive),
      listeners: listeners || '0'
    }

    programs.push(newProgram)
    res.status(201).json(newProgram)
  } catch (error) {
    console.error('Erro ao criar programa:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// PUT /api/programs/:id - Atualizar programa
router.put('/:id', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 100 }).escape(),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('host').trim().isLength({ min: 1, max: 50 }).escape(),
  body('genre').trim().isLength({ min: 1, max: 50 }).escape(),
  body('description').trim().isLength({ min: 1, max: 300 }).escape(),
  validate
], (req, res) => {
  try {
    const { id } = req.params
    const { title, startTime, endTime, host, genre, description, isLive, listeners } = req.body

    const programIndex = programs.findIndex(p => p.id === parseInt(id))
    if (programIndex === -1) {
      return res.status(404).json({ error: 'Programa não encontrado' })
    }

    // Verificar conflito de horário (excluindo o programa atual)
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    
    if (start >= end) {
      return res.status(400).json({ error: 'Horário de início deve ser menor que o horário de fim' })
    }

    const hasConflict = programs.some((program, index) => {
      if (index === programIndex) return false
      const programStart = new Date(`2000-01-01 ${program.startTime}`)
      const programEnd = new Date(`2000-01-01 ${program.endTime}`)
      return (start < programEnd && end > programStart)
    })

    if (hasConflict) {
      return res.status(400).json({ error: 'Conflito de horário detectado' })
    }

    programs[programIndex] = {
      ...programs[programIndex],
      title,
      startTime,
      endTime,
      host,
      genre,
      description,
      isLive: Boolean(isLive),
      listeners: listeners || programs[programIndex].listeners
    }

    res.json(programs[programIndex])
  } catch (error) {
    console.error('Erro ao atualizar programa:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// DELETE /api/programs/:id - Excluir programa
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const programIndex = programs.findIndex(p => p.id === parseInt(id))
    
    if (programIndex === -1) {
      return res.status(404).json({ error: 'Programa não encontrado' })
    }

    programs.splice(programIndex, 1)
    res.json({ message: 'Programa removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar programa:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/programs/public - Listar programas públicos (frontend-user)
router.get('/public', async (req, res) => {
  try {
    const publicPrograms = programs
      .sort((a, b) => {
        const timeA = new Date(`2000-01-01 ${a.startTime}`)
        const timeB = new Date(`2000-01-01 ${b.startTime}`)
        return timeA - timeB
      })
    
    res.json(publicPrograms)
  } catch (error) {
    console.error('Erro ao buscar programas públicos:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router
