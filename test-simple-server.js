const express = require('express')
const app = express()
const PORT = 3002

app.use(express.json())

// Rota de teste simples
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando!' })
})

// Rota para testar bandas
app.get('/api/bandas', (req, res) => {
  res.json({ 
    message: 'API de bandas funcionando!',
    data: [
      { id: 1, name: 'Sleep Token', slug: 'sleep-token' },
      { id: 2, name: 'Spiritbox', slug: 'spiritbox' }
    ]
  })
})

app.listen(PORT, () => {
  console.log(`🧪 Servidor de teste rodando na porta ${PORT}`)
  console.log(`📡 Teste disponível em http://localhost:${PORT}/test`)
  console.log(`🎸 Bandas disponível em http://localhost:${PORT}/api/bandas`)
})
