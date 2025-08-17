const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

// Rota de teste básica
app.get('/test', (req, res) => {
  res.json({ message: 'Backend funcionando!' })
})

// Rota de bandas básica
app.get('/api/bandas', (req, res) => {
  res.json({ 
    message: 'API de bandas funcionando!',
    data: [
      { id: 1, name: 'Sleep Token', slug: 'sleep-token' },
      { id: 2, name: 'Spiritbox', slug: 'spiritbox' }
    ]
  })
})

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`)
  console.log(`📡 Teste disponível em http://localhost:${PORT}/test`)
  console.log(`🎸 Bandas disponível em http://localhost:${PORT}/api/bandas`)
})
