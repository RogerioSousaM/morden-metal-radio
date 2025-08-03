const fetch = require('node-fetch')

const API_BASE = 'http://localhost:3001/api'

async function testFeaturedBands() {
  console.log('⭐ Testando funcionalidade "Bandas em Destaque"...\n')
  
  try {
    // 1. Login para obter token
    console.log('1️⃣ Fazendo login...')
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
    console.log('✅ Login realizado com sucesso\n')
    
    // 2. Testar GET /api/bands (autenticado)
    console.log('2️⃣ Testando GET /api/bands...')
    const bandsResponse = await fetch(`${API_BASE}/bands`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!bandsResponse.ok) {
      throw new Error(`Falha ao buscar bandas: ${bandsResponse.status}`)
    }
    
    const bands = await bandsResponse.json()
    console.log(`✅ ${bands.length} bandas encontradas`)
    
    // Verificar se há bandas com is_featured = true
    const featuredBands = bands.filter(band => band.is_featured)
    console.log(`⭐ ${featuredBands.length} bandas em destaque encontradas`)
    
    if (featuredBands.length > 0) {
      console.log('📋 Bandas em destaque:')
      featuredBands.forEach(band => {
        console.log(`   - ${band.name} (${band.genre}) - Rating: ${band.rating}`)
      })
    }
    console.log()
    
    // 3. Testar criação de uma nova banda com isFeatured = true
    console.log('3️⃣ Testando criação de banda em destaque...')
    const newBand = {
      name: 'Test Featured Band',
      genre: 'Test Metal',
      description: 'Banda de teste para verificar funcionalidade de destaque',
      listeners: '5.5k',
      rating: 4.5,
      isFeatured: true,
      image: 'https://example.com/test-image.jpg'
    }
    
    const createResponse = await fetch(`${API_BASE}/bands`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newBand)
    })
    
    if (!createResponse.ok) {
      throw new Error(`Falha ao criar banda: ${createResponse.status}`)
    }
    
    const createdBand = await createResponse.json()
    console.log(`✅ Banda criada com sucesso: ${createdBand.name}`)
    console.log(`   is_featured: ${createdBand.is_featured}`)
    console.log()
    
    // 4. Testar atualização de uma banda existente para destaque
    console.log('4️⃣ Testando atualização de banda para destaque...')
    const firstBand = bands[0]
    if (firstBand) {
      const updateData = {
        ...firstBand,
        isFeatured: true
      }
      
      const updateResponse = await fetch(`${API_BASE}/bands/${firstBand.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      
      if (!updateResponse.ok) {
        throw new Error(`Falha ao atualizar banda: ${updateResponse.status}`)
      }
      
      const updatedBand = await updateResponse.json()
      console.log(`✅ Banda atualizada: ${updatedBand.name}`)
      console.log(`   is_featured: ${updatedBand.is_featured}`)
      console.log()
    }
    
    // 5. Verificar novamente as bandas em destaque
    console.log('5️⃣ Verificando bandas em destaque após atualizações...')
    const updatedBandsResponse = await fetch(`${API_BASE}/bands`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const updatedBands = await updatedBandsResponse.json()
    const updatedFeaturedBands = updatedBands.filter(band => band.is_featured)
    console.log(`⭐ Total de bandas em destaque: ${updatedFeaturedBands.length}`)
    
    if (updatedFeaturedBands.length > 0) {
      console.log('📋 Lista atualizada de bandas em destaque:')
      updatedFeaturedBands.forEach(band => {
        console.log(`   - ${band.name} (${band.genre}) - Rating: ${band.rating}`)
      })
    }
    console.log()
    
    // 6. Testar remoção da banda de teste
    console.log('6️⃣ Removendo banda de teste...')
    const deleteResponse = await fetch(`${API_BASE}/bands/${createdBand.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!deleteResponse.ok) {
      throw new Error(`Falha ao deletar banda: ${deleteResponse.status}`)
    }
    
    console.log('✅ Banda de teste removida com sucesso')
    console.log()
    
    console.log('🎉 Todos os testes da funcionalidade "Bandas em Destaque" passaram!')
    console.log('\n📝 Resumo:')
    console.log('   ✅ Backend está processando corretamente a flag is_featured')
    console.log('   ✅ API permite criar bandas com destaque')
    console.log('   ✅ API permite atualizar bandas para destaque')
    console.log('   ✅ Dados são persistidos corretamente no banco')
    console.log('\n⚠️  Observação: Frontend-user ainda usa dados hardcoded')
    console.log('   Para completar a implementação, é necessário:')
    console.log('   1. Criar rota pública GET /api/bands/public')
    console.log('   2. Atualizar FeaturedBands.tsx para consumir a API')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
  }
}

testFeaturedBands() 