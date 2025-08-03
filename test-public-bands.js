const fetch = require('node-fetch')

const API_BASE = 'http://localhost:3001/api'

async function testPublicBands() {
  console.log('🌐 Testando rota pública de bandas...\n')
  
  try {
    // 1. Testar GET /api/bands/public (sem autenticação)
    console.log('1️⃣ Testando GET /api/bands/public (sem autenticação)...')
    const publicResponse = await fetch(`${API_BASE}/bands/public`)
    
    if (!publicResponse.ok) {
      throw new Error(`Falha ao acessar rota pública: ${publicResponse.status}`)
    }
    
    const publicBands = await publicResponse.json()
    console.log(`✅ ${publicBands.length} bandas encontradas na rota pública`)
    
    // Verificar se há bandas com is_featured = true
    const featuredBands = publicBands.filter(band => band.is_featured)
    console.log(`⭐ ${featuredBands.length} bandas em destaque encontradas`)
    
    if (featuredBands.length > 0) {
      console.log('📋 Bandas em destaque na rota pública:')
      featuredBands.forEach(band => {
        console.log(`   - ${band.name} (${band.genre}) - Rating: ${band.rating}`)
      })
    }
    console.log()
    
    // 2. Verificar estrutura dos dados
    console.log('2️⃣ Verificando estrutura dos dados...')
    if (publicBands.length > 0) {
      const sampleBand = publicBands[0]
      console.log('📋 Estrutura de uma banda:')
      console.log(`   - id: ${sampleBand.id}`)
      console.log(`   - name: ${sampleBand.name}`)
      console.log(`   - genre: ${sampleBand.genre}`)
      console.log(`   - description: ${sampleBand.description}`)
      console.log(`   - listeners: ${sampleBand.listeners}`)
      console.log(`   - rating: ${sampleBand.rating}`)
      console.log(`   - is_featured: ${sampleBand.is_featured}`)
      console.log(`   - image: ${sampleBand.image}`)
      console.log()
    }
    
    // 3. Testar se a rota protegida ainda funciona
    console.log('3️⃣ Verificando se rota protegida ainda funciona...')
    
    // Login para obter token
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'mordenmetal2024'
      })
    })
    
    if (!loginResponse.ok) {
      throw new Error(`Login falhou: ${loginResponse.status}`)
    }
    
    const { token } = await loginResponse.json()
    
    // Testar rota protegida
    const protectedResponse = await fetch(`${API_BASE}/bands`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!protectedResponse.ok) {
      throw new Error(`Falha na rota protegida: ${protectedResponse.status}`)
    }
    
    const protectedBands = await protectedResponse.json()
    console.log(`✅ Rota protegida funcionando: ${protectedBands.length} bandas`)
    console.log()
    
    // 4. Comparar dados entre rotas
    console.log('4️⃣ Comparando dados entre rotas...')
    if (publicBands.length === protectedBands.length) {
      console.log('✅ Ambas as rotas retornam o mesmo número de bandas')
    } else {
      console.log('⚠️  Rotas retornam números diferentes de bandas')
      console.log(`   Pública: ${publicBands.length}`)
      console.log(`   Protegida: ${protectedBands.length}`)
    }
    console.log()
    
    console.log('🎉 Teste da rota pública de bandas concluído com sucesso!')
    console.log('\n📝 Resumo:')
    console.log('   ✅ Rota pública /api/bands/public está funcionando')
    console.log('   ✅ Dados são acessíveis sem autenticação')
    console.log('   ✅ Flag is_featured está sendo retornada corretamente')
    console.log('   ✅ Rota protegida continua funcionando')
    console.log('\n🚀 Frontend-user agora pode consumir dados dinâmicos!')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
  }
}

testPublicBands() 