const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const { body, validationResult } = require('express-validator')
const router = express.Router()

// Mock data - in production, this would be stored in database
let socialLinks = {
  instagram: 'https://instagram.com/mordenmetal',
  youtube: 'https://youtube.com/@mordenmetal',
  twitter: 'https://twitter.com/mordenmetal',
  tiktok: 'https://tiktok.com/@mordenmetal'
}

// GET /api/social-links - Get all social links (public)
router.get('/', async (req, res) => {
  try {
    res.json(socialLinks)
  } catch (error) {
    console.error('Erro ao buscar links sociais:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// GET /api/social-links/admin - Get all social links (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    res.json(socialLinks)
  } catch (error) {
    console.error('Erro ao buscar links sociais:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// PUT /api/social-links - Update social links (admin only)
router.put('/', authenticateToken, [
  body('instagram').optional().isURL().withMessage('Instagram deve ser uma URL válida'),
  body('youtube').optional().isURL().withMessage('YouTube deve ser uma URL válida'),
  body('twitter').optional().isURL().withMessage('Twitter deve ser uma URL válida'),
  body('tiktok').optional().isURL().withMessage('TikTok deve ser uma URL válida')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: errors.array()
      })
    }

    const { instagram, youtube, twitter, tiktok } = req.body

    // Update only provided fields
    if (instagram !== undefined) socialLinks.instagram = instagram
    if (youtube !== undefined) socialLinks.youtube = youtube
    if (twitter !== undefined) socialLinks.twitter = twitter
    if (tiktok !== undefined) socialLinks.tiktok = tiktok

    console.log('Links sociais atualizados:', socialLinks)
    res.json({ 
      message: 'Links sociais atualizados com sucesso',
      socialLinks 
    })
  } catch (error) {
    console.error('Erro ao atualizar links sociais:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

// POST /api/social-links/reset - Reset to default values (admin only)
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    socialLinks = {
      instagram: 'https://instagram.com/mordenmetal',
      youtube: 'https://youtube.com/@mordenmetal',
      twitter: 'https://twitter.com/mordenmetal',
      tiktok: 'https://tiktok.com/@mordenmetal'
    }

    console.log('Links sociais resetados para valores padrão')
    res.json({ 
      message: 'Links sociais resetados com sucesso',
      socialLinks 
    })
  } catch (error) {
    console.error('Erro ao resetar links sociais:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

module.exports = router 