const fetch = require('node-fetch')

const API_BASE = 'http://localhost:3001/api'

async function testCarouselAPI() {
  console.log('🧪 Testando API do Carrossel...\n')

  try {
    // 1. Testar GET /api/carousel (sem autenticação - deve retornar slides)
    console.log('1️⃣ Testando GET /api/carousel...')
    const response1 = await fetch(`${API_BASE}/carousel`)
    const slides = await response1.json()
    console.log(`✅ Slides encontrados: ${slides.length}`)
    slides.forEach(slide => {
      console.log(`   - ${slide.title} (${slide.type}) - ${slide.isActive ? 'Ativo' : 'Inativo'}`)
    })
    console.log()

    // 2. Testar GET /api/carousel/active
    console.log('2️⃣ Testando GET /api/carousel/active...')
    const response2 = await fetch(`${API_BASE}/carousel/active`)
    const activeSlides = await response2.json()
    console.log(`✅ Slides ativos: ${activeSlides.length}`)
    console.log()

    // 3. Testar login para obter token
    console.log('3️⃣ Fazendo login para obter token...')
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'mordenmetal2024'
      })
    })
    
    if (!loginResponse.ok) {
      throw new Error('Falha no login')
    }
    
    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log('✅ Login realizado com sucesso')
    console.log()

    // 4. Testar GET /api/carousel/stats (com autenticação)
    console.log('4️⃣ Testando GET /api/carousel/stats...')
    const statsResponse = await fetch(`${API_BASE}/carousel/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ Estatísticas do carrossel:')
      console.log(`   - Total: ${stats.total}`)
      console.log(`   - Ativos: ${stats.active}`)
      console.log(`   - Imagens: ${stats.images}`)
      console.log(`   - Vídeos: ${stats.videos}`)
    } else {
      console.log('❌ Erro ao buscar estatísticas')
    }
    console.log()

    // 5. Testar POST /api/carousel (criar novo slide)
    console.log('5️⃣ Testando POST /api/carousel...')
    const newSlide = {
      title: 'TESTE SLIDE',
      description: 'Slide de teste criado via API',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop&crop=center',
      type: 'image',
      isActive: true
    }
    
    const createResponse = await fetch(`${API_BASE}/carousel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSlide)
    })
    
    if (createResponse.ok) {
      const createdSlide = await createResponse.json()
      console.log('✅ Slide criado com sucesso:')
      console.log(`   - ID: ${createdSlide.id}`)
      console.log(`   - Título: ${createdSlide.title}`)
      console.log(`   - Ordem: ${createdSlide.order}`)
      
      // 6. Testar PUT /api/carousel/:id (atualizar slide)
      console.log('\n6️⃣ Testando PUT /api/carousel/:id...')
      const updateData = {
        title: 'TESTE SLIDE ATUALIZADO',
        description: 'Slide atualizado via API'
      }
      
      const updateResponse = await fetch(`${API_BASE}/carousel/${createdSlide.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      if (updateResponse.ok) {
        const updatedSlide = await updateResponse.json()
        console.log('✅ Slide atualizado com sucesso:')
        console.log(`   - Novo título: ${updatedSlide.title}`)
      } else {
        console.log('❌ Erro ao atualizar slide')
      }
      
      // 7. Testar DELETE /api/carousel/:id
      console.log('\n7️⃣ Testando DELETE /api/carousel/:id...')
      const deleteResponse = await fetch(`${API_BASE}/carousel/${createdSlide.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (deleteResponse.ok) {
        console.log('✅ Slide excluído com sucesso')
      } else {
        console.log('❌ Erro ao excluir slide')
      }
      
    } else {
      console.log('❌ Erro ao criar slide')
    }

    console.log('\n🎉 Todos os testes concluídos!')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
  }
}

// Executar testes
testCarouselAPI() 