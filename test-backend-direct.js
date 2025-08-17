const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

// Rota de teste simples
app.get('/test', (req, res) => {
  res.json({ message: 'Backend funcionando!' })
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

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`)
  console.log(`📡 Teste disponível em http://localhost:${PORT}/test`)
  console.log(`🎸 Bandas disponível em http://localhost:${PORT}/api/bandas`)
})

// Tratamento de erros
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`)
  } else {
    console.error('❌ Erro no servidor:', error.message)
  }
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...')
  server.close(() => {
    console.log('✅ Servidor encerrado')
    process.exit(0)
  })
})
