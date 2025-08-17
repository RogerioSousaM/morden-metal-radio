const express = require('express')
const app = express()
const PORT = 3001

console.log('1️⃣ Express carregado')

app.use(express.json())
console.log('2️⃣ Middleware JSON configurado')

// Teste básico
app.get('/test', (req, res) => {
  console.log('3️⃣ Rota /test acessada')
  res.json({ message: 'Backend funcionando!' })
})

// Teste da rota de bandas
app.get('/api/bandas', (req, res) => {
  console.log('4️⃣ Rota /api/bandas acessada')
  res.json({ 
    message: 'API de bandas funcionando!',
    data: [
      { id: 1, name: 'Sleep Token', slug: 'sleep-token' },
      { id: 2, name: 'Spiritbox', slug: 'spiritbox' }
    ]
  })
})

console.log('5️⃣ Rotas configuradas')

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`)
  console.log(`📡 Teste disponível em http://localhost:${PORT}/test`)
  console.log(`🎸 Bandas disponível em http://localhost:${PORT}/api/bandas`)
})

console.log('6️⃣ Servidor iniciado')

// Tratamento de erros
server.on('error', (error) => {
  console.error('❌ Erro no servidor:', error.message)
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso`)
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
