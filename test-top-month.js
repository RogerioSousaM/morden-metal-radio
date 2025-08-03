const fetch = require('node-fetch')

const API_BASE = 'http://localhost:3001/api'

async function testTopMonthAPI() {
  console.log('🏆 Testando API do Top do Mês...\n')

  try {
    // 1. Testar GET /api/top-month (público - deve retornar dados ativos)
    console.log('1️⃣ Testando GET /api/top-month...')
    const response1 = await fetch(`${API_BASE}/top-month`)
    if (response1.ok) {
      const topMonthData = await response1.json()
      console.log('✅ Dados do Top do Mês:')
      console.log(`   - Banda: ${topMonthData.bandName}`)
      console.log(`   - Álbum: ${topMonthData.albumName}`)
      console.log(`   - Reproduções: ${topMonthData.playCount}`)
      console.log(`   - Status: ${topMonthData.isActive ? 'Ativo' : 'Inativo'}`)
    } else {
      console.log('❌ Top do Mês não está ativo ou não encontrado')
    }
    console.log()

    // 2. Testar login para obter token
    console.log('2️⃣ Fazendo login para obter token...')
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

    // 3. Testar GET /api/top-month/config (com autenticação)
    console.log('3️⃣ Testando GET /api/top-month/config...')
    const configResponse = await fetch(`${API_BASE}/top-month/config`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (configResponse.ok) {
      const config = await configResponse.json()
      console.log('✅ Configuração do Top do Mês:')
      console.log(`   - Banda: ${config.bandName}`)
      console.log(`   - Álbum: ${config.albumName}`)
      console.log(`   - Reproduções: ${config.playCount}`)
      console.log(`   - Link da Matéria: ${config.newsLink}`)
    } else {
      console.log('❌ Erro ao buscar configuração')
    }
    console.log()

    // 4. Testar GET /api/top-month/bands (listar bandas)
    console.log('4️⃣ Testando GET /api/top-month/bands...')
    const bandsResponse = await fetch(`${API_BASE}/top-month/bands`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (bandsResponse.ok) {
      const bands = await bandsResponse.json()
      console.log(`✅ Bandas encontradas: ${bands.length}`)
      bands.forEach(band => {
        console.log(`   - ${band.name} (${band.genre})`)
      })
    } else {
      console.log('❌ Erro ao buscar bandas')
    }
    console.log()

    // 5. Testar POST /api/top-month/bands (criar nova banda)
    console.log('5️⃣ Testando POST /api/top-month/bands...')
    const newBand = {
      name: 'TESTE BANDA',
      genre: 'Test Metal',
      description: 'Banda de teste criada via API',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center'
    }
    
    const createBandResponse = await fetch(`${API_BASE}/top-month/bands`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBand)
    })
    
    if (createBandResponse.ok) {
      const createdBand = await createBandResponse.json()
      console.log('✅ Banda criada com sucesso:')
      console.log(`   - ID: ${createdBand.id}`)
      console.log(`   - Nome: ${createdBand.name}`)
      console.log(`   - Gênero: ${createdBand.genre}`)
      
      // 6. Testar PUT /api/top-month/bands/:id (atualizar banda)
      console.log('\n6️⃣ Testando PUT /api/top-month/bands/:id...')
      const updateData = {
        name: 'TESTE BANDA ATUALIZADA',
        description: 'Banda atualizada via API'
      }
      
      const updateBandResponse = await fetch(`${API_BASE}/top-month/bands/${createdBand.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      
      if (updateBandResponse.ok) {
        const updatedBand = await updateBandResponse.json()
        console.log('✅ Banda atualizada com sucesso:')
        console.log(`   - Novo nome: ${updatedBand.name}`)
      } else {
        console.log('❌ Erro ao atualizar banda')
      }
      
      // 7. Testar PUT /api/top-month/config (atualizar configuração)
      console.log('\n7️⃣ Testando PUT /api/top-month/config...')
      const updateConfigData = {
        bandId: createdBand.id,
        albumName: 'TESTE ÁLBUM',
        albumImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=center',
        playCount: 50000,
        newsLink: '/news/teste-banda',
        isActive: true
      }
      
      const updateConfigResponse = await fetch(`${API_BASE}/top-month/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateConfigData)
      })
      
      if (updateConfigResponse.ok) {
        const updatedConfig = await updateConfigResponse.json()
        console.log('✅ Configuração atualizada com sucesso:')
        console.log(`   - Nova banda: ${updatedConfig.bandName}`)
        console.log(`   - Novo álbum: ${updatedConfig.albumName}`)
        console.log(`   - Novas reproduções: ${updatedConfig.playCount}`)
      } else {
        console.log('❌ Erro ao atualizar configuração')
      }
      
      // 8. Testar DELETE /api/top-month/bands/:id
      console.log('\n8️⃣ Testando DELETE /api/top-month/bands/:id...')
      const deleteBandResponse = await fetch(`${API_BASE}/top-month/bands/${createdBand.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (deleteBandResponse.ok) {
        console.log('✅ Banda excluída com sucesso')
      } else {
        console.log('❌ Erro ao excluir banda')
      }
      
    } else {
      console.log('❌ Erro ao criar banda')
    }

    // 9. Testar GET /api/top-month/stats (estatísticas)
    console.log('\n9️⃣ Testando GET /api/top-month/stats...')
    const statsResponse = await fetch(`${API_BASE}/top-month/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ Estatísticas do Top do Mês:')
      console.log(`   - Total de Bandas: ${stats.totalBands}`)
      console.log(`   - Status: ${stats.isActive ? 'Ativo' : 'Inativo'}`)
      console.log(`   - Banda Atual: ${stats.currentBand}`)
      console.log(`   - Reproduções: ${stats.playCount}`)
      console.log(`   - Última Atualização: ${stats.lastUpdated}`)
    } else {
      console.log('❌ Erro ao buscar estatísticas')
    }

    console.log('\n🎉 Todos os testes concluídos!')
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message)
  }
}

// Executar testes
testTopMonthAPI() 