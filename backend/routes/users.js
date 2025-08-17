const express = require('express')
const router = express.Router()
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

// Middleware de validação
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

// Mock database (substituir por banco real)
let users = [
  {
    id: 1,
    username: 'admin',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'moderator',
    role: 'moderator',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

// Listar todos os usuários (admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const allUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }))

    res.json(allUsers)
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Criar novo usuário (admin)
router.post('/', [
  authenticateToken,
  body('username').trim().isLength({ min: 3, max: 50 }).escape(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'moderator', 'user']),
  validate
], async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const { username, password, role } = req.body

    // Verificar se o username já existe
    const existingUser = users.find(u => u.username === username)
    if (existingUser) {
      return res.status(400).json({ error: 'Nome de usuário já existe' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id: Date.now(),
      username,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    users.push(newUser)

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Atualizar usuário (admin)
router.put('/:id', [
  authenticateToken,
  body('username').optional().trim().isLength({ min: 3, max: 50 }).escape(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['admin', 'moderator', 'user']),
  validate
], async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const { id } = req.params
    const { username, password, role } = req.body

    const userIndex = users.findIndex(u => u.id === parseInt(id))
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Verificar se o username já existe (exceto para o usuário atual)
    if (username && username !== users[userIndex].username) {
      const existingUser = users.find(u => u.username === username)
      if (existingUser) {
        return res.status(400).json({ error: 'Nome de usuário já existe' })
      }
    }

    // Atualizar usuário
    if (username) users[userIndex].username = username
    if (role) users[userIndex].role = role
    if (password) {
      users[userIndex].password = await bcrypt.hash(password, 10)
    }
    users[userIndex].updatedAt = new Date().toISOString()

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = users[userIndex]
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Deletar usuário (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const { id } = req.params

    // Não permitir deletar o próprio usuário
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'Não é possível deletar seu próprio usuário' })
    }

    const userIndex = users.findIndex(u => u.id === parseInt(id))
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    users.splice(userIndex, 1)
    res.json({ message: 'Usuário removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// Buscar usuário específico (admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Verificar se o usuário é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const { id } = req.params
    const user = users.find(u => u.id === parseInt(id))
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    // Retornar usuário sem senha
    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router
